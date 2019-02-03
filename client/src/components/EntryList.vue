<template>
  <div class="entryList">
    <div class="list-group py-3" v-if="catagory === 'entry'">
      <router-link v-bind:to="catagory + '/' + entry.id" class="list-group-item list-group-item-active align-items-start" v-for="entry in $store.state.entries" :key="entry.id" v-if="shouldDisplayEntry(entry)">
        <h5><router-link v-bind:to="'people/' + author" v-for="author in entry.authors" :key="author">
            {{author}}
          </router-link></h5>
          <p class="text-muted mx-1">
            {{ entry.title }}
          </p>
      </router-link>
    </div>
    <div class="list-group py-3" v-if="catagory === 'people'">
      <router-link v-bind:to="catagory + '/' + entry.name" class="list-group-item list-group-item-active align-items-start" v-for="entry in $store.state.people" :key="entry.name" v-if="value === 'all' || (entry.name && entry.name[0].toUpperCase() === value)">
        <h5>{{ entry.name }}</h5>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class EntryList extends Vue {
  @Prop() private catagory!: string;
  @Prop() private sortKey!: string;
  @Prop() private value!: any;
  private mounted() {
    //this.$store.watch((state) => state.currentTag, () => {
    //  this.$forceUpdate();
    //});
  }
  private shouldDisplayEntry(entry: any): boolean {
    if (this.$route.path === '/tags' && this.$store.state.currentTag && !entry.tags.includes(this.$store.state.currentTag)) {
      return false;
    }
    return this.value === 'all' ||
      (this.sortKey === 'title' && entry.title.length !== 0 && entry.title[0].toUpperCase() === this.value) ||
      (this.sortKey === 'date' && Math.floor(entry.date / 100) * 100 === this.value) ||
      (this.sortKey === 'author' && entry.authors.length !== 0 &&
        entry.authors[0].length !== 0 && entry.authors[0][0].toUpperCase() === this.value);
  }
}
</script>
