import AccountApi from '@/service/api/account';
import HttpError from '@/service/local/HttpErrorService';
import axios from 'axios';
import router from '@/router';
import ProfileLocal from '@/service/local/ProfileLocal';
import { async } from 'q';

const KEY_USER = "mr-user";
const KEY_LANGUAGE = "mr-language";

const state = {
    loading: 0,
    error: null,
    user: null,
    language: null
};
const getters = {
    IS_LOADING: state => state.loading != 0,
    ERROR: state => state.error,
    USER: state => state.user,
    USER_ROLES: state => state.user ? state.user.roles : [],
    USER_ROLE_ADMIN: state => state.user ? state.user.roles.indexOf('ADMINISTRATOR') != -1 : false,
    USER_ROLE_MANAGER: state => state.user ? state.user.roles.indexOf('MANAGER') != -1 : false,
    LANGUAGE: state => state.language,
};
const mutations = {
    START_LOADING: state => state.loading++,
    STOP_LOADING: state => state.loading--,
    SET_ERROR: (state, payload) => state.error = payload || null,
    SET_USER: (state, payload) => state.user = payload || null,
    SET_LANGUAGE: (state, payload) => state.language = payload || null
};
const actions = {
    INIT: (context, payload) => new Promise(async (resolve, reject) => {
        let storedUser = ProfileLocal.user;
        if(storedUser) {
            AccountApi
                .ping(_genConfig(storedUser))
                .then(response => {
                    context.commit('SET_USER', storedUser);
                    context.commit('SET_LANGUAGE', storedUser.language_code);
                    setAxiosDefaults(storedUser);
                })
                .catch(e => {
                    context.commit('SET_USER', null);
                    ProfileLocal.user = null;
                })
                .finally(() => resolve());
        }
    }),
    SIGN_IN: (context, payload) => new Promise((resolve, reject) => {
        if (!payload || context.getters.IS_LOADING) {
            reject();
            return;
        }

        context.commit('SET_ERROR');
        context.commit('START_LOADING');
        AccountApi
            .signIn(payload)
            .then(response => {
                if (!response.data) {
                    throw HttpError.defaultError();
                }

                let user = response.data;
                context.commit('SET_USER', user);
                ProfileLocal.user = user;
                context.commit('SET_LANGUAGE', ProfileLocal.language);
                setAxiosDefaults(user);
                resolve(user);
            })
            .catch(e => {
                const error = HttpError.catch(e);
                context.commit('SET_ERROR', error);
                reject(error);
            })
            .finally(() => {
                context.commit('STOP_LOADING');
            });
    }),
    SIGN_UP: (context, payload) => new Promise((resolve, reject) => {
        if (context.getters.IS_LOADING) {
            reject(HttpError.defaultError());
            return;
        }

        context.commit('SET_ERROR');
        context.commit('START_LOADING');
        AccountApi
            .signUp(payload)
            .then(response => {
                if (!response.data) {
                    throw HttpError.defaultError();
                }

                let user = response.data;
                context.commit('SET_USER', user);
                user.language_code ? context.commit('SET_LANGUAGE', user.language_code) : context.commit('SET_LANGUAGE', 'en');
                localStorage.setItem(KEY_USER, JSON.stringify(user));
                setAxiosDefaults(user);
                resolve(user);
            })
            .catch(e => {
                const error = HttpError.catch(e);
                context.commit('SET_ERROR', error);
                reject(error);
            })
            .finally(() => {
                context.commit('STOP_LOADING');
            })
    }),
    LOGOUT: (context, payload) => {
        context.commit('SET_USER', null);
        ProfileLocal.user = null;
        setAxiosDefaults();
    },
    SET_LANGUAGE: (context, payload) => {
        context.commit('SET_ERROR');
        if (context.getters.USER) {
            let user = context.getters.USER.language_code;
            AccountApi
                .setLanguage(payload)
                .then(response => {
                    context.commit('SET_LANGUAGE', payload);
                    user.language_code = payload;
                    context.commit('SET_USER', user);
                    localStorage.setItem(KEY_USER, user);
                    router.go();
                })
                .catch(e => {
                    context.commit('SET_ERROR', HttpError.catch(e));
                })
        } else {
            context.commit('SET_LANGUAGE', payload);
            localStorage.setItem(KEY_LANGUAGE, payload);
            router.go();
        }
    },
    SET_PROFILE_DATA: (context, payload) => {
        let user = context.getters.USER;
        user.first_name = payload.first_name;
        user.last_name = payload.last_name;
        user.sex = payload.sex;
        localStorage.setItem(KEY_USER, user);
        context.commit('SET_USER', user);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}

function setAxiosDefaults(user) {
    let headers = {
        "Content-Type": "application/json"
    };

    if (user && user.access_token) {
        headers["Authorization"] = "Bearer " + user.access_token;
    }

    axios.defaults.headers = headers;
    return headers;
}

function _genConfig(user) {
    return {
        headers: {
            "Authorization": "Bearer " + user.access_token
        }
    };
}