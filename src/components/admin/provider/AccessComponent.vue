<template>
  <div>
    <v-container>
      <v-layout>
        <v-flex xs12 sm12 md8 offset-md2>
          <v-card>
            <v-card-title>
              <h3 class="display-1">Provider access options</h3>
            </v-card-title>
            <api-error :error="error"></api-error>
            <v-list two-line v-if="model">
              <v-subheader>Access tokens</v-subheader>
              <v-list-tile v-for="(token, i) in model.tokens" :key="i">
                <v-list-tile-content>
                  <v-list-tile-title>{{token.name}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{token.value}}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn icon ripple @click="showTokenInfo(token)">
                    <v-icon color="accent">info</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-list-tile v-show="!isLoading && !model.tokens.length">
                <v-list-tile-content>
                  <v-list-tile-title>No tokens found</v-list-tile-title>
                  <v-list-tile-sub-title>Click add token to create one</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider></v-divider>
              <v-subheader>Access rules</v-subheader>
              <v-list-tile v-for="(rule, i) in model.rules" :key="i"></v-list-tile>
              <v-list-tile v-show="!isLoading && !model.rules.length">
                <v-list-tile-content>
                  <v-list-tile-title>No rules found</v-list-tile-title>
                  <v-list-tile-sub-title>Click add rule to create one</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
            <v-card-actions>
              <v-btn flat @click="$router.go(-1)">Back</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="accent" @click.stop="isTokenDialog = true">Create token</v-btn>
              <v-btn color="accent" disabled>Create rule</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- dialog create token -->
    <v-dialog v-model="isTokenDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Provide required token information</v-card-title>
        <v-card-text class="pa-4">
          <v-text-field label="Name" v-model="tokenModel.name" :disabled="isLoading"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click.stop="isTokenDialog = false">Colse</v-btn>
          <v-spacer></v-spacer>
          <v-btn ripple color="primary" @click.stop="saveTokenModel()">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- end dialog create token -->
    <!-- token info dialog -->
    <v-dialog v-model="isTokenInfoDialog" max-width="400">
      <v-card v-if="selectedToken">
        <v-card-text>
          <p>
            name:
            <strong>{{selectedToken.name}}</strong>
          </p>
          <p>
            value:
            <strong>{{selectedToken.value}}</strong>
          </p>
          <p>
            created by:
            <strong>{{selectedToken.created_by_email}}</strong>
          </p>
          <p>
            created time:
            <strong>{{selectedToken.create_time | time}}</strong>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn :loading="isLoading" @click="deleteTokenClick()" flat color="red" dark>Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn :disabled="isLoading" flat @click="showTokenInfoClose()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- end token info dialog -->
  </div>
</template>

<script>
import vuex from "vuex";
import ApiError from "@/components/shared/error/apiError";

export default {
  components: {
    ApiError
  },
  data: () => ({
    isTokenDialog: false,
    isRuleDialog: false,
    isTokenInfoDialog: false,
    selectedToken: null
  }),
  computed: {
    ...vuex.mapGetters("admin/provider/access", {
      isLoading: "IS_LOADING",
      error: "ERROR",
      provider: "PROVIDER",
      model: "MODEL",
      tokenModel: "TOKEN_MODEL",
      tokenModelError: "TOKEN_MODEL_ERROR"
    })
  },
  methods: {
    ...vuex.mapActions("admin/provider/access", {
      init: "INIT",
      createToken: "CREATE_TOKEN",
      deleteToken: "DELETE_TOKEN"
    }),
    saveTokenModel: function() {
      if (this.isLoading || !this.tokenModel.name.length) {
        return;
      }

      this.createToken();
      this.isTokenDialog = false;
    },
    showTokenInfo: function(token) {
      this.selectedToken = token;
      this.isTokenInfoDialog = true;
    },
    showTokenInfoClose: function() {
      this.isTokenInfoDialog = false;
      this.selectedToken = null;
    },
    deleteTokenClick: function() {
      this.deleteToken(this.selectedToken.value).then(r => {
        this.selectedToken = null;
        this.isTokenInfoDialog = false;
      });
    }
  },
  mounted: function() {
    this.init({ slug: this.$route.params.slug || null });
  }
};
</script>

<style lang="scss" scoped>
</style>
