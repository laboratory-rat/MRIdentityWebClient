import category from './category';
import provider from './provider';
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
        category,
        provider,
        user
    }
};