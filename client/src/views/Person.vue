<template>
  <div class="main" style="{marginBottom: '220px'}">
    <Header />
      <div class="p-3 container">
        <div class="card">
          <div class="card-body" v-if="entry !== null">
            <h2 class="card-title">{{ entry.name }}</h2>
            <div class="p-2 container">
              <div class="card" v-if="entry.authored.length !== 0">
                <div class="card-body">
                  <h3 class="card-title">Authored</h3>
                  <div class="list-group py-3">
                    <router-link v-bind:to="'/entry/' + ent.id" class="list-group-item list-group-item-active align-items-start" v-for="ent in entries.authored" :key="ent.id">
                      <h5><router-link v-bind:to="'people/' + author" v-for="author in ent.authors" :key="author">
                          {{author}}
                        </router-link></h5>
                        <p class="text-muted mx-1">
                          {{ ent.title }}
                        </p>
                    </router-link>
                  </div>
                </div>
              </div>
              <div class="card" v-if="entry.published.length !== 0">
                <div class="card-body">
                  <h3 class="card-title">Published</h3>
                  <div class="list-group py-3">
                    <router-link v-bind:to="'/entry/' + ent.id" class="list-group-item list-group-item-active align-items-start" v-for="ent in entries.published" :key="ent.id">
                      <h5><router-link v-bind:to="'people/' + author" v-for="author in ent.authors" :key="author">
                          {{author}}
                        </router-link></h5>
                        <p class="text-muted mx-1">
                          {{ ent.title }}
                        </p>
                    </router-link>
                  </div>
                </div>
              </div>
              <div class="card" v-if="entry.printed.length !== 0">
                <div class="card-body">
                  <h3 class="card-title">Printed</h3>
                  <div class="list-group py-3">
                    <router-link v-bind:to="'/entry/' + ent.id" class="list-group-item list-group-item-active align-items-start" v-for="ent in entries.printed" :key="ent.id">
                      <h5><router-link v-bind:to="'people/' + author" v-for="author in ent.authors" :key="author">
                          {{author}}
                        </router-link></h5>
                        <p class="text-muted mx-1">
                          {{ ent.title }}
                        </p>
                    </router-link>
                  </div>
                </div>
              </div>
              <div class="card" v-if="entry.edited.length !== 0">
                <div class="card-body">
                  <h3 class="card-title">Edited</h3>
                  <div class="list-group py-3">
                    <router-link v-bind:to="'/entry/' + ent.id" class="list-group-item list-group-item-active align-items-start" v-for="ent in entries.edited" :key="ent.id">
                      <h5><router-link v-bind:to="'people/' + author" v-for="author in ent.authors" :key="author">
                          {{author}}
                        </router-link></h5>
                        <p class="text-muted mx-1">
                          {{ ent.title }}
                        </p>
                    </router-link>
                  </div>
                </div>
              </div>
              <div class="card" v-if="entry.owned.length !== 0">
                <div class="card-body">
                  <h3 class="card-title">Owned</h3>
                  <div class="list-group py-3">
                    <router-link v-bind:to="'/entry/' + ent.id" class="list-group-item list-group-item-active align-items-start" v-for="ent in entries.owned" :key="ent.id">
                      <h5><router-link v-bind:to="'people/' + author" v-for="author in ent.authors" :key="author">
                          {{author}}
                        </router-link></h5>
                        <p class="text-muted mx-1">
                          {{ ent.title }}
                        </p>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-body" v-else>
            <h2 class="card-title">Loading...</h2>
            <p class="text-muted">{{ name }}</p>
          </div>
        </div>
      </div>
      <Footer />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

@Component({
  components: {
    Header,
    Footer,
  },
})
export default class People extends Vue {
  @Prop() private name: any;
  private entry: any = null;
  private entries: any = null;
  private mounted() {
    this.$store.watch((state) => state.people, () => {
      for (const entry of this.$store.state.people) {
        if (entry.name === this.name) {
          this.entry = entry;
        }
        this.loadEntries();
      }
    });
    for (const entry of this.$store.state.people) {
      if (entry.name === this.name) {
        this.entry = entry;
      }
    }
    this.loadEntries();
  }
  private loadEntries() {
    this.entries = {authored: [], published: [], printed: [], edited: [], owned: []};
    if (this.entry === null) { return; }
    for (const ent of this.$store.state.entries) {
      if (this.entry.authored.includes(ent.id)) {
        this.entries.authored.push(ent);
      }
      if (this.entry.published.includes(ent.id)) {
        this.entries.published.push(ent);
      }
      if (this.entry.printed.includes(ent.id)) {
        this.entries.printed.push(ent);
      }
      if (this.entry.edited.includes(ent.id)) {
        this.entries.edited.push(ent);
      }
      if (this.entry.owned.includes(ent.id)) {
        this.entries.owned.push(ent);
      }
    }
  }
}
</script>
