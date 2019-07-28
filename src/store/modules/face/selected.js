import ProviderApi from '@/service/api/provider';
import AccountApi from '@/service/api/account';
import HttpError from '@/service/local/HttpErrorService';
import router from '@/router';
import lExtensions from '@/store/extensions/layout';

const defaultLoginModel = () => ({
    email: '',
    password: '',
    remember_me: true
});

const defaultRegModel = () => ({
    email: '',
    password: '',
    confirm: '',
    remember_me: true
});

const state = {
    ...lExtensions.state,
    isRegMode: false,
    isLogged: false,
    provider: null,
    options: {},
    loginModel: defaultLoginModel(),
    regModel: defaultRegModel(),
};
const getters = {
    ...lExtensions.getters,
    IS_REG_MODE: state => state.isRegMode,
    PROVIDER: state => state.provider,
    OPTIONS: state => state.options,
    LOGIN_MODEL: state => state.loginModel,
    REG_MODEL: state => state.regModel,
    IS_LOGGED: state => state.isLogged,
};
const mutations = {
    ...lExtensions.mutations,
    SET_PROVIDER: (state, payload) => state.provider = payload,
    SET_OPTIONS: (state, payload) => state.options = payload,
    SET_LOGIN_MODEL: (state, payload) => state.loginModel = payload,
    SET_REG_MODEL: (state, payload) => state.regModel = payload,
    SET_IS_REG_MODE: (state, payload) => state.isRegMode = payload,
    SET_IS_LOGGED: (state, payload) => state.isLogged = payload
};

const actions = {
    INIT: (context, payload) => new Promise((resolve, reject) => {
        context.commit('START_LOADING');
        context.commit('SET_ERROR');
        context.commit('SET_IS_LOGGED', context.rootGetters['common/user/USER'] != null);
        context.commit('SET_OPTIONS', payload);
        ProviderApi
            .get(payload.provider_slug)
            .then((response) => {
                context.commit('SET_PROVIDER', response.data);
            })
            .catch(e => {
                context.commit('SET_ERROR', HttpError.catch(e));
            })
            .finally(() => {
                context.commit('STOP_LOADING');
            });
    }),
    AUTO_LOGIN: (context, payload) => new Promise((resolve, reject) => {
        context.commit('START_LOADING');
        context.commit('SET_ERROR');
        AccountApi
            .autoSignIn(context.getters.OPTIONS)
            .then(response => {
                context.dispatch('PROCESS_TOKEN', response.data);
                resolve(data);
            })
            .catch(e => {
                const error = HttpError.catch(e);
                context.commit('SET_ERROR', error);
                reject(error);
            })
            .finally(() => context.commit('STOP_LOADING'));
    }),

    SIGN_IN: (context, payload) => new Promise((resolve, reject) => {
        context.commit('START_LOADING');
        context.commit('SET_ERROR');

        context.dispatch('common/user/SIGN_IN', payload, { root: true })
            .then(response => {
                context.commit('PROCESS_TOKEN', response);
                resolve(response);
            })
            .catch(e => {
                context.commit('SET_ERROR', e);
                reject(e);
            })
            .finally(() => context.commit('STOP_LOADING'));
    }),

    SIGN_UP: (context, payload) => new Promise((resolve, reject) => {
        context.commit('START_LOADING');
        context.commit('SET_ERROR');

        context.dispatch('common/user/SIGN_UP', payload, { root: true })
            .then(response => {
                context.commit('PROCESS_TOKEN', response);
                resolve(response);
            })
            .catch(e => {
                context.commit('SET_ERROR');
                reject(e);
            })
            .finally(() => {
                context.commit('STOP_LOADING');
            })
    }),

    PROCESS_TOKEN: (context, payload) => {
        if (typeof window.serviceCallback !== typeof undefined) {
            window.serviceCallback(payload.callback_token);
            window.close();
        } else {
            let url = payload.callback_url + '?token=' + payload.callback_token;
            location.replace(url);
        }
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
}