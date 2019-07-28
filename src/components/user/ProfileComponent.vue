<template>
  <div>
    <v-container>
      <v-layout justify-center>
        <v-flex sm12 md8>
          <v-card v-if="model">
            <v-toolbar card prominent>
              <v-toolbar-title>Profile</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn flat color="primary">Avatar</v-btn>
                <v-btn flat color="primary" ripple @click="openPasswordDialog()">Password</v-btn>
                <v-btn flat color="primary">Email</v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-progress-linear class="ma-0" height="2" v-if="isLoading" :indeterminate="true"></v-progress-linear>
            <v-alert v-if="error" type="warning" :value="error">{{error.message}}</v-alert>
            <v-card-text v-if="model">
              <v-container>
                <v-layout wrap>
                  <v-flex sm12 md4 fill-height>
                    <v-img :src="AvatarUrl(model.avatar_url)" alt="Profile avatar"></v-img>
                  </v-flex>
                  <v-flex sm12 md8 :class="{'pl-4': $vuetify.breakpoint.mdAndUp}">
                    <form @click.prevent>
                      <v-text-field label="First name" v-model="model.first_name" required></v-text-field>
                      <v-text-field label="Last name" v-model="model.last_name" required></v-text-field>
                      <v-select
                        v-model="model.sex"
                        :items="availableSex"
                        label="Your sex"
                        hint="Leave UNDEFINED if you want"
                        persistent-hint
                      ></v-select>
                    </form>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn flat to="/" :disabled="isLoading">Back</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" :loading="isLoading" @click="update()">Update</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <password-dialog-component :enabled="isPasswordDialog" v-on:close="isPasswordDialog = false"></password-dialog-component>
  </div>
</template>

<script>
import vuex from "vuex";
import UserMixins from "@/mixins/UserMixins";
import PasswordDialogComponent from "./dialog/PasswordDialogComponent";

export default {
  name: "ProfileComponent",
  mixins: [UserMixins],
  components: { PasswordDialogComponent },
  data: () => ({
    isPasswordDialog: false
  }),
  computed: {
    ...vuex.mapGetters("profile/profile", {
      isLoading: "IS_LOADING",
      error: "ERROR",
      model: "PROFILE",
      availableSex: "AVAILABLE_SEX"
    })
  },
  methods: {
    ...vuex.mapActions("profile/profile", {
      load: "LOAD",
      update: "UPDATE"
    }),
    openPasswordDialog: function() {
      this.isPasswordDialog = true;
    }
  },
  mounted: function() {
    this.load();
  }
};
</script>

<style lang="scss" scoped>
</style>
