import UserProfileComponent from '@/components/user/ProfileComponent';

export default {
    routes: [
        {
            path: '/profile',
            name: 'user.profile',
            component: UserProfileComponent,
            meta: {
                title: 'My profile',
                requiresLogin: true,
            }
        }
    ]
}