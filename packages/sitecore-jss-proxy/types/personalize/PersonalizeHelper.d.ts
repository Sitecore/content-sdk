import { LayoutServiceData } from '@sitecore-jss/sitecore-jss/layout';
import { PersonalizeInfo } from '@sitecore-jss/sitecore-jss/personalize';
import { IncomingHttpHeaders, IncomingMessage, OutgoingMessage } from 'http';
import { ExperienceParams, PersonalizeConfig, PersonalizeExecution } from '../types/personalize';
export declare class PersonalizeHelper {
    protected config: PersonalizeConfig;
    private personalizeService;
    private defaultHostname;
    constructor(config: PersonalizeConfig);
    /**
     * Performs personalize on layout data before a page is rendered
     * @param {IncomingMessage} req Incoming request nodejs object
     * @param {OutgoingMessage} res Outgoing response nodejs object
     * @param {LayoutServiceData} layoutData layoutData for the page
     * @returns layout data with personalization applied
     */
    personalizeLayoutData: (req: IncomingMessage, res: OutgoingMessage, layoutData: LayoutServiceData) => Promise<LayoutServiceData>;
    /**
     * Init CloudSDK personalization on server side
     * @param {IncomingMessage} request incoming nodejs request object
     * @param {OutgoingMessage} response outgoing nodejs response object
     * @param {string} hostname host for cookies. Usually a host header, or a fallback config
     */
    protected initPersonalizeServer(request: IncomingMessage, response: OutgoingMessage, hostname: string): Promise<void>;
    protected getVariantIds: (req: IncomingMessage, language: string, pathname: string) => Promise<string[]>;
    protected getLanguage(layoutData: LayoutServiceData): string;
    protected getHostHeader(req: IncomingMessage): string;
    protected excludeRoute(pathname: string): boolean | undefined;
    protected extractDebugHeaders(incomingHeaders: IncomingHttpHeaders): {
        [key: string]: string | string[] | undefined;
    };
    protected personalize({ params, friendlyId, language, timeout, variantIds, }: {
        params: ExperienceParams;
        friendlyId: string;
        language: string;
        timeout?: number;
        variantIds?: string[];
    }, request: IncomingMessage): Promise<{
        variantId: string;
    }>;
    protected getExperienceParams(req: IncomingMessage): ExperienceParams;
    protected getPersonalizeExecutions(personalizeInfo: PersonalizeInfo, language: string): PersonalizeExecution[];
}
