<template>
  <div class="entry-list">
    <div class="card">
      <div class="card-body">
        <h2 class="card-title mx-auto">Listing</h2>
        <div class="mx-auto">
          <div class="btn-group btn-group-sm" role="group">
            <button type="button" class="btn btn-sm btn-primary mx-2" v-bind:class="{ 'active': current === 'all' }" v-on:click="current = 'all'">
              All
            </button>
          </div>
          <div class="btn-group btn-group-sm" role="group">
            <button type="button" class="btn btn-sm btn-primary" v-bind:class="{ 'active': current === id }"v-for="id in index" :key="id" v-on:click="current=id">
              {{id}}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SearchResult extends Vue {
  private index: Array = ['a', 'b'];
  private current: any = 'all';
}
</script>
