<template>
  <div>
    <div class="backdrop"></div>
    <v-layout class="signup-card">
      <v-flex xs12 sm4 offset-sm4>
        <v-card>
          <v-card-title>
            <div>Sign Up</div>
          </v-card-title>
          <v-alert :value="error" type="error">{{error && error.message}}</v-alert>
          <div class="signup-body">
            <v-form ref="form" @submit.prevent="submit">
              <v-text-field
                @input="$v.model.email.$touch()"
                @blur="$v.model.email.$touch()"
                type="email"
                :error-messages="errorsEmail"
                v-model="model.email"
                label="Email"
                required
              ></v-text-field>
              <v-text-field
                type="password"
                label="Password"
                v-model="model.password"
                @input="$v.model.password.$touch()"
                @blur="$v.model.password.$touch()"
                :error-messages="errorsPassword"
                required
              ></v-text-field>
              <v-text-field
                type="password"
                v-model="model.password_confirm"
                @input="$v.model.password_confirm.$touch()"
                @blur="$v.model.password_confirm.$touch()"
                :error-messages="errorsPasswordConfirm"
                label="Confirm password"
                required
              ></v-text-field>
              <v-checkbox class="signup-checkbox" label="Remember me" v-model="model.remember_me"></v-checkbox>
              <v-checkbox
                class="signup-checkbox"
                label="Agree with rules"
                v-model="model.is_terms_confirmed"
                @input="$v.model.is_terms_confirmed.$touch()"
                @blur="$v.model.is_terms_confirmed.$touch()"
                :error-messages="errorsIsTermsConfirmed"
                required
              ></v-checkbox>
            </v-form>
          </div>
          <v-card-actions class="signup-actions">
            <router-link to="/login">
              <v-btn float>Go to login</v-btn>
            </router-link>
            <v-btn
              type="submit"
              float
              color="accent"
              @click="submit()"
              :loading="isLoading"
              :disabled="$v.$invalid || isLoading"
            >Sign Up</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";
import vuex from "vuex";
export default {
  data: () => ({
    model: {
      email: "",
      password: "",
      password_confirm: "",
      provider_token: "",
      redirect_url: "",
      is_terms_confirmed: true,
      remember_me: true
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
      },
      password_confirm: {
        sameAsPassword: sameAs("password")
      },
      is_terms_confirmed: {
        checked: val => val
      }
    }
  },
  computed: {
    ...vuex.mapGetters("common/user", {
      isLoading: "IS_LOADING",
      error: "ERROR",
      languageCode: "LANGUAGE"
    }),
    errorsEmail: function() {
      const errors = [];
      if (!this.$v.model.email.$dirty) return errors;
      !this.$v.model.email.required && errors.push("Email is required");
      !this.$v.model.email.email && errors.push("Bad email");
      return errors;
    },
    errorsPassword: function() {
      const errors = [];
      if (!this.$v.model.password.$dirty) return errors;
      !this.$v.model.password.required && errors.push("Password is required");
      !this.$v.model.password.minLength &&
        errors.push("Passoword must be > 7 chars");
      return errors;
    },
    errorsPasswordConfirm: function() {
      const e = [];
      if (!this.$v.model.password_confirm.$dirty) return e;
      !this.$v.model.password_confirm.sameAsPassword &&
        e.push("Passwords do not match");
      return e;
    },
    errorsIsTermsConfirmed: function() {
      const e = [];
      if (!this.$v.model.is_terms_confirmed.$dirty) return e;
      !this.$v.model.is_terms_confirmed.checked && e.push("Terms are required");
      return e;
    }
  },
  methods: {
    ...vuex.mapActions("common/user", {
      signUp: "SIGN_UP"
    }),
    submit: function() {
      if (this.isLoading || this.$v.invalid) {
        return;
      }

      this.signUp(this.model).then(() => {
        this.$router.push({ path: "/" });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.backdrop {
  height: 200px;
  @include colorize-bg("primary");
}
.signup-card {
  margin-top: -64px;
  .signup-body {
    padding: 16px 32px;
  }
  .signup-actions {
    display: flex;
    justify-content: space-between;
  }
}
</style>
