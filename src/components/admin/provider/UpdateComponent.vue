<template>
  <div>
    <v-container fluid>
      <v-layout align-center>
        <v-flex xs12 sm12 md10>
          <v-card>
            <v-progress-linear
              style="position: absolute; width: 100%; top: 0; left: 0;"
              :height="3"
              :query="true"
              :active="isLoading"
              :indeterminate="true"
            ></v-progress-linear>
            <v-toolbar card prominent>
              <v-toolbar-title>
                <span v-if="isNew">Create provider</span>
                <span v-else>Update provider</span>
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-container fluid v-if="model">
              <v-layout>
                <!-- main flex -->
                <v-flex sm12 md8 class="mr-4">
                  <!-- slug -->
                  <div>
                    <v-text-field v-model="model.slug" label="Provider slug" type="text"></v-text-field>
                  </div>
                  <!-- end slug -->
                  <hr class="my-4" />
                  <!-- avatar image -->
                  <div class="avatar-container">
                    <drag-uploader-component
                      :file="model.avatar"
                      v-on:file-change="model.avatar = $event"
                      label="Provider avatar"
                    ></drag-uploader-component>
                  </div>
                  <!-- end avatar image -->
                  <!-- background image -->
                  <div class="background-container">
                    <drag-uploader-component
                      :file="model.background"
                      v-on:file-change="model.background = $event"
                      label="Provider background"
                    ></drag-uploader-component>
                  </div>
                  <!-- end background image -->
                  <hr class="my-4" />
                  <!-- translation name -->
                  <div>
                    <h3>Name translations</h3>
                    <div>
                      <v-select
                        multiple
                        :value="nameLanguages"
                        hint="Name translations"
                        :items="availableLanguages"
                        item-text="name"
                        item-value="code"
                        label="Select"
                        persistent-hint
                        single-line
                        @change="updateNameLanguages($event)"
                      ></v-select>
                    </div>
                    <v-container fluid>
                      <v-layout v-for="(trans, i) in model.name" :key="i" class="translation-list">
                        <v-flex xs12 sm4 md2 class="code">
                          <span>{{trans.language_code}}</span>
                        </v-flex>
                        <v-flex xs12 sm8 md12>
                          <v-text-field
                            label="Translation name"
                            aria-label="Name translation"
                            v-model="trans.value"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </div>
                  <!-- end translation name -->

                  <!-- translation descriptions -->
                  <div>
                    <h3>Description translations</h3>
                    <div>
                      <v-select
                        multiple
                        :value="descLanguages"
                        hint="Name translations"
                        :items="availableLanguages"
                        item-text="name"
                        item-value="code"
                        label="Select"
                        persistent-hint
                        single-line
                        @change="updateDescLanguages($event)"
                      ></v-select>
                    </div>
                    <v-container fluid v-for="(trans, i) in model.description" :key="i">
                      <v-layout>
                        <v-flex xs12 class="text-right">
                          <span>{{trans.language_code}}</span>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12>
                          <v-text-field
                            label="Translation description"
                            aria-label="Description translation"
                            v-model="trans.value"
                          ></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </div>
                  <!-- end translation descriptions -->

                  <!-- create roles -->
                  <div>
                    <v-container fluid class="pa-0">
                      <v-layout>
                        <v-flex sm12 md6 class="mr-2">
                          <v-text-field label="New role name" v-model="newRole.name"></v-text-field>
                        </v-flex>
                        <v-flex sm12 md6 class="ml-2">
                          <v-text-field label="New role value" v-model="newRole.value"></v-text-field>
                        </v-flex>
                      </v-layout>
                      <v-layout>
                        <v-flex xs12>
                          <v-btn
                            @click="createRole()"
                            :disabled="!isNewRoleReady"
                            color="primary"
                          >Create role</v-btn>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </div>
                  <!-- create roles end -->

                  <!-- all roles -->
                  <div v-if="model.options">
                    <v-chip
                      v-for="(role, i) in model.options.roles"
                      :key="i"
                      close
                      @input="deleteRole(role.value)"
                      color="indigo"
                      text-color="white"
                    >
                      <v-avatar>
                        <v-icon>person</v-icon>
                      </v-avatar>
                      <strong>{{role.name}}</strong>
                      &nbsp;{{role.value}}
                    </v-chip>
                  </div>
                  <!-- all roles end -->
                  <!-- default roles -->
                  <div v-if="model.options">
                    <v-combobox
                      v-model="model.options.default_roles"
                      :items="model.options.roles"
                      multiple
                      chips
                      item-text="name"
                      item-value="value"
                    ></v-combobox>
                  </div>
                  <!-- default roles end -->
                </v-flex>
                <!-- end main flex -->
                <!-- side flex -->
                <v-flex sm12 md4 class="ml-4">
                  <v-list two-line class="p-0" v-if="model.options">
                    <v-subheader>General</v-subheader>
                    <v-list-tile>
                      <v-combobox
                        :value="selectedCategories"
                        :items="availableCategories"
                        hide-selected
                        label="Categories"
                        small-chips
                        multiple
                        item-text="name"
                        item-value="id"
                        @change="updateCategories($event)"
                      ></v-combobox>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-action>
                        <v-checkbox v-model="model.options.is_enabled"></v-checkbox>
                      </v-list-tile-action>
                      <v-list-tile-content
                        @click.prevent="model.options.is_enabled = !model.options.is_enabled"
                      >
                        <v-list-tile-title>Is enabled</v-list-tile-title>
                        <v-list-tile-sub-title>Is enabled login / registration flow</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-action>
                        <v-checkbox v-model="model.options.is_visible"></v-checkbox>
                      </v-list-tile-action>
                      <v-list-tile-content
                        @click.prevent="model.options.is_visible = !model.options.is_visible"
                      >
                        <v-list-tile-title>Is visible</v-list-tile-title>
                        <v-list-tile-sub-title>Is provider visible</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-list-tile-action>
                        <v-checkbox v-model="model.options.is_registration_avaliable"></v-checkbox>
                      </v-list-tile-action>
                      <v-list-tile-content
                        @click.prevent="model.options.is_registration_avaliable = !model.options.is_registration_avaliable"
                      >
                        <v-list-tile-title>Is registration avaliable</v-list-tile-title>
                        <v-list-tile-sub-title>Is enabled registration of new user</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile>
                      <v-text-field v-model="model.options.callback_url" label="Callback url"></v-text-field>
                    </v-list-tile>
                    <hr />
                    <v-list-tile>
                      <v-list-tile-content>
                        <v-btn
                          :disabled="!isModelReady || isLoading"
                          @click="save()"
                          color="primary"
                        >Save</v-btn>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-flex>
                <!-- end side flex -->
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import vuex from "vuex";
import DragUploaderComponent from "@/components/shared/drag-uploader/DragUploaderComponent";
import SpinnerComponent from "@/components/shared/loading/SpinnerComponent";

