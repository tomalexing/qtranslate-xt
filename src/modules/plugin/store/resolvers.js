import * as actions from "./actions";


/**
 * getLanguages resolver
 * @returns
 */
export function* getLanguages() {
    let languages = yield actions.fetchLanguages();
    return actions.setLanguages(languages)
}
