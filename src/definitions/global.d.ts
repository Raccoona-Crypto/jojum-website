// tslint:disable:no-any
declare global {
    type ClientConfig = {
        host: string;
        isSecure: boolean;
    };

    interface Window {
        __initData: Record<string, any> & { config: ClientConfig };
        __cssChunksMap: Record<string, string[]>;
        ga: any;
        gaClientId: any;
        dataLayer: any;
    }

    type AnyFunc = (...args: any[]) => Promise<any>;

    const __isBrowser__: boolean;
}

export {};
