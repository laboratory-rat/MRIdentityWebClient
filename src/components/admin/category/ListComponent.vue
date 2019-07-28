<template>
  <div>
    <v-container pa-0>
      <v-layout justify-center>
        <v-flex sm12 md8>
          <v-card>
            <v-toolbar card prominent>
              <v-toolbar-title>Categories</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn
                  flat
                  :loading="isLoading"
                  color="primary"
                  @click="$router.push({path: '/admin/category/update'})"
                >Add</v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-list tow-line>
              <v-list-tile v-if="!isLoading && isEnd">
                <v-list-tile-content>
                  <v-list-tile-title>No categories found</v-list-tile-title>
                  <v-list-tile-sub-title>Click add to create one</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile v-for="(category, i) in list" :key="i">
                <v-list-tile-content>
                  <v-list-tile-title>{{category.name}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{category.create_time | time}}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-menu>
                    <template v-slot:activator="{on}">
                      <v-btn icon v-on="on">
                        <v-icon color="accent">more_horiz</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-tile
                        ripple
                        @click="$router.push({path: '/admin/category/update' + category.id})"
                      >
                        <v-list-tile-title>Update</v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile ripple @click="deleteClick(category)">
                        <v-list-tile-title class="red--text">Delete</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-dialog max-width="400" v-model="isDeleteDialog">
      <v-card v-if="categoryToDelete">
        <v-card-title class="headline">Delete category</v-card-title>
        <v-card-text>
          <p>
            Delete {{categoryToDelete.name}}? This actions
            <strong>can not be reveted!</strong>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn flat color="red" @click="deleteDialogClose(true)" :loading="isLoading">Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn flat @click="deleteDialogClose(false)">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import vuex from "vuex";
export default {
  data: () => ({
    isDeleteDialog: false,
    categoryToDelete: null
  }),
  computed: {
    ...vuex.mapGetters("admin/category/list", {
      error: "ERROR",
      isLoading: "IS_LOADING",
      list: "LIST",
      skip: "SKIP",
      limit: "LIMIT",
      total: "TOTAL",
      isEnd: "IS_END",
      pageTotal: "PAGE_TOTAL",
      pageLimit: "PAGE_LIMIT"
    })
  },
  methods: {
    ...vuex.mapActions("admin/category/list", {
      load: "LOAD",
      delete: "DELETE"
    }),
    deleteClick: function(category) {
      if (!category) {
        return;
      }

      this.categoryToDelete = category;
      this.isDeleteDialog = true;
    },
    deleteDialogClose: function(response) {
      if (!response) {
        this.categoryToDelete = null;
        this.isDeleteDialog = false;
      } else {
        this.delete(this.categoryToDelete).then(() => {
          this.categoryToDelete = null;
          this.isDeleteDialog = false;
        });
      }
    }
  },
  mounted: function() {
    this.load({
      clear: true,
      skip: 0,
      limit: 20
    });
  }
};
</script>


<style lang="scss" scoped>
.title {
  position: relative;
  a {
    position: absolute;
    right: 0;
    top: 0;
  }
}

.tile-action {
  display: inline-block;
  button {
    &:not(:last-child) {
      margin-right: 15%;
    }
  }
}
</style>
