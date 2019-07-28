import lExtensions from '@/store/extensions/layout';
import HttpError from '@/service/local/HttpErrorService';
import AccountApi from '@/service/api/account';

const state = {
    ...lExtensions.state,
    avatar: null,
}

const getters = {
    ...lExtensions.getters,
    AVATAR: state => state.avatar
}

const mutations = {
    ...lExtensions.mutations,
    SET_AVATAR: (state, payload) => state.avatar = payload || null
}

const actions = {
    UPDATE: (context, payload) => new Promise((resolve, reject) => {
        context.commit('START_LOADING');
        context.commit('SET_ERROR');
        AccountApi
            .update
            .avatar(context.getters.AVATAR)
            .then(response => {
                resolve(response.data);
            })
            .catch(e => {
                const error = HttpError.catch(e);
                context.commit('SET_ERROR', error);
                reject(error);
            })
            .finally(() => {
                context.commit('STOP_LOADING');
            });
    })
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}