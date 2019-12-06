import { Request, Response } from 'express';
import { DEFAULT_LOCALE_SHORT_CODE, getLocales, Locale } from 'common/utils/locale';

export default function language(req: Request, res: Response, next: () => void): void {
    if (req.cookies['user-locale']) {
        next();

        return;
    }

    const languages = req.acceptsLanguages();
    const locales = getLocales();
    const findLang = (language: string) => {
        return Boolean(locales.find((locale: Locale) => language === locale.shortCode));
    };
    
    const lang: string = languages.find(findLang) || DEFAULT_LOCALE_SHORT_CODE;
    res.cookie('user-locale', lang, { maxAge: 900000 });
    next();
}
