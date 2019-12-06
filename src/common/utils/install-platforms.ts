import Icons from 'common/components/icons';

export type PlatformType
    = 'apple'
    | 'android'
    | 'chrome'
    | 'firefox'
    | 'opera'
    | 'safari';

export type Platform = {
    key: PlatformType;
    icon: any;
    url: string;
    badge: string;
};

export default {
    apple: {
        key: 'apple',
        icon: Icons.Apple as any,
        url: 'https://itunes.apple.com/app/apple-store/id1455862890?pt=118337376&ct=site&mt=8',
        badge: '/img/store/app-store.svg',
    },
    chrome: {
        key: 'chrome',
        icon: Icons.Chrome as any,
        url: 'https://chrome.google.com/webstore/detail/plark/jgboighcjegimmmjkclbniaddfakallg',
        badge: '/img/store/chrome-web-store.svg',
    },
} as Record<PlatformType, Platform>;