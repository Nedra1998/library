<template>
  <div class="main" style="{marginBottom: '220px'}">
    <Header />
      <div class="text-center p-5" style="{width: 100%, maxWidth: 330px, margin: auto}">
        <form>
          <h1 class="h3 mb-3 font-width-normal">Please Sign In</h1>
          <label for="inputName" class="sr-only">Name</label>
          <input type="name" id="inputName" class="form-control" placeholder="Name" required autoFocus v-model="name" />
          <label for="inputPassword" class="sr-only">Password</label>
          <input type="password" id="inputPassword" class="form-control" placeholder="Password" required v-model="password" />
          <div class="p-3">
            <button class="btn btn-lg btn-primary btn-block" type="button" v-on:click="userLogin()">Sign In</button>
          </div>
        </form>
    </div>
    <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

@Component({
  components: {
    Header,
    Footer,
  },
})
export default class Home extends Vue {
  private name: string = '';
  private password: string = '';
  private userLogin(): any {
    this.$store.dispatch('login', [this.name, this.password]);
    this.$router.push('/');
  }
}
</script>
