import language from '@/service/api/language';

const state = {
    list: []
};
const getters = {
    GET: state => state.list
};
const mutations = {
    SET: (state, payload) => state.list = payload || []
};
const actions = {
    SET: (context, payload) => {
        if (payload) {
            localStorage.setItem('languages', JSON.stringify(payload));
        } else {
            localStorage.removeItem('languages');
        }

        context.commit('SET', payload);
    },
    GET: (context, payload) => {
        return new Promise((resolve, reject) => {
            let stored = localStorage['languages'];
            if (stored) {
                context.commit('SET', JSON.parse(stored));
                resolve(JSON.parse(stored));
                return;
            } else {
                language
                    .getAll()
                    .then(response => {
                        context.dispatch('SET', response.data);
                        return resolve(response.data);
                    })
                    .catch(error => {
                        console.error(error.response.data);
                        return reject(error.response.data)
                    });
            }

        })

    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}