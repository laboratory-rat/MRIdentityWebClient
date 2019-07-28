import CategoryApi from '@/service/api/category';
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
    START_LOADING: state => state.loading++,
    STOP_LOADING: state => state.loading--,
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

        if (payload.clear) {
            context.commit('SET_SKIP', payload.skip || 0);
            context.commit('SET_LIMIT', payload.limit || 0);
        } else if (context.getters.IS_END) {
            return;
        } else {
            context.commit('SET_SKIP_STEP');
        }

        context.commit('SET_ERROR');
        context.commit('START_LOADING');
        CategoryApi
            .getList(context.getters.SKIP, context.getters.LIMIT, context.rootGetters['common/user/LANGUAGE'], null)
            .then(response => {
                let data = response.data;
                context.commit(payload.clear ? 'SET_LIST' : 'SET_LIST_ADD', data.list);
                context.commit('SET_TOTAL', data.total);
            })
            .catch(e => {
                context.commit('SET_ERROR', HttpError.catch(e));
            })
            .finally(() => {
                context.commit('STOP_LOADING')
            });
    },
    DELETE: (context, payload) => {
        context.commit('SET_ERROR');
        context.commit('START_LOADING');
        CategoryApi
            .delete(payload.id)
            .then(response => {
                let list = context.getters.LIST;
                list = list.filter(x => x.id != payload.id);
                context.commit('SET_LIST', list);
            })
            .catch(error => {
                context.commit('SET_ERROR', HttpError.catch(error));
            })
            .finally(() => context.commit('STOP_LOADING'));
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}