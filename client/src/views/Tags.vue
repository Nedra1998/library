<template>
  <div class="main" style="{marginBottom: '220px'}">
    <Header />
      <div class="p-3 container">
        <div class="card my-3">
          <div class="card-body">
            <h2 class="card-title">Tag: {{ $store.state.currentTag }}</h2>
            <div class="badge mx-1" :class="{'badge-secondary': $store.state.currenTag !== stag, 'badge-primary': $store.state.currentTag === stag}"v-for="stag in $store.state.tags" v-on:click="setTag(stag)">{{ stag }}</div>
          </div>
        </div>
        <List catagory='entry' />
      </div>
      <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import List from '@/components/List.vue';

@Component({
  components: {
    Header,
    Footer,
    List,
  },
})
export default class Tags extends Vue {
  private setTag(tag: string): void {
    this.$store.commit('setTag', tag);
  }
}
</script>
