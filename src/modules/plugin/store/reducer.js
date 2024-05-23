import {DEFAULT_STATE,
    CURRENT_LANGUAGE,
    FETCH_LANGUAGES,
    SET_LANGUAGES} from './constants'


export default function reducer(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case CURRENT_LANGUAGE:
            return {
                ...state,
                previousLanguage: state.currentLanguage,
                currentLanguage: action.value,
            };
        case FETCH_LANGUAGES:
            return state;
        case SET_LANGUAGES:
            return {
                ...state,
                languages: { ...action.value.language_config }
            };
        default:
            return state;
    }
}