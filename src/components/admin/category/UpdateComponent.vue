<template>
  <div>
    <v-container>
      <v-layout>
        <v-flex sm12 md8 offset-md2>
          <v-card>
            <v-toolbar card prominent>
              <v-toolbar-title>
                <span v-if="!modelId">Create</span>
                <span v-else>Update</span>
                <span>&nbsp;category</span>
              </v-toolbar-title>
            </v-toolbar>
            <v-alert v-if="error" :value="error" color="warning" icon="warning" outline>{{error.message}}</v-alert>
            <v-card-text v-if="model">
              <v-container grid-list-lg>
                <v-layout wrap>
                  <v-flex sm12 md6>
                    <v-text-field label="Slug" v-model="model.slug"></v-text-field>
                  </v-flex>
                  <v-flex sm12 md6>
                    <v-select
                      multiple
                      :value="modelLanguages"
                      :items="availableLanguages"
                      hint="Category translations"
                      item-text="name"
                      item-value="code"
                      label="Select translation languages"
                      persistent-hint
                      @change="updateModelLanguages"
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-container>
              <v-container v-if="model && model.name">
                <v-layout v-for="(t, i) in model.name" :key="i">
                  <v-flex xs12>
                    <v-text-field v-model="t.value" :label="'Translation ' + t.language_code"></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn
                @click="$router.push({path: '/admin/category'})"
                flat
                ripple
                :disabled="isLoading"
              >Back</v-btn>
              <v-spacer></v-spacer>
              <v-btn
                raised
                @click="updateClick()"
                color="primary"
                :disabled="!isValid"
                ripple
                :loading="isLoading"
              >
                <span v-if="modelId">Update</span>
                <span v-else>Create</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import vuex from "vuex";
import { required, minLength } from "vuelidate/lib/validators";
export default {
  data: () => ({}),
  computed: {
    ...vuex.mapGetters("admin/category/update", {
      isLoading: "IS_LOADING",
      error: "ERROR",
      model: "MODEL",
      modelId: "MODEL_ID",
      availableLanguages: "AVAILABLE_LANGUAGES",
      modelLanguages: "MODEL_LANGUAGES",
      isValid: "IS_VALID"
    })
  },
  methods: {
    ...vuex.mapActions("admin/category/update", {
      load: "LOAD",
      updateModelLanguages: "UPDATE_MODEL_LANGUAGES",
      update: "UPDATE"
    }),
    updateClick: function() {
      this.update().then(model => {
        this.$router.push({ path: "/admin/category" });
      });
    }
  },
  mounted: function() {
    this.load({
      id: this.$route.params.id || null
    });
  }
};
</script>

<style lang="scss" scoped>
</style>
