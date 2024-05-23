import { getSettings } from "./fetch";
/**
 * Fetch Languages from Database using AJAX
 * @returns {Object || false}
 */
export function FETCH_LANGUAGES(action) {
    return getSettings().then(response => {
        if (response && typeof response === 'object') {
            if (response['default_language'] && typeof response['language_config'] === 'object') {
                return response
            }
            else {
                return false
            }
        }
        else {
            return false
        }
    });
}