const KEY_USER = 'mr.user';
const KEY_LANGUAGE = 'mr.language';
const USER_LANGUAGE_CODE = (user) => user ? user.language_code : 'en';

export default {
    _user: null,
    _language: null,

    get user() {
        if (!this._user) {
            let storedUser = localStorage.getItem(KEY_USER);
            if (storedUser != null) {
                this._user = JSON.parse(storedUser);
                this._language = USER_LANGUAGE_CODE(this._user);
            }
        }

        return this._user;
    },

    set user(user) {
        if (user) {
            this._user = user;
            this._language = USER_LANGUAGE_CODE(user);
            localStorage.setItem(KEY_USER, JSON.stringify(user));
            localStorage.setItem(KEY_LANGUAGE, this._language);
        } else {
            localStorage.removeItem(KEY_USER);
            this._user = null;
        }
    },

    get language() {
        if (!this._language) {
            let stored = localStorage.getItem(KEY_LANGUAGE);
            if (stored) {
                this._language = stored;
            }
        }

        return this._language;
    },

    set language(language) {
        this._language = language;
        localStorage.setItem(KEY_LANGUAGE, language);
    },

    clear: function () {
        localStorage.removeItem(KEY_USER);
        localStorage.removeItem(KEY_LANGUAGE);
        this._user = null;
        this._language = null;
    }
}