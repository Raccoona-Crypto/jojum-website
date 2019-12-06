import React from 'react';

const headContent = `
    document.addEventListener('DOMContentLoaded', function(){
        setTimeout(function(){
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=!0;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','{gtmKey}');
        }, 3000);
    });
`;

export default class GtmManager {
    protected readonly gtmKey: string;

    public constructor(gtmKey: string) {
        this.gtmKey = gtmKey;
    }

    public renderHead(): JSX.Element {
        const content = headContent.replace('{gtmKey}', this.gtmKey);

        return <script dangerouslySetInnerHTML={{ __html: content }} />;
    }

    public renderBody(): JSX.Element {
        return (
            <noscript>
                <iframe
                    src={`https://www.googletagmanager.com/ns.html?id=${this.gtmKey}`}
                    style={{ display: 'none', visibility: 'hidden', height: 0, width: 0 }}
                />
            </noscript>
        );
    }
}
