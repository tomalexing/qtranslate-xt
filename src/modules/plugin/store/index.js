/**
 * Store Setup
 */
import {
    createReduxStore,
    register,
    select,
    subscribe,
    dispatch,
    combineReducers
} from '@wordpress/data';

import * as actions from "./actions"
import * as selectors from "./selectors"
import * as controls from "./controls"
import * as resolvers from "./resolvers"
import reducer from "./reducer"


/**
 * Create WP Redux Store
 */
const store = createReduxStore(
    'qtranslate-xt',
    {
        reducer,
        actions,
        selectors,
        controls,
        resolvers
    }
);

register(store);


/**
 * Save Global Values on Save Page/Post
 */

subscribe(() => {
 

    // const isSavingPost = select('core/editor').isSavingPost();
    // const isAutosavingPost = select('core/editor').isAutosavingPost();

    // const ebIsSaving = select('essential-blocks').getIsSaving()
    // console.log(ebIsSaving, isAutosavingPost, isSavingPost)
 
    // if (!ebIsSaving || isAutosavingPost || !isSavingPost) {
    //     return;
    // }
    // /**
    //  * Action
    //  */
    // //Global Colors
    // const getLanguages = select('qtranslate-xt').getLanguages()
    // console.log(getLanguages)
 
});