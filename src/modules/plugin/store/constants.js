export const cookieKey = 'switch_qtx_lang';
const cookieArray = document.cookie.matchAll(new RegExp(String.raw`${cookieKey}=(.[^;])`,'g')).next().value;
const cookieValue = cookieArray ? cookieArray[1] : 'en';
export const DEFAULT_STATE = {
    currentLanguage: cookieValue ?? window.QtranslateAjax?.settings.default_language ?? 'en',
    previousLanguage: cookieValue ?? window.QtranslateAjax?.settings.default_language ?? 'en',
    languages:  {},
};

export const CURRENT_LANGUAGE = 'CURRENT_LANGUAGE';
export const FETCH_LANGUAGES = 'FETCH_LANGUAGES';
export const SET_LANGUAGES = 'SET_LANGUAGES';