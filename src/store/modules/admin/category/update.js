import CategoryApi from '@/service/api/category';
import HttpError from '@/service/local/HttpErrorService';
import LanguageApi from '@/service/api/language';

const state = {
    loading: 0,
    error: null,
    model: {},
    modelId: null,
    availableLanguages: [],
    modelLanguages: [],
};
const getters = {
    IS_LOADING: state => state.loading != 0,
    ERROR: state => state.error,
    MODEL: state => state.model,
    MODEL_ID: state => state.modelId,
    AVAILABLE_LANGUAGES: state => state.availableLanguages,
    MODEL_LANGUAGES: state => state.modelLanguages,
    IS_VALID: state => _checkModelValid(state.model)
};
const mutations = {
    START_LOADING: state => state.loading++,
    STOP_LOADING: state => state.loading--,
    SET_ERROR: (state, payload) => state.error = payload || null,
    SET_MODEL: (state, payload) => state.model = payload,
    SET_MODEL_ID: (state, payload) => state.modelId = payload,
    SET_AVAILABLE_LANGUAGES: (state, payload) => state.availableLanguages = payload || [],
    SET_MODEL_LANGUAGES: (state, payload) => state.modelLanguages = payload || [],
};
const actions = {
    LOAD: async (context, payload) => {
        context.commit('SET_ERROR');
        context.commit('SET_MODEL_ID', payload.id);
        context.commit('START_LOADING');
        try {
            let languages = context.rootGetters['common/language/GET'];
            if (!languages || !languages.length) {
                let langResponse = await LanguageApi.getAll();
                languages = langResponse.data;
            }

            context.commit('SET_AVAILABLE_LANGUAGES', languages);

            let model;
            if (payload.id) {
                let modelResponse = await CategoryApi.getUpdate(payload.id);
                model = modelResponse.data;
            } else {
                model = _getDefaultModel();
            }

            context.commit('SET_MODEL', model);
            if (model.name.length) {
                let modelLangs = model.name.map(x => x.language_code);
                context.dispatch('SET_MODEL_LANGUAGES', modelLangs);
                context.dispatch('UPDATE_MODEL_LANGUAGES', modelLangs);
            }
        }
        catch (e) {
            context.commit('SET_ERROR', HttpError.catch(e));
        } finally {
            context.commit('STOP_LOADING');
        }
    },
    UPDATE_MODEL_LANGUAGES: (context, payload) => {
        console.log(payload);
        let model = context.getters.MODEL;
        model.name = model.name.filter(x => payload.indexOf(x.language_code) !== -1);
        payload.filter(p => !model.name.find(x => x.language_code == p)).forEach(language_code => {
            model.name.push({
                language_code,
                value: ''
            });
        });
    },
    UPDATE: (context, payload) => new Promise((resolve, reject) => {
        if (!context.getters.IS_VALID || context.getters.IS_LOADING) {
            return;
        }

        context.commit('SET_ERROR');
        context.commit('START_LOADING');
        CategoryApi
            .update(context.getters.MODEL)
            .then(response => {
                resolve(response.data);
            })
            .catch((e) => {
                const error = HttpError.catch(e);
                context.commit('SET_ERROR', error);
                reject(error);
            })
            .finally(() => {
                context.commit('STOP_LOADING');
            });
    })
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}

function _getDefaultModel() {
    return {
        id: null,
        slug: '',
        name: []
    }
}

function _checkModelValid(model) {
    if (!model || !model.slug) {
        return false;
    }

    model.slug = model.slug.toLowerCase().replace(" ", "_");
    return model.name
        && model.name.length
        && model.name.find(x => x.language_code == 'en');
}