export default {
    data: () => ({
        avatarSrc: require('@/assets/img/defaults/user-avatar.png')
    }),
    methods: {
        AvatarUrl: function(url){
            return url || this.avatarSrc;
        }
    }
}