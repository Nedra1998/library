<template>
  <footer class="footer p-3 bg-dark" style="{position: 'absolute', left:0, bottom: 0, width: '100%'< overflow: 'hidden'}">
    <div class="container">
      <ul class="list-group list-group-flush">
        <router-link class="list-group-item list-group-item-action" to="/create" v-if="$store.state.user !== null">Create</router-link>
        <router-link class="list-group-item list-group-item-action list-group-item-dark" to="/login" v-if="$store.state.user === null">Login</router-link>
        <button class="list-group-item list-group-item-action" v-if="$store.state.user !== null" v-on:click="$store.dispatch('logout')">Logout</button>
        <router-link class="list-group-item list-group-item-action" to="/createUser" v-if="$store.state.user === 'Admin'">Create User</router-link>
        <router-link class="list-group-item list-group-item-action" to="/deleteUser" v-if="$store.state.user === 'Admin'">Delete User</router-link>
      </ul>
    </div>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Footer extends Vue {}
</script>
