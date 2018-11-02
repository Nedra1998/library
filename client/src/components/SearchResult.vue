<template>
  <div class="resultList">
    <div class="list-group py-3" v-if="catagory === 'entry'">
      <router-link v-bind:to="catagory + '/' + entry.id" class="list-group-item list-group-item-active align-items-start" v-for="entry in $store.state.queryEntryResult" :key="entry.id">
        <h5>{{ entry.title }}</h5>
        <p class="text-muted">
          <router-link class="text-muted mx-1" v-bind:to="'people/' + author" v-for="author in entry.authors" :key="author">
            {{author}}
          </router-link>
        </p>
      </router-link>
    </div>
    <div class="list-group py-3" v-if="catagory === 'people'">
      <a v-for="entry in $store.state.queryPeopleResult">
        {{ entry }}
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SearchResult extends Vue {
  @Prop() private catagory!: string;
}
</script>
