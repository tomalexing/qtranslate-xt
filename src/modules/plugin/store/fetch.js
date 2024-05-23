/**
 * Function for Get Settings
 * @returns
 */

const nonce = window.QtranslateAjax.admin_nonce;
const getSettingsAction = 'qtranslate_options';

export const getSettings = () => {
    let data = new FormData();
    data.append("admin_nonce", nonce);
    data.append("action", getSettingsAction);

    return fetch(QtranslateAjax.ajax_url, {
        method: 'POST',
        body: data,
    }) // wrapped
        .then(res => res.text())
        .then(data => {
            const response = JSON.parse(data);
            if (response.success) {
                return response.data
            }
            else {
                return false;
            }
        })
        .catch(err => console.log(err));
}