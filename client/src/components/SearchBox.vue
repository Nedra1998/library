<template>
  <div class="search-box">
    <div class="card">
      <div class="card-body">
        <h2 class="card-title">Search</h2>
        <form v-on:submit.prevent>
          <div class="form-group row px-3">
            <div class="col-md-10">
              <input class="form-control" type="search" placeholder="Search" v-model="query" v-on:input="handleSearchLive()"/>
            </div>
            <button class="btn btn-outline-success col-md-2" type="button" v-on:click="handleSearch()">Search</button>
          </div>
          <div class="px-3 form-group row">
            <div class="col-md-10" />
              <button class="col-md-2 btn" type="button" v-on:click="live=!live" v-bind:class="{ 'btn-success': live }">Live Search</button>
            </div>
        </form>
          </div>
      </div>
      <SearchResult v-bind:catagory="catagory" />
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import SearchResult from '@/components/SearchResult.vue';

@Component({
  components: {
    SearchResult,
  },
})
export default class SearchBox extends Vue {
  @Prop() private catagory!: string;
  private live: boolean = true;
  private query: string = '';
  private handleSearch(): void {
    if (this.query !== '') {
      this.$store.dispatch('search', [this.catagory, this.query]);
    } else if (this.query === '' && this.catagory === 'entry') {
      this.$store.commit('setQueryEntryResult', []);
    } else if (this.query === '' && this.catagory === 'people') {
      this.$store.commit('setQueryPeopleResult', []);
    }
  }
  private handleSearchLive(): void {
    if (this.live) {
      this.handleSearch();
    }
  }
}
</script>
