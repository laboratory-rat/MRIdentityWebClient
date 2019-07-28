import UserApi from '@/service/api/user';
import HttpError from '@/service/local/HttpErrorService';

import lExtension from '@/store/extensions/layout';
import pExtension from '@/store/extensions/paging';

const namespaced = true;

const state = {
    ...lExtension.state,
    ...pExtension.state
};

const getters = {
    ...lExtension.getters,
    ...pExtension.getters
};

const mutations = {
    ...lExtension.mutations,
    ...pExtension.mutations
}

const actions = {
    LOAD: (context, payload) => new Promise((resolve, reject) => {
        if(!payload || context.getters.IS_LOADING){
            return;
        }

        if(payload.clear){
            context.commit('SET_SKIP', payload.skip || 0);
            context.commit('SET_LIMIT', payload.limit || 20);
        } else if(context.getters.IS_END){
            return;
        } else {
            context.commit('SET_SKIP_STEP');
        }

        context.commit('SET_ERROR');
        context.commit('START_LOADING');
        UserApi
            .list(context.getters.SKIP, context.getters.LIMIT)
            .then(response => {
                let data = response.data;
                if(!data) throw HttpError.defaultError();

                context.commit('SET_TOTAL', data.total);
                context.commit(payload.clear ? 'SET_LIST' : 'SET_LIST_ADD', data.list);
            })
            .catch(e => {
                const error = HttpError.catch(e);
                context.commit('SET_ERROR', error);
                reject(error);
            })
            .finally(() => {
                context.commit('STOP_LOADING');
            })
    })
}


export default {
    namespaced,
    state,
    getters,
    mutations,
    actions
}