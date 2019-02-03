<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
    <router-link class="navbar-brand" to="/">Rasmussen Collection</router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText">
      <span class="navbar-toggler-icon" />
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/" v-bind:class="{ 'active': $route.path === '/' }">
            Home
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/people" v-bind:class="{ 'active': $route.path === '/people' }">
            People
          </router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/tags" v-bind:class="{ 'active': $route.path === '/tag' }">
            Tags 
          </router-link>
        </li>
        <li class="nav-item" v-if="$store.state.user !== null">
          <router-link class="nav-link" to="/create" v-bind:class="{ 'active': $route.path === '/create' }">
            Create
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Header extends Vue {}
</script>
