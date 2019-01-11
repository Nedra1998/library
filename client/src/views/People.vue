<template>
  <div class="main" style="{marginBottom: '220px'}">
    <Header />
    <div class="p-3 container">
      <SearchBox catagory='people'/>
      <List catagory='people'/>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import SearchBox from '@/components/SearchBox.vue';
import List from '@/components/List.vue';

@Component({
  components: {
    Header,
    Footer,
    SearchBox,
    List,
  },
})
export default class People extends Vue {
  constructor() {
    super();
    this.$store.dispatch('loadPeople');
  }
}
</script>
