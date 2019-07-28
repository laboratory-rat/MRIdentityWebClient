<template>
  <div>
    <v-container>
      <v-layout justify-center>
        <v-flex sm12>
          <v-card>
            <v-toolbar card prominent>
              <v-toolbar-title>Users</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn flat :loading="isLoading" color="primary">Add</v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-title>
              <v-spacer></v-spacer>
              <v-text-field clearable append-icon="search" label="Search" single-line hide-details></v-text-field>
            </v-card-title>
            <v-data-table
              :pagination.sync="pagination"
              :total-items="total"
              :loading="isLoading"
              v-if="list"
              :headers="tableHeaders"
              :items="list"
            >
              <template v-slot:items="props">
                <td>
                  <v-avatar size="36" color="primary" tile>
                    <img :src="AvatarUrl(props.item.avatar_url)" alt="User avatar" />
                  </v-avatar>
                </td>
                <td>{{props.item.email}}</td>
                <td>{{props.item.first_name}} {{props.item.last_name}}</td>
                <td>{{props.item.roles.join(", ")}}</td>
                <td>{{props.item.create_time | time}}</td>
                <td>{{props.item.language_code || "Undefined"}}</td>
                <td>
                  <v-menu offset-x>
                    <template v-slot:activator="{ on }">
                      <v-btn icon  v-on="on">
                        <v-icon color="accent">more_horiz</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>Edit</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>Update roles</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile>
                        <v-list-tile-content>
                          <v-list-tile-title>Providers</v-list-tile-title>
                        </v-list-tile-content>
                      </v-list-tile>
                      <v-divider></v-divider>
                      <v-list-tile color--red @click="urInit(props.item)">
                        <v-list-tile-content>
                          <v-list-tile-title>Delete</v-list-tile-title>
                        </v-list-tile-content>
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
    <v-dialog v-model="urUser" max-width="400">
      <v-card v-if="urUser != null">
        <v-card-title class="headline">Update user roles</v-card-title>
        <v-card-text>
          <v-select
            :items="urAvailable"
            v-model="urUser.roles"
            chips
            small-chips
            label="User roles">
          </v-select>
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click="urUpdate(false)">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="urUpdate(true)">Update</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import vuex from "vuex";
import UserMixins from "@/mixins/UserMixins";

export default {
  mixins: [UserMixins],
  data: () => ({
    pagination: {},
    rolesEditUser: null
  }),
  computed: {
    tableHeaders: () => _tableHeaders,
    ...vuex.mapGetters("admin/user/list", {
      isLoading: "IS_LOADING",
      error: "ERROR",
      list: "LIST",
      skip: "SKIP",
      limit: "LIMIT",
      total: "TOTAL",
      pageCurrent: "PAGE_CURRENT",
      pageTotal: "PAGE_TOTAL"
    }),
    ...vuex.mapGetters('admin/user/updateRoles', {
      urAvailable: 'AVAILABLE',
      urUser: 'USER'
    })
  },
  methods: {
    ...vuex.mapActions("admin/user/list", {
      load: "LOAD"
    }),
    ...vuex.mapActions('admin/user/updateRoles', {
      urInit: 'INIT',
      urUpdate: 'UPDATE'
    })
  },
  watch: {
    pagination: {
      handler() {
        this.load({
          clear: true,
          skip: (this.pagination.page - 1) * this.pagination.rowsPerPage,
          limit:
            this.pagination.rowsPerPage === -1
              ? 999
              : this.pagination.rowsPerPage
        });
      },
      deep: true
    }
  },
  mounted: function() {
    this.load({
      clear: true,
      skip: (this.pagination.page - 1) * this.pagination.rowsPerPage,
      limit: this.rowsPerPage
    });
  }
};

const _tableHeaders = [
  { text: "", value: "avatar", sortable: false },
  { text: "Email", value: "email" },
  { text: "Name", value: "first_name" },
  { text: "Roles", value: "roles", sortable: false },
  { text: "Create time", value: "create_time", sortable: false },
  { text: "Language", value: "language_code", sortable: true },
  { text: "", value: "actions", sortable: false }
];
</script>

<style lang="scss" scoped>
</style>
