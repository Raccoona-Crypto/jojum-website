import { Request, Response } from 'express';

import logger from 'server/utils/logger';
import template from 'server/utils/template';

export default function devMiddleware(_req: Request, res: Response, next: () => void): void {
    if (process.env.NODE_ENV !== 'development') {
        return next();
    }

    logger.debug(_req.path);
    const html = template({
        chunks: ['vendors', 'main'],
    });

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.write(html);
    res.end();
}
