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
              <button type="button" class="btn dropdown-toggle btn-primary" data-toggle="dropdown" v-if="useDate === true">
                Date
              </button>
              <button type="button" class="btn dropdown-toggle btn-primary" data-toggle="dropdown" v-else>
                Title
              </button>
              <div class="dropdown-menu">
                <button class="dropdown-item" v-on:click="setUseDate(false)">Title</button>
                <button class="dropdown-item" v-on:click="setUseDate(true)">Date</button>
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
    <EntryList :catagory="catagory" :useDate="useDate" :value="current"/>
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
  private useDate: boolean = false;
  private mounted() {
    this.$store.watch((state) => state.entries, () => {
      this.loadIndex();
    });
    this.loadIndex();
  }
  private setUseDate(value: boolean) {
    this.useDate = value;
    this.loadIndex();
  }
  private loadIndex(): any {
    if (this.catagory === 'entry') {
      const indexSet = new Set();
      for (const entry of this.$store.state.entries) {
        if (this.useDate === false) {
          indexSet.add(entry.title[0].toUpperCase());
        } else {
          indexSet.add(Math.floor(entry.date / 100) * 100);
        }
      }
      this.index = Array.from(indexSet.values()).sort();
    } else if (this.catagory === 'people') {

    }
  }
}
</script>
