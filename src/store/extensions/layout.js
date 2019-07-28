const state = {
    loading: 0,
    error: null,
    asked: false,
};

const getters = {
    IS_LOADING: state => state.loading != 0,
    ERROR: state => state.error,
};

const mutations = {
    START_LOADING: state => state.loading++,
    STOP_LOADING: state => state.loading--,
    SET_ERROR: (state, payload) => state.error = payload || null,
    SET_ASKED: state => state.asked = true,
};

export default {
    state, 
    getters,
    mutations
};