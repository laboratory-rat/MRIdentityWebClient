import UserApi from '@/service/api/user';
import lExtensions from '@/store/extensions/layout';

const state = {
    ...lExtensions.state,
    available: [],
    selected: [],
    user: null,
};

const getters = {
    ...lExtensions.getters,
    AVAILABLE: state => state.available,
    USER: state => state.user
};

const mutations = {
    ...lExtensions.mutations,
    SET_AVAILABLE: (state, payload) => state.available = payload,
    SET_USER: (state, payload) => state.user = payload || null,
};

const actions = {
    INIT: async (context, payload) => {
        context.commit('SET_USER', payload);
        context.commit('SET_ERROR');
        context.commit('START_LOADING');

        try {
            if (!context.getters.available || !context.getters.available.length) {
                var availableResponse = await UserApi.roles();
                context.commit('SET_AVAILABLE', availableResponse.data);
            }
        } catch (e) {
            const error = HttpError.catch(e);
            context.commit('SET_ERROR', error);
        } finally {
            context.commit('STOP_LOADING');
        }
    },

    UPDATE: (context, payload) => new Promise((resolve, reject) => {
        if(!payload){
            context.commit('SET_USER', null);
            resolve(false);
        } else {
            context.commit('START_LOADING');
            UserApi
                .update.roles(context.getters.USER.id, {roles: context.getters.USER.roles})
                .then(response => {
                    resolve(true);
                    context.commit('SET_USER', null);
                })
                .catch((e) => {
                    const error = HttpError.catch(e);
                    context.commit('SET_ERROR', error);
                    reject(error);
                })
                .finally(() => {
                    context.commit('STOP_LOADING');
                });
        }


    })
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}