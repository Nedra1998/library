<template>
  <div class="main" style="{marginBottom: '220px'}">
    <Header />
    <div class="p-3 container">
      <SearchBox catagory='entry'/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from '@/components/Header.vue';
import SearchBox from '@/components/SearchBox.vue';

@Component({
  components: {
    Header,
    SearchBox,
  },
})
export default class Home extends Vue {}
</script>
