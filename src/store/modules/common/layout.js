const state = {
    loading: 0,
    error: null,
    toasts: []
};
const getters = {
    IS_LOADING: state => state.loading != 0,
    ERROR: state => state.error,
    TOASTS: state => state.toasts
};
const mutations = {
    START_LOADING: state => state.loading++,
    STOP_LOADING: state => state.loading--,
    RESET_LOADING: state => state.loading = 0,
    SET_ERROR: (state, payload) => state.error = payload || null,
    TOAST_PUSH: (state, payload) => state.toasts.push(payload),
    TOAST_SHIFT: state => state.toasts.shift()
};
const actions = {
    START_LOADING: (context) => {
        context.commit('START_LOADING');
    },
    STOP_LOADING: (context) => {
        context.commit('STOP_LOADING');
    },
    RESET_LOADING: context => {
        context.commit('RESET_LOADING')
    },
    EMIT_TOAST: (context, payload) => {
        let snack = {
            ..._defaultSnack(),
            ...payload
        };
        context.commit('TOAST_PUSH', snack);
    },
    SHIFT_TOAST: (context) => {
        context.commit('TOAST_SHIFT');
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}

function _defaultSnack(){
    return {
        y: "bottom",
        x: "right",
        color: "teal",
        multiLine: false,
        timeout: 6000,
        text: '',
        enabled: true
    };
}