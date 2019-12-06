export type CacheEntry = {
    statusCode: number;
    html: string;
};

const cacheMap: Map<string, CacheEntry> = new Map();

export function setCache(location: string, entry: CacheEntry): void {
    cacheMap.set(location, entry);
}

export function getCache(location: string): CacheEntry | null {
    return cacheMap.get(location) || null;
}
