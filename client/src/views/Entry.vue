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
                <dt class="col-sm-3" v-if="entry.authors.length !== 0">Authors</dt>
                <dd class="col-sm-9" v-if="entry.authors.length !== 0">
                  <router-link class="text-primary mx-1" :to="'/people/' + author" :key="author" v-for="author in entry.authors">
                    {{ author }}
                  </router-link>
                </dd>
                <dt class="col-sm-3" v-if="entry.publishers.length !== 0">Publishers</dt>
                <dd class="col-sm-9" v-if="entry.publishers.length !== 0">
                  <router-link class="text-primary mx-1" :to="'/people/' + publisher" :key="publisher" v-for="publisher in entry.publishers">
                    {{ publisher }}
                  </router-link>
                </dd>
                <dt class="col-sm-3" v-if="entry.printers.length !== 0">Printers</dt>
                <dd class="col-sm-9" v-if="entry.printers.length !== 0">
                  <router-link class="text-primary mx-1" :to="'/people/' + printer" :key="printer" v-for="printer in entry.printers">
                    {{ printer }}
                  </router-link>
                </dd>
                <dt class="col-sm-3" v-if="entry.editors.length !== 0">Editors</dt>
                <dd class="col-sm-9" v-if="entry.editors.length !== 0">
                  <router-link class="text-primary mx-1" :to="'/people/' + editor" :key="editor" v-for="editor in entry.editors">
                    {{ editor }}
                  </router-link>
                </dd>
                <dt class="col-sm-3" v-if="entry.date !== 0">Date</dt>
                <dd class="col-sm-9" v-if="entry.date !== 0">{{ entry.date }}</dd>
                <dt class="col-sm-3" v-if="entry.titleTranscription !== ''">Title Transcription</dt>
                <dd class="col-sm-9" v-if="entry.titleTranscription !== ''"><p v-html="markdown(entry.titleTranscription)"></p></dd>
                <dt class="col-sm-3" v-if="entry.reference !== ''">Reference</dt>
                <dd class="col-sm-9" v-if="entry.reference !== ''"><p v-html="markdown(entry.reference)"></p></dd>
                <dt class="col-sm-3" v-if="entry.binding !== ''">Binding</dt>
                <dd class="col-sm-9" v-if="entry.binding !== ''"><p v-html="markdown(entry.binding)"></p></dd>
                <dt class="col-sm-3" v-if="entry.description !== ''">Description</dt>
                <dd class="col-sm-9" v-if="entry.description !== ''"><p v-html="markdown(entry.description)"></p></dd>
                <dt class="col-sm-3" v-if="entry.owners.length !== 0">Owners</dt>
                <dd class="col-sm-9" v-if="entry.owners.length !== 0">
                  <dl class="row" :key="owner.name" v-for="owner in entry.owners">
                    <dt class="col-sm-3"><router-link class="text-primary mx-1" :to="'/peolpe/' + owner">{{ owner.name }}</router-link></dt>
                    <dd class="col-sm-9"><p v-html="markdown(owner.description)"></p></dd>
                  </dl>
                </dd>
              </dl>
              <dl class="row" v-if="$store.state.user !== null">
                <dt class="col-sm-3" v-if="entry.source !== ''">Source</dt>
                <dd class="col-sm-9" v-if="entry.source !== ''">{{ entry.source }}</dd>
                <dt class="col-sm-3" v-if="entry.acquired !== null">Acquired</dt>
                <dd class="col-sm-9" v-if="entry.acquired !== null">{{ displayDate(entry.acquired) }}</dd>
                <dt class="col-sm-3" v-if="entry.cost !== 0">Cost</dt>
                <dd class="col-sm-9" v-if="entry.cost !== 0">$ {{ entry.cost }}</dd>
                <dt class="col-sm-3" v-if="entry.appraisalValue !== 0">Appraisal</dt>
                <dd class="col-sm-9" v-if="entry.appraisalValue !== 0">$ {{ entry.appraisalValue }}</dd>
              </dl>
              <div v-if="$store.state.user !== null">
                <button typ="button" class="btn btn-outline-danger col-sm-2 mx-1" v-on:click="deleteEntry()">Delete</button>
                <router-link class="btn btn-outline-warning col-sm-2 mx-1" :to="'/modify/' + id">Modify</router-link>
              </div>
            </div>
          </div>
          <div class="card-body" v-else>
            <h2 class="card-title">Loading...</h2>
            <p class="text-muted">{{ id }}</p>
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
import showdown from 'showdown';

@Component({
  components: {
    Header,
    Footer,
  },
})
export default class Entry extends Vue {
  @Prop() private id: any;
  private entry: any = null;
  private mounted() {
    this.$store.watch((state) => state.entries, () => {
      for (const entry of this.$store.state.entries) {
        if (entry.id === this.id) {
          this.entry = entry;
        }
      }
    });
    for (const entry of this.$store.state.entries) {
      if (entry.id === this.id) {
        this.entry = entry;
      }
    }
  }
  private displayDate(date: any): string {
    return date.substring(0, 10);
  }
  private markdown(source: string): any {
    const converter = new showdown.Converter();
    return converter.makeHtml(source);
  }
  private deleteEntry(): any {
    this.$store.dispatch('deleteEntry', this.id);
    this.$router.push('/');
  }
}
</script>
