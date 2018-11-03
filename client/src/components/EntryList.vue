<template>
  <div class="entryList">
    <div class="list-group py-3" v-if="catagory === 'entry'">
      <router-link v-bind:to="catagory + '/' + entry.id" class="list-group-item list-group-item-active align-items-start" v-for="entry in $store.state.entries" :key="entry.id" v-if="value === 'all' || entry.title[0].toUpperCase() === value || (useDate === true && Math.floor(entry.date / 100) * 100) === value">
        <h5>{{ entry.title }}</h5>
        <p class="text-muted">
          <router-link class="text-muted mx-1" v-bind:to="'people/' + author" v-for="author in entry.authors" :key="author">
            {{author}}
          </router-link>
        </p>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EntryList extends Vue {
  @Prop() private catagory!: string;
  @Prop() private useDate!: boolean;
  @Prop() private value!: any;
}
</script>
