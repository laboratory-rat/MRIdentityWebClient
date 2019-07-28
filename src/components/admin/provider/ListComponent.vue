<template>
  <div>
    <v-container pa-0>
      <v-layout justify-center>
        <v-flex sm12 md10>
          <v-card>
            <v-card-title>
              Providers
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
              <v-btn color="primary" fab small raised to="/admin/provider/update">
                <v-icon>add</v-icon>
              </v-btn>
            </v-card-title>
            <v-data-table
              :loading="isLoading"
              :total-items="total"
              :pagination.sync="pagination"
              :headers="tableHeaders"
              :items="list"
              v-if="list"
            >
              <template v-slot:items="props">
                <td>
                  <v-avatar size="36" color="primary">
                    <v-img :src="props.item.avatar_url" :alt="props.item.name + ' Image'"></v-img>
                  </v-avatar>
                </td>
                <td>{{props.item.name}}</td>
                <td>
                  <v-chip
                    small
                    v-for="(category, i) in props.item.categories"
                    :key="i"
                    dark
                  >{{category.name}}</v-chip>
                </td>
                <td>
                  <div class="pa-2 d-flex">
                    <div>
                      <v-icon color="green" v-if="props.item.options.is_enabled">check_box</v-icon>
                      <v-icon color="red" v-else>check_box_outline_blank</v-icon>
                    </div>
                    <div>
                      <v-icon
                        color="green"
                        v-if="props.item.options.is_registration_enabled"
                      >person_add</v-icon>
                      <v-icon color="red" v-else>person_add_disabled</v-icon>
                    </div>
                    <div>
                      <v-icon color="green" v-if="props.item.options.is_visible">visibility</v-icon>
                      <v-icon color="red" v-else>visibility_off</v-icon>
                    </div>
                  </div>
                </td>
                <td>
                  <span>{{props.item.create_time | time}}</span>
                </td>
                <td>
                  <v-menu offset-x>
                    <template v-slot:activator="{on}">
                      <v-btn icon v-on="on">
                        <v-icon color="accent">more_horiz</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-tile
                        @click="$router.push({path: '/admin/provider/update/' + props.item.id})"
                        ripple
                      >
                        <v-list-tile-title>Edit</v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile
                        @click="$router.push({path: '/admin/provider/access/' + props.item.slug})"
                        ripple
                      >
                        <v-list-tile-title>Access options</v-list-tile-title>
                      </v-list-tile>
                      <v-divider></v-divider>
                      <v-list-tile ripple @click="openDeleteDialog(props.item)">
                        <v-list-tile-title class="red--text">Delete</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </td>
              </template>
            </v-data-table>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog max-width="400" v-model="isDeleteDialog">
      <v-card v-if="providerToDelete">
        <v-card-title class="headline">Delete provider?</v-card-title>
        <v-card-text>
          <p>
            Provider
            <strong>{{providerToDelete.name}}</strong> can not be restored after that chagnes
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="red" @click="closeDeleteDialog(true)" :loading="isLoading">Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat :disabled="isLoading" @click="closeDeleteDialog(false)">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import vuex from "vuex";

const constTableHeaders = [
  {
    text: "Avatar",
    sortable: false,
    value: "avatar"
  },
  {
    text: "Name",
    sortable: true,
    value: "name"
  },
  {
    text: "Categories",
    sortable: false,
    value: "categories"
  },
  {
    text: "Options",
    sortable: false,
    value: "options"
  },
  {
    text: "Created",
    sortable: true,
    value: "created"
  },
  {
    text: "",
    sortable: false,
    value: "actions"
  }
];

export default {
  components: {},
  data: function() {
    return {
      search: "",
      isDeleteDialog: false,
      providerToDelete: null,
      tableHeaders: constTableHeaders,
      pagination: {}
    };
  },
  computed: {
    ...vuex.mapGetters("admin/provider/list", {
      isLoading: "IS_LOADING",
      error: "ERROR",
      list: "LIST",
      skip: "SKIP",
      limit: "LIMIT",
      total: "TOTAL",
      pageTotal: "PAGE_TOTAL",
      pageCurrent: "PAGE_CURRENT",
      isEnd: "IS_END"
    })
  },
  mounted: function() {
    this.load({
      clear: true,
      skip: 0,
      limit: 20
    });
  },
  methods: {
    ...vuex.mapActions("admin/provider/list", {
      load: "LOAD",
      delete: "DELETE"
    }),
    openDeleteDialog: function(provider) {
      if (!provider) return;
      this.providerToDelete = provider;
      this.isDeleteDialog = true;
    },
    closeDeleteDialog: function(confirm) {
      if (confirm) {
        this.delete(this.providerToDelete.id).then(response => {
          this.providerToDelete = null;
          this.isDeleteDialog = false;
        });
      } else {
        this.providerToDelete = null;
        this.isDeleteDialog = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tile-action {
  display: inline-block;
  button {
    &:not(:last-child) {
      margin-right: 15%;
    }
  }
}
</style>
