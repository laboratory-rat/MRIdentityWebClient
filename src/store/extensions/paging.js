const state = {
    skip: 0,
    limit: 20,
    total: 0,
    list: [],
}
const getters = {
    SKIP: state => state.skip,
    LIMIT: state => state.limit,
    TOTAL: state => state.total,
    LIST: state => state.list,
    PAGE_TOTAL: state => state.limit == 0 ? 0 : Math.ceil(state.total / state.limit),
    PAGE_CURRENT: state => state.limit == 0 ? 0 : Math.ceil(state.skip / state.limit) + 1,
    IS_END: state => state.asked && (state.skip + state.limit >= state.total) && state.loading == 0,
}
const mutations = {
    SET_SKIP: (state, payload) => state.skip = payload,
    SET_SKIP_STEP: state => state.skip = state.skip + state.limit,
    SET_LIMIT: (state, payload) => state.limit = payload,
    SET_TOTAL: (state, payload) => state.total = payload,
    SET_LIST: (state, payload) => state.list = payload,
    SET_LIST_ADD: (state, payload) => state.list = state.list.concat(payload)
}

export default {
    state,
    getters,
    mutations
}