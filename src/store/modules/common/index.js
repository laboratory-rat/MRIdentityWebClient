import language from './language';
import layout from './layout';
import user from './user';

const state = {};
const getters = {};
const mutations = {};
const actions = {};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
    modules: {
        language,
        user,
        layout
    }
}