export default {
  data: () => {
    return {};
  },
  components: {
    DragUploaderComponent
  },
  computed: {
    isModelReady: function() {
      return (
        this.model &&
        this.model.slug &&
        this.model.options &&
        this.model.name &&
        this.model.avatar &&
        this.model.background &&
        this.model.name.length &&
        this.model.description &&
        this.model.description.length &&
        this.model.options.roles &&
        this.model.options.default_roles &&
        this.model.options.roles.length &&
        this.model.options.default_roles.length &&
        this.model.categories &&
        this.model.categories.length
      );
    },
    ...vuex.mapGetters("admin/provider/update", {
      isLoading: "IS_LOADING",
      error: "ERROR",
      isNew: "IS_NEW",
      model: "MODEL",
      availableCategories: "AVAILABLE_CATEGORIES",
      availableLanguages: "AVAILABLE_LANGUAGES",
      nameLanguages: "NAME_LANGUAGES",
      descLanguages: "DESCRIPTION_LANGUAGES",
      selectedCategories: "SELECTED_CATEGORIES",
      newRole: "NEW_ROLE",
      isNewRoleReady: "NEW_ROLE_READY"
    })
  },
  methods: {
    ...vuex.mapActions("admin/provider/update", {
      init: "INIT",
      save: "SAVE",
      createRole: "CREATE_ROLE",
      deleteRole: "DELETE_ROLE",
      updateNameLanguages: "UPDATE_NAME_LANGUAGES",
      updateDescLanguages: "UPDATE_DESCRIPTION_LANGUAGES",
      updateCategories: "UPDATE_SELECTED_CATEGORIES"
    })
  },
  mounted: function() {
    this.init({ id: this.$route.params.id || null });
  }
};
</script>

<style lang="scss" scoped>
.translation-list {
  .code {
    line-height: 4rem;
    text-align: right;
    padding-right: 2rem;
    span {
      vertical-align: middle;
    }
  }
}

.options-create-role {
  display: flex;
  flex-direction: row;
  padding: 1rem;
  .options-create-role__input {
    flex: 1;
  }

  .options-create-role__button {
    width: 64px;
  }
}
</style>
