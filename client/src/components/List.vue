<template>
  <div class="entry-list">
    <div class="card">
      <div class="card-body">
        <h2 class="card-title mx-auto">Listing</h2>
        <div class="mx-auto">
          <div class="btn-group btn-group-sm mx-2" role="group">
            <button type="button" class="btn btn-sm btn-primary" v-bind:class="{ 'active': current === 'all' }" v-on:click="current = 'all'">
              All
            </button>
            <div class="btn-group btn-group-sm" role="group" v-if="catagory === 'entry'">
              <button type="button" class="btn dropdown-toggle btn-primary" data-toggle="dropdown" v-if="sortKey === 'date'">
                Date
              </button>
              <button type="button" class="btn dropdown-toggle btn-primary" data-toggle="dropdown" v-if="sortKey === 'title'">
                Title
              </button>
              <button type="button" class="btn dropdown-toggle btn-primary" data-toggle="dropdown" v-if="sortKey === 'author'">
                Author
              </button>
              <div class="dropdown-menu">
                <button class="dropdown-item" v-on:click="useSort('title')">Title</button>
                <button class="dropdown-item" v-on:click="useSort('date')">Date</button>
                <button class="dropdown-item" v-on:click="useSort('author')">Author</button>
              </div>
            </div>
          </div>
          <div class="btn-group btn-group-sm" role="group">
            <button type="button" class="btn btn-sm btn-primary" v-bind:class="{ 'active': current === id }"v-for="id in index" :key="id" v-on:click="current=id">
              {{id}}
            </button>
          </div>
        </div>
      </div>
    </div>
    <EntryList :catagory="catagory" :sortKey="sortKey" :value="current"/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import EntryList from '@/components/EntryList.vue';

@Component({
  components: {
    EntryList,
  },
})
export default class List extends Vue {
  @Prop() private catagory!: string;
  private index: string[] = [];
  private current: any = 'all';
  private sortKey: string = 'title';
  private mounted() {
    this.$store.watch((state) => state.entries, () => {
      this.loadIndex();
    });
    this.$store.watch((state) => state.people, () => {
      this.loadIndex();
    });
    this.$store.watch((state) => state.currentTag, () => {
      this.loadIndex();
    })
    this.sortKey = this.$store.state.sortMethod;
    this.loadIndex();
  }
  private useSort(key: string): any {
    this.sortKey = key;
    if (this.sortKey === 'title') {
      this.$store.commit('sortEntriesTitle');
    } else if (this.sortKey === 'date') {
      this.$store.commit('sortEntriesDate');
    } else if (this.sortKey === 'author') {
      this.$store.commit('sortEntriesAuthor');
    }
    this.current = 'all';
    this.loadIndex();
  }
  private loadIndex(): any {
    if (this.catagory === 'entry') {
      const indexSet = new Set();
      for (const entry of this.$store.state.entries) {
        if (this.sortKey === 'title' && entry.title) {
          if (this.$route.path === '/tags' && this.$store.state.currentTag){
            if (entry.tags.includes(this.$store.state.currentTag)){
              indexSet.add(entry.title[0].toUpperCase());
            }
          }else{
            indexSet.add(entry.title[0].toUpperCase());
          }
        } else if (this.sortKey === 'date') {
          indexSet.add(Math.floor(entry.date / 100) * 100);
        } else if (this.sortKey === 'author' && entry.authors.length !== 0 && entry.authors[0] !== '') {
          indexSet.add(entry.authors[0][0].toUpperCase());
        }
      }
      this.index = Array.from(indexSet.values()).sort();
    } else if (this.catagory === 'people') {
      const indexSet = new Set();
      for (const person of this.$store.state.people) {
        if (person.name){
          indexSet.add(person.name[0].toUpperCase());
        }
      }
      this.index = Array.from(indexSet.values()).sort();
    }
  }
}
</script>
