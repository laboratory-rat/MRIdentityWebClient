import Vuex from 'vuex';
import Vue from 'vue';
import admin from './modules/admin';
import common from './modules/common';
import face from './modules/face';
import profile from './modules/profile';

Vue.use(Vuex);
const state = {};
const getters = {};
const mutations = {};
const actions = {};

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules: {
        admin,
        common,
        face,
        profile
    }
});