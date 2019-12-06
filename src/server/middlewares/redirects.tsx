import { Request, Response } from 'express';

import logger from 'server/utils/logger';
import { getActiveRedirect, RedirectDescriptor } from 'common/utils/router';
import { redirects as rules } from 'common/redirects';

export default function redirectMiddleware(req: Request, res: Response, next: () => void): void {
    const { path } = req;
    const activeRedirect: RedirectDescriptor | null = getActiveRedirect(path, rules);
    if (activeRedirect === null) {
        return next();
    }

    logger.debug(`Redirect to ${activeRedirect.to}`);
    res.writeHead(activeRedirect.statusCode || 302, {
        Location: activeRedirect.to,
    });

    res.end();
}
