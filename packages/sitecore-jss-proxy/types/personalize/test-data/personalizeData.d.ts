export declare const mountainBikeVariant: {
    uid: string;
    componentName: string;
    dataSource: string;
    fields: {
        content: {
            value: string;
        };
        heading: {
            value: string;
        };
    };
};
export declare const cityBikeVariant: {
    uid: string;
    componentName: string;
    dataSource: string;
    fields: {
        content: {
            value: string;
        };
        heading: {
            value: string;
        };
    };
};
export declare const component_variant: {
    uid: string;
    componentName: string;
    dataSource: string;
    fields: {
        content: {
            value: string;
        };
        heading: {
            value: string;
        };
    };
};
export declare const getPersonalizeLayoutData: (variant: string, language?: string, path?: string) => {
    sitecore: {
        context: {
            pageEditing: boolean;
            site: {
                name: string;
            };
            visitorIdentificationTimestamp: number;
            language: string;
            variantId: string;
            itemPath: string;
        };
        route: {
            name: string;
            placeholders: {
                main: {};
            };
        };
    };
};
