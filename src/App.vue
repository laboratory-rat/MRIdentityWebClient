<template>
  <div id="app">
    <v-app v-cloak>
      <v-navigation-drawer
        app
        fixed
        :permanent="!isSmallScreen"
        :temporary="isSmallScreen"
        v-model="drawer"
        v-if="user"
      >
        <v-toolbar flat class="transparent">
          <v-list class="pa-0">
            <v-list-tile avatar>
              <v-list-tile-avatar>
                <img :src="AvatarUrl()" />
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title class>
                  <div
                    class="text-truncate"
                    v-if="user.first_name || user.last_name"
                  >{{user.first_name}} {{user.last_name}}</div>
                  <div v-else class="text-truncate">{{user.email}}</div>
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-toolbar>
        <v-list class="pt-0" v-if="isAdmin">
          <v-divider></v-divider>
          <v-list-tile ripple to="/admin/provider">
            <v-list-tile-action>
              <v-icon>extension</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>PROVIDERS</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile ripple to="/admin/category">
            <v-list-tile-action>
              <v-icon>category</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>CATEGORIES</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile ripple to="/admin/user">
            <v-list-tile-action>
              <v-icon>person</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>USERS</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-list class="pt-0">
          <v-divider></v-divider>

          <v-list-tile to="/" ripple>
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>HOME</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <v-list-tile to="/profile" ripple>
            <v-list-tile-action>
              <v-icon>person</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>Profile</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar app color="primary">
        <v-toolbar-side-icon @click="drawer = !drawer" v-if="user" v-show="isSmallScreen">
          <v-icon color="white">menu</v-icon>
        </v-toolbar-side-icon>
        <router-link to="/">
          <v-toolbar-title class="white--text">MR Identity</v-toolbar-title>
        </router-link>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn @click="$router.push({path: '/login'})" flat color="white" v-if="!user">Login</v-btn>
          <v-btn @click="$router.push({path: '/terms'})" flat color="white">Terms</v-btn>
          <v-btn @click="$router.push({path: '/about'})" flat color="white">About</v-btn>
          <v-btn flat color="white" v-if="user" @click="logout()">Logout</v-btn>

          <!-- language menu -->
          <v-menu bottom left v-if="languages">
            <template v-slot:activator="{ on }">
              <v-btn dark icon v-on="on">
                <v-icon>language</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-tile
                v-for="(item, i) in languages"
                :key="i"
                @click="selectLanguage(item.code)"
              >
                <v-list-tile-title :class="{active: item.code == language}">{{ item.name }}</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
          <!-- end language menu -->
        </v-toolbar-items>
      </v-toolbar>
      <v-content>
        <v-container fluid class="app-container" v-bind:class="{wide: isWide}">
          <router-view></router-view>
        </v-container>
      </v-content>
      <v-footer height="auto" color="primary lighter-1">
        <v-layout justify-center row wrap>
          <v-btn color="white" to="/" flat round>HOME</v-btn>
          <v-btn color="white" to="/terms" flat round>TERMS</v-btn>
          <v-btn color="white" to="/about" flat round>ABOUT</v-btn>
          <v-flex primary lighten-2 py-3 text-xs-center white--text xs12>
            &copy;2019 -
            <strong>MR Identity</strong>
          </v-flex>
        </v-layout>
      </v-footer>
    </v-app>
    <div v-if="currentToast != null">
      <v-snackbar
        v-model="toastActive"
        :color="currentToast.color"
        :multi-line="currentToast.mode === 'multi-line'"
        :timeout="currentToast.timeout"
        :vertical="currentToast.mode === 'vertical'"
        :bottom="currentToast.y === 'bottom'"
        :left="currentToast.x === 'left'"
        :right="currentToast.x === 'right'"
        :top="currentToast.y === 'top'"
      >
        {{ currentToast.text }}
        <v-btn
          dark
          flat
          @click="closeToast()"
        >
          Close
        </v-btn>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import config from "@/config/config";
import vuex from "vuex";
import UserMixins from "@/mixins/UserMixins";
import { timeout } from 'q';
import { setTimeout } from 'timers';
export default {
  mixins: [UserMixins],
  data: function() {
    return {
      drawer: false,
      currentToast: null,
      toastActive: false
    };
  },
  computed: {
    ...vuex.mapGetters("common/user", {
      isLoading: "IS_LOADING",
      error: "ERROR",
      user: "USER",
      userRoles: "USER_ROLES",
      isAdmin: "USER_ROLE_ADMIN",
      isManager: "USER_ROLE_MANAGER",
      language: "LANGUAGE"
    }),

    ...vuex.mapGetters("common/language", {
      languages: "GET"
    }),
    
    ...vuex.mapGetters('common/layout', {
      toasts: 'TOASTS'
    }),

    isWide() {
      return this.$route.meta.wide;
    },
    isSmallScreen() {
      return ["xs", "sm", "md"].indexOf(this.$vuetify.breakpoint.name) !== -1;
    }
  },
  created: function() {
    axios.defaults.baseURL = config.BASE_API;
    this.init();
    this.getLanguages();
  },
  mounted: function() {
    this.$watch('toasts', (nVal, oVal) => {
      if(nVal.length) {
        let toast = nVal[0];
        this.toastShift();
        if(this.currentToast != null){
          this.closeToast()
            .then(() => {
              this.openToast(toast);
            });
        } else {
          this.openToast(toast);
        }
      }
    })
  },
  methods: {
    ...vuex.mapActions("common/user", {
      init: "INIT",
      signIn: "SING_IN",
      signUp: "SIGN_UP",
      logoutAction: "LOGOUT",
      setLanguage: "SET_LANGUAGE"
    }),
    ...vuex.mapActions("common/language", {
      getLanguages: "GET"
    }),
    ...vuex.mapActions('common/layout', {
      toastShift: 'SHIFT_TOAST'
    }),
    logout: function() {
      this.logoutAction();
      this.$router.push({ path: "/" });
    },
    selectLanguage: function(language) {
      this.setLanguage(language);
    },
    closeToast: function(){
      return new Promise((resolve, reject) => {
        this.toastActive = false;
        setTimeout(() => {
          this.currentToast = null;
          resolve()
        }, 500);
      })
    },
    openToast: function(toast){
      this.currentToast = toast;
      setTimeout(() => {
        this.toastActive = true;
      }, 100);
    }
  }
};
</script>

<style lang="scss">
.app-container {
  max-width: 1200px !important;
  margin: 0 auto !important;
  &.wide {
    max-width: unset !important;
    margin: 0 !important;
    padding: 0 !important;
  }
}
</style>
