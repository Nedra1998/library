<template>
  <div class="main" style="{marginBottom: '220px'}">
    <Header />
      <div class="p-3 container">
        <div class="card">
          <div class="card-body" v-if="entry !== null">
            <h2 class="card-title">{{ entry.title }}</h2>
            <p class="text-muted">
              <router-link class="text-muted mx-1" :to="'/people/' + author" :key="author" v-for="author in entry.authors">
                {{ author }}
              </router-link>
            </p>
            <div class="container">
              <div v-html="markdown(entry.description)"></div>
              <dl class="row">
                <dt class="col-sm-3" v-if="entry.title !== ''">Title</dt>
                <dd class="col-sm-9" v-if="entry.title !== ''"><p v-html="markdown(entry.title)"></p></dd>
                <dt class="col-sm-3" v-if="entry.authors !== []">Authors</dt>
                <dd class="col-sm-9" v-if="entry.authors !== []">
                  <router-link class="text-primary mx-1" :to="'/people/' + author" :key="author" v-for="author in entry.authors">
                    {{ author }}
                  </router-link>
                </dd>
                <dt class="col-sm-3" v-if="entry.publishers !== []">Publishers</dt>
                <dd class="col-sm-9" v-if="entry.publishers !== []">
                  <router-link class="text-primary mx-1" :to="'/people/' + publisher" :key="publisher" v-for="publisher in entry.publishers">
                    {{ publisher }}
                  </router-link>
                </dd>
              </dl>
            </div>
          </div>
          <div class="card-body" v-else>
            <h2 class="card-title">Loading</h2>
          </div>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Header from '@/components/Header.vue';
import showdown from 'showdown';

@Component({
  components: {
    Header,
  },
})
export default class Entry extends Vue {
  @Prop() private id: any;
  private entry: any = null;
  constructor() {
    super();
    this.$store.watch((state) => state.entries, () => {
      for (let entry of this.$store.state.entries) {
        if (entry.id === this.id) {
          this.entry = entry;
        }
      }
    });
    for (let entry of this.$store.state.entries) {
      if (entry.id === this.id) {
        this.entry = entry;
      }
    }
  }
  private markdown(source: string): any {
    let converter = new showdown.Converter();
    return converter.makeHtml(source);
  }
}
</script>
