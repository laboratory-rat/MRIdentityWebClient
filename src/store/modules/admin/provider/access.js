import HttpError from '@/service/local/HttpErrorService';
import ProviderService from "@/service/api/provider";
import { async } from 'q';

const state = {
    loading: 0,
    error: null,
    provider: {},
    model: {
        tokens: [],
        rules: []
    },
    tokenModel: {
        name: ''
    },
    tokenModelError: null,
    newRule: {}
}
const getters = {
    IS_LOADING: state => state.loading != 0,
    ERROR: state => state.error,
    PROVIDER: state => state.provider,
    MODEL: state => state.model,
    TOKEN_MODEL: state => state.tokenModel,
    TOKEN_MODEL_ERROR: state => state.tokenModelError,
    TOKEN_MODEL_READY: state => state.tokenModel
        && state.tokenModel.name
        && state.tokenModel.name.length
}
const mutations = {
    START_LOADING: (state, payload) => state.loading++,
    STOP_LOADING: (state, payload) => state.loading--,
    SET_ERROR: (state, payload) => state.error = payload,
    SET_MODEL: (state, payload) => state.model = payload,
    SET_PROVIDER: (state, payload) => state.provider = payload,
    SET_TOKEN_MODEL: (state, payload) => state.tokenModel = payload,
    SET_TOKEN_MODEL_ERROR: (state, payload) => state.tokenModelError = payload,
    SET_MODEL_TOKENS: (state, payload) => state.model.tokens= payload,
}
const actions = {
    INIT: async (context, payload) => {
        context.commit('SET_ERROR', null);
        context.commit('START_LOADING');
        context.commit('SET_TOKEN_MODEL', { name: '' });

        try {
            let providerResponse = await ProviderService.get(payload.slug);
            context.commit('SET_PROVIDER', providerResponse.data);
            payload.id = providerResponse.data.id;
        } catch (e) {
            let error = HttpError.catch(e);
            context.commit('SET_ERROR', error);
            context.commit('STOP_LOADING');
            return;
        }

        try {
            let accessResponse = await ProviderService.access.get(payload.id);
            context.commit('SET_MODEL', accessResponse.data);
        } catch (e) {
            let error = HttpError.catch(e);
            context.commit('SET_ERROR', error);
            context.commit('STOP_LOADING');
            return;
        }

        context.commit('STOP_LOADING');
    },

    CREATE_TOKEN: (context, payload) => {
        return new Promise((resolve, reject) => {
            context.commit('SET_TOKEN_MODEL_ERROR', null);

            if (!context.getters.TOKEN_MODEL_READY || context.getters.IS_LOADING) {
                return;
            }

            context.commit('START_LOADING');

            ProviderService
                .access
                .token
                .create(context.getters.PROVIDER.id, context.getters.TOKEN_MODEL)
                .then(response => {
                    context.commit('SET_TOKEN_MODEL', { name: '' });
                    let tokens = context.getters.MODEL.tokens || [];
                    tokens.push(response.data);
                    context.commit('SET_MODEL_TOKENS', tokens);
                    resolve(response.data);
                })
                .catch(e => {
                    let error = HttpError.catch(e);
                    context.commit('SET_TOKEN_MODEL_ERROR', error);
                    reject(error);
                })
                .finally(() => {
                    context.commit('STOP_LOADING');
                });
        });
    },

    DELETE_TOKEN: (context, payload) => {
        return new Promise((resolve, reject) => {
            context.commit('SET_ERROR', null);
            context.commit('START_LOADING');
            ProviderService
                .access
                .token
                .delete(context.getters.PROVIDER.id, payload)
                .then(response => {
                    let tokens = context.getters.MODEL.tokens.filter(x => x.value != payload);
                    context.commit('SET_MODEL_TOKENS', tokens);
                    resolve(tokens);
                })
                .catch(e => {
                    let error = HttpError.catch(e);
                    context.commit('SET_ERROR', error);
                    reject(error);
                })
                .finally(() => {
                    context.commit('STOP_LOADING');
                })
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}