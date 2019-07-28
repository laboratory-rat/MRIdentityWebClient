<template>
  <v-dialog max-width="400" :fullscreen="$vuetify.breakpoint.smAndDown" v-model="enabled">
    <v-card>
      <v-toolbar card prominent>
        <v-toolbar-title class="headline">Update password</v-toolbar-title>
      </v-toolbar>
      <v-progress-linear class="ma-0" height="2" v-if="isLoading" :indeterminate="true"></v-progress-linear>
      <v-alert v-if="error" type="warning" :value="error">{{error.message}}</v-alert>
      <v-card-text>
        <form @click.prevent="$event.preventDefault()">
          <div class="form-group">
            <v-text-field type="password" :error-messages="errorsPassword" @input="$v.model.password.$touch()" @bind="$v.model.password.$touch()" v-model="model.password" label="Old password"></v-text-field>
          </div>
          <div class="form-group">
            <v-text-field type="password" :error-messages="errorsNewPassword" @input="$v.model.new_password.$touch()" @bind="$v.model.new_password.$touch()" v-model="model.new_password" label="New password"></v-text-field>
          </div>
          <div class="form-group">
            <v-text-field type="password" :error-messages="errorsConfirm" @input="$v.model.confirm.$touch()" @bind="$v.model.confirm.$touch()" v-model="model.confirm" label="Confirm password"></v-text-field>
          </div>
        </form>
      </v-card-text>
      <v-card-actions>
        <v-btn flat @click="close()" :disabled="isLoading">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="submit()" :disabled="$v.$invalid" :loading="isLoading">Update</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import vuex from "vuex";
import { required, minLength, sameAs } from "vuelidate/lib/validators";

export default {
  name: "PasswordDialogComponent",
  props: {
    enabled: {
      type: Boolean,
      default: false
    }
  },
  validations: {
    model: {
      password: {
        required,
        minLength: minLength(8)
      },
      new_password: {
        required,
        minLength: minLength(8)
      },
      confirm: {
        sameAsNewPassowrd: sameAs("new_password")
      }
    }
  },
  data: () => ({}),
  computed: {
    ...vuex.mapGetters("profile/password", {
      isLoading: "IS_LOADING",
      error: "ERROR",
      model: "MODEL"
    }),
    errorsPassword: function() {
      const e = [];
      if (!this.$v.model.password.$dirty) return e;
      !this.$v.model.password.required && e.push("Old password is required");
      !this.$v.model.password.minLength && e.push("Password must be > 7 chars");
      return e;
    },
    errorsNewPassword: function() {
      const e = [];
      if (!this.$v.model.new_password.$dirty) return e;
      !this.$v.model.new_password.required && e.push("Old password is required");
      !this.$v.model.new_password.minLength && e.push("Password must be > 7 chars");
      return e;
    },
    errorsConfirm: function() {
      const e = [];
      if (!this.$v.model.confirm.$dirty) return e;
      !this.$v.model.confirm.sameAsNewPassowrd && e.push("Passwords do not mutch");
      return e;
    }
  },
  methods: {
    ...vuex.mapActions("profile/password", {
      update: "UPDATE",
      clearModel: "CLEAR_MODEL"
    }),
    submit: function() {
      this.update().then(response => {
        this.close(true);
      });
    },
    close: function(result = false) {
      this.$emit("close", result);
    }
  },
  mounted: function() {
    this.clearModel();
  }
};
</script>

<style lang="scss" scoped>
</style>
