import access from './access';
import update from './update';
import list from './list';

const state = {};
const getters = {};
const mutations = {};
const actions = {};
const modules = {
    access,
    update,
    list
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
    modules
}