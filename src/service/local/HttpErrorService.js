import router from '@/router';
import store from '@/store/store';

export default {
    catch: function (error) {
        let response = error.response;
        if (!response) {
            console.error('UNDEFINED ERROR');
            console.error(error);
            return {
                code: -1,
                message: 'Undefined error'
            };
        }

        if (response.status == 401) {
            store.dispatch('LOGOUT');
            router.push({ path: '/' });
            return {
                code: 401,
                message: 'Unauthorized'
            };
        } else if (response.data) {
            return response.data;
        }

        return {
            code: -1,
            message: 'Undefined error'
        };
    },
    defautlError: function(){
        return {
            code: -1,
            message: 'Undefined error'
        };
    }
}