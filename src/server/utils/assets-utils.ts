import fs from 'fs';
import path from 'path';
import { isString, find } from 'lodash';

import logger from 'server/utils/logger';

export const jsRe = /\.js$/;
export const cssRe = /\.css$/;

export type Stats = Record<string, string[] | string | undefined>;
let stats: Stats = {};

try {
    stats = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'dest/stats.json'), 'utf8'));
} catch (err) {
    logger.error({ msg: 'Load webpack stats-file error', error: err.toString() });
}

export function getCSSChunksMap(): Stats {
    const chunks = Object.keys(stats);

    const result: Stats = {};
    for (const chunk of chunks) {
        let chunkAssets = stats[chunk] || [];
        if (isString(chunkAssets)) {
            chunkAssets = [chunkAssets];
        }

        chunkAssets = chunkAssets.filter((filePath: string) => Boolean(filePath.match(cssRe)));
        if (chunkAssets.length !== 0) {
            result[chunk] = chunkAssets;
        }
    }

    return result;
}

export function getChunkAssetFilePath(chunk: string, re: RegExp = jsRe): string {
    let chunkAssets = stats[chunk] || [];
    if (isString(chunkAssets)) {
        chunkAssets = [chunkAssets];
    }

    const chunkAssetFilePath = find(chunkAssets, (filePath: string) => Boolean(filePath.match(re)));
    if (chunkAssetFilePath === undefined) {
        throw new Error(`Chunk: ${chunk} has no ${re.toString()} file`);
    }

    return `${process.env.PUBLIC_PATH || ''}/${chunkAssetFilePath}`;
}
