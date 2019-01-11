<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  constructor() {
    super();
    this.$store.dispatch('checkUser');
    this.$store.dispatch('loadEntries');
    this.$store.dispatch('loadPeople');
  }
}
</script>
