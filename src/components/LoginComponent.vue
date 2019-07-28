<template>
  <div>
    <v-img src="https://www.fillmurray.com/640/360" class="backdrop"></v-img>
    <v-container>
      <v-layout class="login-card">
        <v-flex xs12 md4 offset-md4>
          <v-card>
            <v-card-title>
              <h5 class="headline">Login</h5>
            </v-card-title>
            <v-alert :value="error" type="warning">{{error && error.message}}</v-alert>
            <div class="login-body">
              <v-form ref="form" @submit.prevent="login()">
                <v-text-field
                  @input="$v.model.email.$touch()"
                  @bind="$v.model.email.$touch()"
                  :error-messages="errorsEmail"
                  v-model="model.email"
                  type="email"
                  label="Email"
                  required
                ></v-text-field>
                <v-text-field
                  @input="$v.model.password.$touch()"
                  @bind="$v.model.password.$touch()"
                  :error-messages="errorsPassword"
                  v-model="model.password"
                  type="password"
                  label="Password"
                  required
                ></v-text-field>
                <v-checkbox v-model="model.remember_me" label="Remember me"></v-checkbox>
              </v-form>
            </div>
            <v-card-actions class="login-actions">
              <router-link to="/signup">
                <v-btn float>Registration</v-btn>
              </router-link>
              <v-btn
                float
                color="accent"
                :loading="isLoading"
                :disabled="$v.$invalid || isLoading"
                @click="login()"
              >Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";
import vuex from "vuex";

export default {
  computed: {
    ...vuex.mapGetters("common/user", {
      isLoading: "IS_LOADING",
      error: "ERROR"
    }),
    errorsEmail: function() {
      const e = [];
      if (!this.$v.model.email.$dirty) return e;
      !this.$v.model.email.required && e.push("Email is required");
      !this.$v.model.email.email && e.push("Incorrect email");
      return e;
    },
    errorsPassword: function() {
      const e = [];
      if (!this.$v.model.password.$dirty) return e;
      !this.$v.model.password.required && e.push("Password is requred");
      !this.$v.model.password.minLength && e.push("Incorrect password");
      return e;
    }
  },
  data: () => ({
    model: {
      email: "",
      password: "",
      remember_me: true,
      redirect_url: null,
      provider_id: null
    }
  }),
  validations: {
    model: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(8)
      }
    }
  },
  methods: {
    ...vuex.mapActions("common/user", {
      loginAction: "SIGN_IN"
    }),

    login: function() {
      if (!this.$refs.form.validate() || this.isLoading) {
        return;
      }

      this.loginAction(this.model).then(response => {
        this.$router.push({ path: "/" });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.backdrop {
  height: 360px;
}
.login-card {
  margin-top: -200px;
  .login-body {
    padding: 16px 64px;
  }
  .login-actions {
    display: flex;
    justify-content: space-between;
  }
}
</style>
