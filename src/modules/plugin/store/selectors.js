/**
 * Selector: Get Current Language
 * @param {*} state
 * @returns
 */
export function getCurrentLanguage(state) {
    const { currentLanguage } = state
    return currentLanguage;
}
/**
 * Selector: Get Previous Language
 * @param {*} state
 * @returns
 */
export function getPreviousLanguage(state) {
    const { previousLanguage } = state
    return previousLanguage;
}


/**
 * Selector: Get languages
 * @param {*} state
 * @returns
 */
export function getLanguages(state) {
    const { languages } = state
    return languages;
}