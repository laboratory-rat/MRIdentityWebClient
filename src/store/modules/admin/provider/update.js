import ProviderService from '@/service/api/provider';
import CategoryService from '@/service/api/category';
import LanguageService from '@/service/api/language';
import HttpError from '@/service/local/HttpErrorService';
import router from '@/router';
import { async } from 'q';

const state = {
    loading: 0,
    error: null,
    availableCategories: [],
    availableLanguages: [],
    nameLanguages: [],
    descriptionLanguages: [],
    selectedCategories: [],
    model: {},
    newRole: {},
};
const getters = {
    IS_LOADING: state => state.loading != 0,
    ERROR: state => state.error,
    MODEL: state => state.model,
    IS_NEW: state => state.model && !state.model.id,
    AVAILABLE_LANGUAGES: state => state.availableLanguages,
    AVAILABLE_CATEGORIES: state => state.availableCategories,
    NAME_LANGUAGES: state => state.nameLanguages,
    DESCRIPTION_LANGUAGES: state => state.descriptionLanguages,
    SELECTED_CATEGORIES: state => state.selectedCategories,
    NEW_ROLE: state => state.newRole,
    NEW_ROLE_READY: state => state.newRole 
        && state.newRole.name 
        && state.newRole.value
        && !state.model.options.roles.find(r => r.value.toUpperCase() == state.newRole.value.toUpperCase()),
};
const mutations = {
    START_LOADING: state => state.loading++,
    STOP_LOADING: state => state.loading--,
    SET_ERROR: (state, payload) => state.error = payload || null,
    SET_MODEL: (state, payload) => state.model = payload,
    SET_AVATAR: (state, payload) => state.model = { avatar: payload, ...state.model },
    SET_BACKGROUND: (state, payload) => state.model = { background: payload, ...state.model },
    SET_AVAILABLE_LANGUAGES: (state, payload) => state.availableLanguages = payload,
    SET_AVAILABLE_CATEGORIES: (state, payload) => state.availableCategories = payload,
    SET_NAME_LANGUAGES: (state, payload) => state.nameLanguages = payload,
    SET_DESCRIPTION_LANGUAGES: (state, payload) => state.descriptionLanguages = payload,
    SET_SELECTED_CATEGORIES: (state, payload) => state.selectedCategories = payload,
    SET_NEW_ROLE: (state, payload) => state.newRole = payload,
};
const actions = {
    INIT: async (context, payload) => {
        console.log(context);
        if (context.getters.IS_LOADING) {
            return;
        }

        payload = payload || {};
        payload.id = payload.id || null;
        payload.language = payload.language || context.rootGetters.USER_LANGUAGE;

        context.commit('SET_ERROR');
        context.commit('START_LOADING');

        try {
            let langResponse = await LanguageService
                .getAll();
            context.commit('SET_AVAILABLE_LANGUAGES', langResponse.data);

            var categoryResponse = await CategoryService
                .getList(0, 100, payload.language);
            context.commit('SET_AVAILABLE_CATEGORIES', categoryResponse.data.list);

            let model;
            if (payload.id) {
                var providerResponse = await ProviderService
                    .getUpdate(payload.id);
                model = providerResponse.data;
            } else {
                model = _getDefaultModel();
            }

            context.commit('SET_MODEL', model);

            if (model.name.length) {
                let selectedName = context.getters.AVAILABLE_LANGUAGES.filter(x => model.name.find(n => n.language_code == x.code));
                context.dispatch('UPDATE_NAME_LANGUAGES', selectedName);
            }

            if (model.description.length) {
                let selectedDesc = context.getters.AVAILABLE_LANGUAGES.filter(x => model.description.find(n => n.language_code == x.code));
                context.dispatch('UPDATE_DESCRIPTION_LANGUAGES', selectedDesc);
            }

            if (model.categories.length) {
                context.dispatch('UPDATE_SELECTED_CATEGORIES', model.categories.map(x => { return { id: x } }));
            }
        } catch (e) {
            const error = HttpError.catch(e);
            context.commit('SET_ERROR', error);
        }

        context.commit('STOP_LOADING');
    },

    SAVE: (context) => {
        if(context.getters.IS_LOADING){
            return;
        }

        context.commit('START_LOADING');
        context.commit('SET_ERROR');
        ProviderService
            .update(context.getters.MODEL)
            .then(response => {
                let redirectToAccess = !context.getters.MODEL.id;
                context.commit('SET_MODEL', response.data);
                redirectToAccess && router.push({path: `/admin/provider/access/${response.data.slug}`});
            })
            .catch(e => {
                const error = HttpError.catch(e);
                context.commit('SET_ERROR', error); 
            })
            .finally(() => {
                context.commit('STOP_LOADING');
            });
    },

    CREATE_ROLE: (context, payload) => {
        if(!context.getters.NEW_ROLE_READY){
            return;
        }

        let role = context.getters.NEW_ROLE;
        role.value = role.value.toUpperCase();
        let model = context.getters.MODEL;
        model.options.roles = model.options.roles || [];
        model.options.roles.push(role);
        context.commit('SET_MODEL', model);
        context.commit('SET_NEW_ROLE', {});
    },

    DELETE_ROLE: (context, payload) => {
        if(!payload){
            return;
        }

        let model = context.getters.MODEL;
        model.roles = model.roles.filter(mr => mr.value != payload.toUpperCase());
        model.default_roles = model.default_roles.filter(x => x != payload.toUpperCase());
        context.commit('SET_MODEL', model);
    },

    UPDATE_NAME_LANGUAGES: (context, payload) => {
        console.log(payload);
        let model = context.getters.MODEL;
        model.name = _updateLanguages(model.name, payload);
        context.commit('SET_MODEL', model);
        context.commit('SET_NAME_LANGUAGES', payload);
    },

    UPDATE_DESCRIPTION_LANGUAGES: (context, payload) => {
        let model = context.getters.MODEL;
        model.description = _updateLanguages(model.description, payload);
        context.commit('SET_MODEL', model);
        context.commit('SET_DESCRIPTION_LANGUAGES', payload);
    },
    
    UPDATE_SELECTED_CATEGORIES: (context, payload) => {
        let model = context.getters.MODEL;

        model.categories = model.categories.filter(mc => payload.find(p => p.id == mc.id));
        payload.filter(p => !model.categories.find(mc => mc.id == p.id)).forEach(category => {
            model.categories.push(category.id);
        });
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}

function _updateLanguages(dest, source) {
    dest = dest.filter(modelLang => source.find(sourceLang => sourceLang == modelLang.language_code));
    source.filter(sourceLang => !dest.find(destLang => destLang.language_code == sourceLang)).forEach((lang) => {
        dest.push({ language_code: lang, value: '' });
    });
    return dest;
}

function _getDefaultModel() {
    return {
        id: null,
        name: [],
        description: [],
        categories: [],
        avatar: null,
        background: null,
        options: {
            is_enabled: true,
            is_visible: false,
            is_registration_avaliable: false,
            roles: [
                {
                    name: "User",
                    value: "USER"
                }
            ],
            default_roles: ["USER"],
            callback_url: ""
        }
    }
}