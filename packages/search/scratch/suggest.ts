import { SuggestParameters } from '../src/search-service';
import {
  createSearchService,
  exitWithError,
  getEdgeUrl,
  getLocale,
  requireEnv,
} from './sdk-smoke';

const cliName = process.env.SUGGEST_CLI_NAME || 'suggest-curl.sh';

const usage = (): void => {
  console.error(`Usage: ${cliName} <keyphrase>`);
};

const parseKeyphrase = (argv: string[]): string => {
  if (argv[0] === '-h' || argv[0] === '--help') {
    usage();
    process.exit(0);
  }

  if (argv.length !== 1) {
    usage();
    process.exit(1);
  }

  return argv[0];
};

const main = async (): Promise<void> => {
  const keyphrase = parseKeyphrase(process.argv.slice(2));
  const searchIndexId = requireEnv('SEARCH_INDEX_ID');
  const edgeUrl = getEdgeUrl();
  const locale = getLocale();

  const params: SuggestParameters = {
    searchIndexId,
    keyphrase,
    ...(locale ? { locale } : {}),
  };

  console.error(`Using local SearchService (keyphrase) -> POST ${edgeUrl}/v1/search/suggest`);
  console.error(`keyphrase: ${keyphrase}`);
  if (locale) {
    console.error(`locale: ${locale}`);
  }
  console.error();

  const response = await createSearchService().suggest(params);
  console.log(JSON.stringify(response, null, 2));
};

main().catch(exitWithError);
