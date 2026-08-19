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

type QueryField = 'keyphrase' | 'seedItemId' | 'seedItemUrl';

const cliName = process.env.MLT_CLI_NAME || 'mlt-curl.sh';

const usage = (): void => {
  console.error(`Usage: ${cliName} keyphrase <text>`);
  console.error(`       ${cliName} seedid <id>`);
  console.error(`       ${cliName} seedurl <url>`);
  console.error(`       ${cliName} --keyphrase <text>`);
  console.error(`       ${cliName} --seed-id <id>`);
  console.error(`       ${cliName} --seed-url <url>`);
};

const setQueryField = (
  current: QueryField | '',
  field: QueryField,
  value: string | undefined
): QueryField => {
  if (!value) {
    usage();
    process.exit(1);
  }

  if (current) {
    console.error(
      'Query fields are mutually exclusive. Provide only one of: keyphrase, seedid, seedurl.'
    );
    process.exit(1);
  }

  return field;
};

const parseArgs = (argv: string[]): { field: QueryField; value: string } => {
  let field: QueryField | '' = '';
  let value = '';

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    switch (arg) {
      case 'keyphrase':
      case '--keyphrase':
        field = setQueryField(field, 'keyphrase', next);
        value = next;
        i += 1;
        break;
      case 'seedid':
      case '--seed-id':
      case '--seedid':
        field = setQueryField(field, 'seedItemId', next);
        value = next;
        i += 1;
        break;
      case 'seedurl':
      case '--seed-url':
      case '--seedurl':
        field = setQueryField(field, 'seedItemUrl', next);
        value = next;
        i += 1;
        break;
      case '-h':
      case '--help':
        usage();
        process.exit(0);
        break;
      default:
        console.error(`Unknown argument: ${arg}`);
        usage();
        process.exit(1);
    }
  }

  if (!field) {
    usage();
    process.exit(1);
  }

  return { field, value };
};

const main = async (): Promise<void> => {
  const { field, value } = parseArgs(process.argv.slice(2));
  const searchIndexId = requireEnv('SEARCH_INDEX_ID');
  const edgeUrl = getEdgeUrl();
  const locale = getLocale();
  const limit = parseNonNegativeInteger(process.env.LIMIT, DEFAULT_LIMIT, 'LIMIT');
  const offset = parseNonNegativeInteger(process.env.OFFSET, DEFAULT_OFFSET, 'OFFSET');

  const params: SearchParameters = {
    searchIndexId,
    limit,
    offset,
    [field]: value,
    ...(locale ? { locale } : {}),
  };

  console.error(`Using local SearchService (${field}) -> POST ${edgeUrl}/v1/search`);
  console.error(`${field}: ${value}`);
  console.error(`limit: ${limit}  offset: ${offset}`);
  if (locale) {
    console.error(`locale: ${locale}`);
  }
  console.error();

  const response = await createSearchService().search(params);
  console.log(JSON.stringify(response, null, 2));
};

main().catch(exitWithError);
