import { SearchParameters } from '../src/search-service';
import {
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
  createSearchService,
  exitWithError,
  getEdgeUrl,
  getLocale,
  parseNonNegativeInteger,
  requireEnv,
} from './sdk-smoke';

const cliName = process.env.SEARCH_CLI_NAME || 'search-curl.sh';

const usage = (): void => {
  console.error(`Usage: ${cliName} [keyphrase]`);
  console.error(`       ${cliName}            # empty keyphrase (all results)`);
};

const parseKeyphrase = (argv: string[]): string => {
  if (argv[0] === '-h' || argv[0] === '--help') {
    usage();
    process.exit(0);
  }

  if (argv.length > 1) {
    console.error(`Unknown argument: ${argv[1]}`);
    usage();
    process.exit(1);
  }

  return argv[0] ?? '';
};

const main = async (): Promise<void> => {
  const keyphrase = parseKeyphrase(process.argv.slice(2));
  const searchIndexId = requireEnv('SEARCH_INDEX_ID');
  const edgeUrl = getEdgeUrl();
  const locale = getLocale();
  const limit = parseNonNegativeInteger(process.env.LIMIT, DEFAULT_LIMIT, 'LIMIT');
  const offset = parseNonNegativeInteger(process.env.OFFSET, DEFAULT_OFFSET, 'OFFSET');

  const params: SearchParameters = {
    searchIndexId,
    keyphrase,
    limit,
    offset,
    ...(locale ? { locale } : {}),
  };

  console.error(`Using local SearchService (keyphrase) -> POST ${edgeUrl}/v1/search`);
  console.error(`keyphrase: ${keyphrase || '(empty)'}`);
  console.error(`limit: ${limit}  offset: ${offset}`);
  if (locale) {
    console.error(`locale: ${locale}`);
  }
  console.error();

  const response = await createSearchService().search(params);
  console.log(JSON.stringify(response, null, 2));
};

main().catch(exitWithError);
