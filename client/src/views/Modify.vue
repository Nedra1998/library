<template>
  <div class="main" style="{marginBottom: '220px'}">
    <Header />
      <div class="p-3 container">
        <form>
          <h1 clas="h3 mb-3 font-width-normal">Modify Entry</h1>
          <div class="form-group row" id="title">
            <label class="col-sm-2 col-form-label">Title</label>
            <div class="col-sm-10">
              <input class="form-control" v-model="entry.title" />
            </div>
          </div>
          <div class="form-group row" id="authors">
            <label class="col-sm-2 col-form-label">Authors</label>
            <div class="col-sm-10">
              <div class="form-row" :key="author+id.toString()" v-for="(author, id) in entry.authors">
                <div class="col-sm-11">
                  <input class="form-control" :placeholder="'Author ' + (id + 1).toString()" v-model.lazy="entry.authors[id]" />
                </div>
                <div class="col-sm-1">
                  <button id="delete-author" class="btn btn-outline-danger" type=button v-on:click="entry.authors.splice(id,1)">-</button>
                </div>
              </div>
              <div class="p-2">
                <button id="add-author" class="btn btn-outline-success" type="button" v-on:click="entry.authors.push('')">Add Author</button>
              </div>
            </div>
          </div>
          <div class="form-group row" id="publishers">
            <label class="col-sm-2 col-form-label">Publishers</label>
            <div class="col-sm-10">
              <div class="form-row" :key="publisher+id.toString()" v-for="(publisher, id) in entry.publishers">
                <div class="col-sm-11">
                  <input class="form-control" :placeholder="'Publisher ' + (id + 1).toString()" v-model.lazy="entry.publishers[id]" />
                </div>
                <div class="col-sm-1">
                  <button id="delete-publisher" class="btn btn-outline-danger" type=button v-on:click="entry.publishers.splice(id,1)">-</button>
                </div>
              </div>
              <div class="p-2">
                <button id="add-publisher" class="btn btn-outline-success" type="button" v-on:click="entry.publishers.push('')">Add Publisher</button>
              </div>
            </div>
          </div>
          <div class="form-group row" id="printers">
            <label class="col-sm-2 col-form-label">Printers</label>
            <div class="col-sm-10">
              <div class="form-row" :key="printer+id.toString()" v-for="(printer, id) in entry.printers">
                <div class="col-sm-11">
                  <input class="form-control" :placeholder="'Printer ' + (id + 1).toString()" v-model.lazy="entry.printers[id]" />
                </div>
                <div class="col-sm-1">
                  <button id="delete-printer" class="btn btn-outline-danger" type=button v-on:click="entry.printers.splice(id,1)">-</button>
                </div>
              </div>
              <div class="p-2">
                <button id="add-printer" class="btn btn-outline-success" type="button" v-on:click="entry.printers.push('')">Add Printer</button>
              </div>
            </div>
          </div>
          <div class="form-group row" id="editors">
            <label class="col-sm-2 col-form-label">Editors</label>
            <div class="col-sm-10">
              <div class="form-row" :key="editor+id.toString()" v-for="(editor, id) in entry.editors">
                <div class="col-sm-11">
                  <input class="form-control" :placeholder="'Editor ' + (id + 1).toString()" v-model.lazy="entry.editors[id]" />
                </div>
                <div class="col-sm-1">
                  <button id="delete-editor" class="btn btn-outline-danger" type=button v-on:click="entry.editors.splice(id,1)">-</button>
                </div>
              </div>
              <div class="p-2">
                <button id="add-editor" class="btn btn-outline-success" type="button" v-on:click="entry.editors.push('')">Add Editor</button>
              </div>
            </div>
          </div>
          <div class="form-group row" id="date">
            <label class="col-sm-2 col-form-label">Date</label>
            <div class="col-sm-10">
              <input type="number" class="form-control" v-model="entry.date" />
            </div>
          </div>
          <div class="form-group row" id="transcription">
            <label class="col-sm-2 col-form-label">Title Transcription</label>
            <div class="col-sm-10">
              <textarea class="form-control" v-model="entry.titleTranscription" />
            </div>
          </div>
          <div class="form-group row" id="reference">
            <label class="col-sm-2 col-form-label">Reference</label>
            <div class="col-sm-10">
              <input class="form-control" v-model="entry.reference" />
            </div>
          </div>
          <div class="form-group row" id="binding">
            <label class="col-sm-2 col-form-label">Binding</label>
            <div class="col-sm-10">
              <textarea placeholder="Binding" class="form-control" v-model="entry.binding" />
            </div>
          </div>
          <div class="form-group row" id="description">
            <label class="col-sm-2 col-form-label">Description</label>
            <div class="col-sm-10">
              <textarea placeholder="Description" class="form-control" v-model="entry.Description" />
            </div>
          </div>
          <div class="form-group row" id="owners">
            <label class="col-sm-2 col-form-label">Owners</label>
            <div class="col-sm-10">
              <div class="form-row" :key="owner.name+id.toString()" v-for="(owner, id) in entry.owners">
                <div class="col-sm-5">
                  <input class="form-control" :placeholder="'Owner ' + (id + 1).toString()" v-model.lazy="entry.owners[id].name" />
                </div>
                <div class="col-sm-6">
                  <input class="form-control" :placeholder="'Description ' + (id + 1).toString()" v-model.lazy="entry.owners[id].description" />
                </div>
                <div class="col-sm-1">
                  <button id="delete-owner" class="btn btn-outline-danger" type=button v-on:click="entry.owners.splice(id,1)">-</button>
                </div>
              </div>
              <div class="p-2">
                <button id="add-owner" class="btn btn-outline-success" type="button" v-on:click="entry.owners.push({name: '', description: ''})">Add Owner</button>
              </div>
            </div>
          </div>
          <div class="form-group row" id="source">
            <label class="col-sm-2 col-form-label">Source</label>
            <div class="col-sm-10">
              <input placeholder="Source" class="form-control" v-model="entry.source" />
            </div>
          </div>
          <div class="form-group row" id="acquired">
            <label class="col-sm-2 col-form-label">Acquired</label>
            <div class="col-sm-10">
              <input type="date" class="form-control" v-model="entry.acquired" />
            </div>
          </div>
          <div class="form-group row" id="cost">
            <label class="col-sm-2 col-form-label">Cost</label>
            <div class="input-group col-sm-10">
              <div class="input-group-prepend">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" v-if="entry.currency === 'usd'">$</button>
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" v-if="entry.currency === 'gbp'">&pound;</button>
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" v-if="entry.currency === 'eur'">&euro;</button>
                </button>
                <div class="dropdown-menu">
                  <button type="button" class="dropdown-item" v-on:click="entry.currency = 'usd'">$</button>
                  <button type="button" class="dropdown-item" v-on:click="entry.currency = 'gbp'">&pound;</button>
                  <button type="button" class="dropdown-item" v-on:click="entry.currency = 'eur'">&euro;</button>
                </div>
              </div>
              <input class="form-control currency" type="number" step="0.01" v-model="entry.cost" />
            </div>
          </div>
          <div class="form-group row" id="appraisal">
            <label class="col-sm-2 col-form-label">Appraisal</label>
            <div class="input-group col-sm-10">
              <div class="input-group-prepend">
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" v-if="entry.appraisalCurrency === 'usd'">$</button>
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" v-if="entry.appraisalCurrency === 'gbp'">&pound;</button>
                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" v-if="entry.appraisalCurrency === 'eur'">&euro;</button>
                </button>
                <div class="dropdown-menu">
                  <button type="button" class="dropdown-item" v-on:click="entry.appraisalCurrency = 'usd'">$</button>
                  <button type="button" class="dropdown-item" v-on:click="entry.appraisalCurrency = 'gbp'">&pound;</button>
                  <button type="button" class="dropdown-item" v-on:click="entry.appraisalCurrency = 'eur'">&euro;</button>
                </div>
              </div>
              <input class="form-control currency" type="number" step="0.01" v-model="entry.appraisalValue" />
            </div>
          </div>
          <button class="btn btn-success btn-lg btn-block" v-on:click="submit()" :disabled="isValid() === false">Submit</button>
        </form>
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
export default class Modify extends Vue {
  @Prop() private id: any;
  private entry: any = {};
  private mounted() {
    this.$store.watch((state) => state.entries, () => {
      for (const entry of this.$store.state.entries) {
        if (entry.id === this.id) {
          this.entry = entry;
          this.entry.currency = 'usd';
          this.entry.appraisalCurrency = 'usd';
        }
      }
    });
    for (const entry of this.$store.state.entries) {
      if (entry.id === this.id) {
        this.entry = entry;
        this.entry.currency = 'usd';
        this.entry.appraisalCurrency = 'usd';
      }
    }
    console.log(this.entry);
  }
  private isValid(): boolean {
    return true;
  }
  private submit(): any {
    this.convert(this.entry.cost, this.entry.currency, this.entry.acquired, (value: number) => {
      this.entry.cost = value;
      this.convert(this.entry.appraisalValue, this.entry.appraisalCurrency, null, (value2: number) => {
        this.entry.appraisalValue = value2;
        this.$store.dispatch('modifyEntry', [this.id, this.entry]);
        this.$router.push('/entry/' + this.id);
      });
    });
  }
  private convert(value: number, currency: string, date: any, callback: any): void {
    if (!date || date === '0001-01-01' || date === null) {
      date = 'latest';
    }
    if (currency === 'usd') {
      callback(value);
    } else if (currency === 'gbp' || currency === 'eur') {
      this.axios.get('http://data.fixer.io/api/' + date + '?access_key=ca7f16514bdc7b89d06fe9684fe3e541&base=EUR&symbols=GBP,USD').then((res: any) => {
        if (currency === 'gbp') {
          value /= res.data.rates.GBP;
          value *= res.data.rates.USD;
        } else if (currency === 'eur') {
          value *= res.data.rates.USD;
        }
        callback(value.toFixed(2));
      });
    }
  }
}
</script>
