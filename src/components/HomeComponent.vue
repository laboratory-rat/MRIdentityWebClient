<template>
  <div id="home-component">
    <header>
      <h2>Providers</h2>
    </header>
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex
          md3
          sm6
          xs12
          v-for="(provider, i) in list"
          :key="i"
        >
          <v-card tile ripple @click="$router.push({path: `/provider/${provider.slug}`})">
            <v-img height="200px" :src="provider.avatar_url"></v-img>
            <v-card-text>
              <p>{{provider.name}}</p>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import vuex from "vuex";

export default {
  data: function() {
    return {};
  },
  computed: {
    ...vuex.mapGetters("face/list", {
      isLoading: "IS_LOADING",
      error: "ERROR",
      list: "LIST",
      total: "TOTAL",
      pageTotal: "PAGE_TOTAL",
      pageCurrent: "PAGE_CURRENT",
      isLastPage: "IS_LAST_PAGE"
    })
  },
  methods: {
    ...vuex.mapActions("face/list", {
      setPaging: "SET_PAGING",
      load: "LOAD"
    })
  },
  mounted: function() {
    this.load({
      clear: true,
      skip: 0,
      limit: 10
    });
  }
};
</script>

<style lang="scss" scoped>
.provider__card{
  cursor: pointer;
}
</style>
