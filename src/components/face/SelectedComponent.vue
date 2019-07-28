<template>
  <div class="provider__container" v-if="provider">
    <div class="provider__container-backdrop">
      <v-img
        max-height="320"
        aspect-ratio="1"
        :src="provider.background_url"
        :alt="provider.name + ' background'"
      ></v-img>
    </div>
    <div class="provider__container-card">
      <v-container>
        <v-layout justify-center>
          <v-flex sm12 md4>
            <v-card>
              <v-toolbar card prominent>
                <v-avatar color="primary">
                  <v-img :src="provider.avatar_url" :alt="provider.name + ' avatar'"></v-img>
                </v-avatar>
                <v-toolbar-title>{{provider.name}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                  <v-btn icon>
                    <v-icon dark color="primary">info</v-icon>
                  </v-btn>
                  <v-btn v-if="!isLogged" flat color="primary">Registration</v-btn>
                </v-toolbar-items>
              </v-toolbar>
              <v-card-text v-if="!isLogged">
                <v-form>
                  <v-text-field
                    :error-messages="emailErrors"
                    @input="$v.loginModel.email.$touch()"
                    @blur="$v.loginModel.email.$touch()"
                    v-model="loginModel.email"
                    label="Email"
                    type="email"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="loginModel.password"
                    label="Password"
                    type="password"
                    :error-messages="passwordErrors"
                    required
                    @input="$v.loginModel.password.$touch()"
                    @blur="$v.loginModel.password.$touch()"
                  ></v-text-field>
                  <v-checkbox v-model="loginModel.remember_me" label="Remember me"></v-checkbox>
                </v-form>
              </v-card-text>
              <v-card-actions v-if="!isLogged">
                <v-layout justify-end>
                  <v-btn
                    color="primary"
                    :loading="isLoading"
                    :disabled="$v.loginModel.$invalid"
                  >Login</v-btn>
                </v-layout>
              </v-card-actions>
              <v-card-actions v-if="isLogged">
                <v-layout justify-center="" py-2> 
                  <v-btn color="primary" @click="autologin()">
                    Login now
                  </v-btn>
                </v-layout>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>

<script>
import vuex, { mapGetters } from "vuex";
import {
  required,
  maxLength,
  minLength,
  email
} from "vuelidate/lib/validators";

export default {
  data: function() {
    return {};
  },
  validations: {
    loginModel: {
      email: { required, email, maxLength: maxLength(256) },
      password: { required }
    }
  },
  computed: {
    ...vuex.mapGetters("face/selected", {
      isLoading: "IS_LOADING",
      error: "ERROR",
      isRegMode: "IS_REG_MODE",
      provider: "PROVIDER",
      options: "OPTIONS",
      loginModel: "LOGIN_MODEL",
      regModel: "REG_MODEL",
      isLogged: "IS_LOGGED"
    }),
    emailErrors() {
      const e = [];
      if (!this.$v.loginModel.email.$dirty) return e;
      !this.$v.loginModel.email.required && e.push("email is required");
      !this.$v.loginModel.email.maxLength &&
        e.push("Email must be less then 256 chars");
      !this.$v.loginModel.email.email && e.push("Email must be valid");
      return e;
    },
    passwordErrors() {
      const e = [];
      if (!this.$v.loginModel.password.$dirty) return e;
      !this.$v.loginModel.password.required && e.push("Password is required");
      return e;
    }
  },
  methods: {
    ...vuex.mapActions("face/selected", {
      init: "INIT",
      autologin: 'AUTO_LOGIN',
      signIn: 'SIGN_IN',
      signUp: 'SIGN_UP'
    }),
  },
  mounted: function() {
    let route = this.$route;
    let options = {
      provider_slug: route.params.slug,
      redirect_url: route.query.redirect_url || '',
      token: route.query.token || null
    };

    this.init(options);

    // this.load({ slug: this.$route.params.slug });
  }
};
</script>

<style lang="scss" scoped>
.provider__container {
  width: 100%;
  .provider__container-backdrop {
    height: 320px;
  }
  .provider__container-card {
    margin-top: -200px;
  }
}
</style>
