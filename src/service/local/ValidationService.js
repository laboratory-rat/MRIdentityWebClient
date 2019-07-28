export default {
    rules: {
        name: [
            v => !!v || 'Name is required',
            v => v.length <= 255 || 'Name must be less than 255 characters'
        ],
        email: [
            v => !!v || 'E-mail is required',
            v => /.+@.+/.test(v) || 'E-mail must be valid'
        ],
        password: [
            v => !!v || 'Password is required',
            v => v.length < 7 || 'Password must be longer then 6 chars'
        ],
        password_confirm: [
            v => !!v || 'Password is required',
            (v, p) => v != p || 'Passwords do not match'
        ]
    }
}