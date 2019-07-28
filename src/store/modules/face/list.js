import ProviderApi from '@/service/api/provider';
import HttpError from "@/service/local/HttpErrorService";

const state = {
    loading: 0,
    error: null,
    list: [],
    skip: 0,
    limit: 20,
    total: 0,
    search: '',

};
const getters = {
    IS_LOADING: state => state.loading != 0,
    ERROR: state => state.error,
    LIST: state => state.list,
    SKIP: state => state.skip,
    LIMIT: state => state.limit,
    TOTAL: state => state.total,
    PAGE_TOTAL: state => state.limit == 0 ? 0 : Math.ceil(state.total / state.limit),
    PAGE_CURRENT: state => state.limit == 0 ? 0 : Math.ceil(state.skip / state.limit) + 1,
    IS_LAST_PAGE: state => state.limit == 0 || state.loading != 0
        ? false
        : Math.ceil(state.total / state.limit) == Math.ceil(state.skip / state.limit) + 1,
};
const mutations = {
    START_LOADING: state => state.loading++,
    STOP_LOADING: state => state.loading--,
    SET_ERROR: (state, payload) => state.error = payload || null,
    SET_LIST: (state, payload) => state.list = payload,
    SET_LIST_ADD: (state, payload) => state.list = state.list.concat(payload || []),
    SET_SKIP: (state, payload) => state.skip = payload,
    SET_SKIP_STEP: state => state.skip += state.limit,
    SET_LIMIT: (state, payload) => state.limit = payload,
    SET_TOTAL: (state, payload) => state.total = payload,
};
const actions = {
    SET_PAGING: (context, payload) => {
        payload = payload || {};
        context.commit('SET_SKIP', payload.skip || 0);
        context.commit('SET_LIMIT', payload.limit || 20);
    },
    LOAD: (context, payload) => {
        if (context.getters.IS_LOADING) {
            return;
        }

        payload = payload || {};
        payload.clear = payload.clear || true;

        context.commit('SET_ERROR');
        context.commit('START_LOADING');

        if (payload.clear) {
            context.dispatch('SET_PAGING', {
                skip: payload.skip,
                limit: payload.limit
            });
        } else {
            context.commit('SET_SKIP_STEP');
        }

        ProviderApi
            .getAvailable(context.getters.SKIP, context.getters.LIMIT)
            .then(response => {
                let data = response.data;
                if (!data) {
                    throw HttpError.defaultError();
                }

                context.commit('SET_TOTAL', data.total);
                context.commit(payload.clear ? 'SET_LIST' : 'SET_LIST_ADD', data.list);
            })
            .catch(e => {
                context.commit('SET_ERROR', HttpError.catch(e));
            })
            .finally(() => {
                context.commit('STOP_LOADING');
            });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
