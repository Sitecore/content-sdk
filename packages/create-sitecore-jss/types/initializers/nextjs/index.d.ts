import { Initializer } from '../../common';
import { NextjsArgs } from './args';
export default class NextjsInitializer implements Initializer {
    init(args: NextjsArgs): Promise<{}>;
}
