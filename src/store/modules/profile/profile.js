import lExtensions from '@/store/extensions/layout';
import AccountApi from '@/service/api/account';
import HttpError from '@/service/local/HttpErrorService';

const state = {
    ...lExtensions.state,
    profile: null,
    availableSex: ["UNDEFINED", "MALE", "FEMALE"],
};
const getters = {
    ...lExtensions.getters,
    PROFILE: state => state.profile,
    SELECTED_SEX: state => state.profile ? state.profile.sex : '',
    AVAILABLE_SEX: state => state.availableSex,
};
const mutations = {
    ...lExtensions.mutations,
    SET_PROFILE: (state, payload) => state.profile = payload
};
const actions = {
    LOAD: (context, payload) => new Promise((resolve, reject) => {
        context.commit('START_LOADING');
        context.commit('SET_ERROR');
        AccountApi
            .profile()
            .then(response => {
                context.commit('SET_PROFILE', response.data);
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
    }),
    UPDATE: (context, payload) => new Promise((resolve, reject) => {
        context.commit('START_LOADING');
        context.commit('SET_ERROR');
        AccountApi
            .update
            .profile(context.getters.PROFILE)
            .then(response => {
                context.commit('SET_PROFILE', response.data);
                context.dispatch('common/user/SET_PROFILE_DATA', response.data, { root: true });
                resolve(response.data);
            })
            .catch(e => {
                const error = HttpError.catch(e);
                context.commit('SET_ERROR', error);
                reject(error)
            })
            .finally(() => {
                context.commit('STOP_LOADING')
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
