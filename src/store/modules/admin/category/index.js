import list from './list';
import update from './update';

const state = {};
const getters = {};
const mutations = {};
const actions = {};
const modules = {
    list,
    update
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
    modules
}