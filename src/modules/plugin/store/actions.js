import {CURRENT_LANGUAGE, FETCH_LANGUAGES, SET_LANGUAGES} from './constants'


/**
 * Action: Set Current Language
 */
export function setCurrentLanguage(value) {
    return {
        type: CURRENT_LANGUAGE,
        value,
    }
}
/**
 * Action: Set fetchLanguages Languages
 */
export function fetchLanguages() {
    return {
        type: FETCH_LANGUAGES,
    }
}
/**
 * Action: Set Languages
 */
export function setLanguages(value) {
    return {
        type: SET_LANGUAGES,
        value,
    }
}
