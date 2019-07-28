import lExtensions from '@/store/extensions/layout';
import AccountApi from '@/service/api/account';
import HttpError from '@/service/local/HttpErrorService';

const state = {
    ...lExtensions.state,
    model: {
        password: '',
        newPassword: '',
        confirm: ''
    }
};

const getters = {
    ...lExtensions.getters,
    MODEL: state => state.model
};

const mutations = {
    ...lExtensions.mutations,
    SET_MODEL: (state, payload) => state.model = payload,
};

const actions = {
    UPDATE: (context, payload) => new Promise((resolve, reject) => {
        context.commit('SET_ERROR');
        context.commit('START_LOADING');
        AccountApi
            .update
            .password(context.getters.MODEL)
            .then(response => {
                if (!response.data) {
                    throw HttpError.default();
                }

                resolve(true);
                console.log(context);
                context.dispatch('common/layout/EMIT_TOAST', {
                    text: 'Password updated'
                }, { root: true });
            })
            .catch(e => {
                const error = HttpError.catch(e);
                context.commit('SET_ERROR', error);
                reject(false);
            })
            .finally(() => {
                context.commit('STOP_LOADING');
                context.dispatch('CLEAR_MODEL');
            });
    }),
    CLEAR_MODEL: (context, payload) => {
        context.commit('SET_MODEL', {
            password: '',
            new_password: '',
            confirm: ''
        });
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}