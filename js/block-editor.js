/**
 * Middleware handler for the block editor (Gutenberg).
 *
 * $author herrvigg
 */
'use strict';

(function () {  
    // console.log('QT-XT API: setup apiFetch');
    wp.apiFetch.use((options, next) => {
        if (!options.path || (options.method !== 'PUT' && options.method !== 'POST')) {
            return next(options);
        }
        const editor = wp.data.select('core/editor');
        const qtranslateStore = wp.data.select('qtranslate-xt');
        const switchLanguage = qtranslateStore.getCurrentLanguage();
        const previousLanguage = qtranslateStore.getPreviousLanguage();
        if (!editor) {
            return next(options);
        }
        // A better event handler is needed to understand when the post is saved.
        // For now "wait" by ignoring all API calls until the post is loaded in the editor.
        const post = editor.getCurrentPost();
        // console.log('QT-XT API: PRE handling method=' + options.method, 'path=' + options.path, 'post=', post);
        if (!post.hasOwnProperty('type')) {
            return next(options);
        }
        const typeData = wp.data.select('core').getPostType(post.type);
        if (!typeData.hasOwnProperty('rest_base')) {
            return next(options);
        }
        console.log('QT-XT API: PRE handling method=' + options.method, 'path=' + options.path, 'post=', post, 'type=', typeData);
        const prefixPath = '/wp/v2/' + typeData.rest_base + '/' + post.id;

        if ((options.path.startsWith(prefixPath) && options.method === 'PUT') ||
            (options.path.startsWith(prefixPath + '/autosaves') && options.method === 'POST') || 
            options.path.startsWith('/wp/v2/settings') && options.data.title) {
            // console.log('QT-XT API: handling method=' + options.method, 'path=' + options.path, 'post=', post);
            if (!post.hasOwnProperty('qtx_editor_lang') && !switchLanguage) {
                console.log('QT-XT API: missing field [qtx_editor_lang] in post id=' + post.id);
                return next(options);
            }

             const newOptions = {
                ...options,
                data: {
                    ...options.data,
                    'wp_id': post.wp_id,
                    'qtx_editor_lang': post.qtx_editor_lang ?? previousLanguage,
                    'switch_qtx_lang': switchLanguage,
                }
            };
            // console.log('QT-XT API: using options=', options);
            const result = next(newOptions);
            return result;
        }
        return next(options);
    });
})();
