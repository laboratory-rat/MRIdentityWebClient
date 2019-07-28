import ProviderApi from '@/service/api/provider';
import HttpError from '@/service/local/HttpErrorService';

const state = {
    error: null,
    loading: 0,
    list: [],
    skip: 0,
    limit: 20,
    total: 0,
    asked: false
}
const getters = {
    IS_LOADING: state => state.loading != 0,
    ERROR: state => state.error,
    LIST: state => state.list,
    SKIP: state => state.skip,
    LIMIT: state => state.limit,
    TOTAL: state => state.total,
    PAGE_TOTAL: state => state.limit == 0 ? 0 : Math.ceil(state.total / state.limit),
    PAGE_CURRENT: state => state.limit == 0 ? 0 : Math.ceil(state.skip / state.limit) + 1,
    IS_END: state => state.asked && (state.skip + state.limit >= state.total) && state.loading == 0,

}
const mutations = {
    START_LOADING: (state, payload) => state.loading++,
    STOP_LOADING: (state, payload) => state.loading--,
    SET_ERROR: (state, payload) => state.error = payload || null,
    SET_ASKED: (state, payload) => state.asked = true,
    SET_SKIP: (state, payload) => state.skip = payload,
    SET_SKIP_STEP: (state, payload) => state.skip = state.skip + state.limit,
    SET_LIMIT: (state, payload) => state.limit = payload,
    SET_TOTAL: (state, payload) => state.total = payload,
    SET_LIST: (state, payload) => state.list = payload,
    SET_LIST_ADD: (state, payload) => state.list = state.list.concat(payload)
}
const actions = {
    LOAD: (context, payload) => {
        if (context.getters.IS_LOADING) {
            return;
        }

        payload = payload || {};
        context.commit('SET_ASKED');

        if (payload.clear || payload.total == 0) {
            context.commit('SET_SKIP', payload.skip || 0);
            context.commit('SET_LIMIT', payload.limit || 20);
        } else if (context.getters.IS_END) {
            return;
        } else {
            context.commit('SET_SKIP_STEP');
        }

        context.commit('SET_ERROR', null);
        context.commit('START_LOADING');
        ProviderApi
            .getList(context.getters.SKIP, context.getters.LIMIT)
            .then(response => {
                let data = response.data;
                if (!data) {
                    throw null;
                }

                context.commit('SET_TOTAL', data.total);
                context.commit(payload.clear ? 'SET_LIST' : 'SET_LIST_ADD', data.list);
            })
            .catch(e => {
                const error = HttpError.catch(e);
                context.commit('SET_ERROR', error);
            })
            .finally(() => context.commit('STOP_LOADING'));
    },
    DELETE: (context, payload) => new Promise((resolve, reject) => {
        context.commit('START_LOADING');
        context.commit('SET_ERROR');
        ProviderApi
            .delete(payload)
            .then(response => {
                let list = context.getters.LIST;
                list = list.filter(x => x.id != payload);
                context.commit('SET_LIST', list);
                context.commit('SET_TOTAL', context.getters.TOTAL - 1);
                resolve(true);
            })
            .catch(e => {
                const error = HttpError.catch(e);
                context.commit('SET_ERROR', error);
                reject(error);
            })
            .finally(() => context.commit('STOP_LOADING'));
    })
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}