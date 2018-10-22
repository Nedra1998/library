import React, {
  Component
} from 'react';

import axios from 'axios';

import Header from '../components/header.js';
import Footer from '../components/footer.js';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      title: '',
      authors: [''],
      publisher: [''],
      printer: [''],
      editor: [''],
      date: 0,
      binding: '',
      description: '',
      owners: [],
      cost: 0,
      acquired: '0001-01-01',
      source: '',
      appraisalValue: 0,
      appraisalCurrency: '$',
      reference: '',
      titleTranscription: '',
      type: 'BOOK',
      status: '',
      currency: '$',
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handlePublisherAdd = this.handlePublisherAdd.bind(this);
    this.handlePublisherChange = this.handlePublisherChange.bind(this);
    this.handlePublisherRemove = this.handlePublisherRemove.bind(this);
    this.handlePrinterAdd = this.handlePrinterAdd.bind(this);
    this.handlePrinterChange = this.handlePrinterChange.bind(this);
    this.handlePrinterRemove = this.handlePrinterRemove.bind(this);
    this.handleEditorAdd = this.handleEditorAdd.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleEditorRemove = this.handleEditorRemove.bind(this);
    this.handleSource = this.handleSource.bind(this);
    this.handleReference = this.handleReference.bind(this);
    this.handleTranscription = this.handleTranscription.bind(this);
    this.handleBinding = this.handleBinding.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
    this.handleCost = this.handleCost.bind(this);
    this.handleAppraisal = this.handleAppraisal.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.handleAcquired = this.handleAcquired.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleAuthorAdd = this.handleAuthorAdd.bind(this);
    this.handleAuthorChange = this.handleAuthorChange.bind(this);
    this.handleAuthorRemove = this.handleAuthorRemove.bind(this);
    this.handleOwnerAdd = this.handleOwnerAdd.bind(this);
    this.handleOwnerNameChange = this.handleOwnerNameChange.bind(this);
    this.handleOwnerDescriptionChange = this.handleOwnerDescriptionChange.bind(this);
    this.handleOwnerRemove = this.handleOwnerRemove.bind(this);
    this.renderStatus = this.renderStatus.bind(this);
    this.setCurrency = this.setCurrency.bind(this);
    this.setAppraisal = this.setAppraisal.bind(this);
    this.convert = this.convert.bind(this);
  }

  componentDidMount() {
    axios.get('/api/users/loggedin').then(res => {
      this.setState(res.data);
    });
  }

  handleSubmit(ev) {
    ev.preventDefault();
    this.convert(this.state.cost, this.state.currency, this.state.acquired, false, () => {
      this.convert(this.state.appraisalValue, this.state.appraisalCurrency, null, true, () => {
        var formData = new FormData();
        const files = [...this.uploadImage.files];
        files.forEach((file, id) => {
          formData.append(id, files[id]);
        });
        for (var key in this.state) {
          formData.append(key, this.state[key]);
        }
        axios.post('/api/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          if ('error' in res.data) this.setState({
            status: res.data.error
          });
          else this.setState({
            loggedIn: false,
            title: '',
            authors: [''],
            publisher: [''],
            printer: [''],
            editor: [''],
            date: 0,
            description: '',
            owners: [],
            cost: 0,
            acquired: '0001-01-01',
            source: '',
            type: 'BOOK',
            status: 'SUCCESS'
          });
        });
      });
    });
  }

  convert(value, currency, date, tf, callback) {
    if (!date || date === '0001-01-01' || date === null) {
      date = 'latest';
    }
    if (currency === '$') {
      callback(value);
    } else if (currency === '€') {
      axios.get('http://data.fixer.io/api/' + date + '?access_key=ca7f16514bdc7b89d06fe9684fe3e541&base=EUR&symbols=USD').then(res => {
        value = parseFloat(value) * parseFloat(res.data['rates']['USD'])
        if (tf === false) {
          this.setState({
            cost: Math.round(value)
          }, callback);
        } else {
          this.setState({
            appraisalValue: Math.round(value)
          }, callback);
        }
      });
    } else if (currency === '£') {
      axios.get('http://data.fixer.io/api/' + date + '?access_key=ca7f16514bdc7b89d06fe9684fe3e541&base=EUR&symbols=USD').then(res => {
        value = parseFloat(value) * parseFloat(res.data['rates']['USD'])
        if (tf === false) {
          this.setState({
            cost: Math.round(value)
          }, callback);
        } else {
          this.setState({
            appraisalValue: Math.round(value)
          }, callback);
        }
      });
    } else {
      callback(value);
    }
  }

  handleName(event) {
    this.setState({
      title: event.target.value
    });
  }
  handlePublisherChange = (idx) => (evt) => {
    const newPublisher = this.state.publisher.map((author, id) => {
      if (id !== idx) return author;
      return evt.target.value;
    });
    this.setState({
      publisher: newPublisher
    });
  }

  handlePublisherAdd = () => {
    this.setState({
      publisher: this.state.publisher.concat([''])
    });
  }
  handlePublisherRemove = (idx) => () => {
    this.setState({
      publisher: this.state.publisher.filter((a, id) => idx !== id)
    });
  }
  handlePrinterChange = (idx) => (evt) => {
    const newPrinter = this.state.printer.map((author, id) => {
      if (id !== idx) return author;
      return evt.target.value;
    });
    this.setState({
      printer: newPrinter
    });
  }

  handlePrinterAdd = () => {
    this.setState({
      printer: this.state.printer.concat([''])
    });
  }
  handlePrinterRemove = (idx) => () => {
    this.setState({
      printer: this.state.printer.filter((a, id) => idx !== id)
    });
  }
  handleEditorChange = (idx) => (evt) => {
    const newEditor = this.state.editor.map((author, id) => {
      if (id !== idx) return author;
      return evt.target.value;
    });
    this.setState({
      editor: newEditor
    });
  }

  handleEditorAdd = () => {
    this.setState({
      editor: this.state.editor.concat([''])
    });
  }
  handleEditorRemove = (idx) => () => {
    this.setState({
      editor: this.state.editor.filter((a, id) => idx !== id)
    });
  }
  handleSource(event) {
    this.setState({
      source: event.target.value
    });
  }
  handleBinding(event) {
    this.setState({binding:event.target.value});
  }
  handleDescription(event) {
    this.setState({
      description: event.target.value
    });
  }
  handleCost(event) {
    this.setState({
      cost: event.target.value
    });
  }
  handleAppraisal(event) {
    this.setState({
      appraisalValue: event.target.value
    });
  }
  handleDate(event) {
    this.setState({
      date: event.target.value
    });
  }
  handleAcquired(event) {
    this.setState({
      acquired: event.target.value
    });
  }
  handleTypeChange(event) {
    this.setState({
      type: event.target.value
    });
  }
  handleReference(event) {
    this.setState({
      reference: event.target.value
    });
  }
  handleTranscription(event) {
    this.setState({
      titleTranscription: event.target.value
    });
  }

  handleAuthorChange = (idx) => (evt) => {
    const newAuthor = this.state.authors.map((author, id) => {
      if (id !== idx) return author;
      return evt.target.value;
    });
    this.setState({
      authors: newAuthor
    });
  }

  handleAuthorAdd = () => {
    this.setState({
      authors: this.state.authors.concat([''])
    });
  }
  handleAuthorRemove = (idx) => () => {
    this.setState({
      authors: this.state.authors.filter((a, id) => idx !== id)
    });
  }
  handleOwnerNameChange = (idx) => (evt) => {
    const newOwners = this.state.owners.map((owner, id) => {
      if (id !== idx) return owner;
      return { ...owner,
        name: evt.target.value
      };
    });
    this.setState({
      owners: newOwners
    });
  }
  handleOwnerDescriptionChange = (idx) => (evt) => {
    const newOwners = this.state.owners.map((owner, id) => {
      if (id !== idx) return owner;
      return { ...owner,
        description: evt.target.value
      };
    });
    this.setState({
      owners: newOwners
    });
  }

  handleOwnerAdd = () => {
    this.setState({
      owners: this.state.owners.concat([{
        'name': '',
        'description': ''
      }])
    });
  }
  handleOwnerRemove = (idx) => () => {
    this.setState({
      owners: this.state.owners.filter((a, id) => idx !== id)
    });
  }

  setCurrency = (currency) => () => {
    this.setState({
      currency: currency
    });
  }
  setAppraisal = (currency) => () => {
    this.setState({
      appraisalCurrency: currency
    });
  }


  renderStatus() {
    if (this.state.status === '') {
      return (<div></div>);
    } else if (this.state.status === 'SUCCESS') {
      return (
        <div className="alert alert-success" role="alert">
          Created new entry
        </div>
      );
    } else {
      return (
        <div className="alert alert-danger" role="alert">
          {this.state.status}
        </div>
      );
    }
  }

  render() {
    const labeler = (label, obj) => {
      return (
        <div className="form-group row">
          <label className="col-sm-2 col-form-label">{label}</label>
          <div className="col-sm-10">
            {obj}
          </div>
        </div>
      );
    }
    const authors = this.state.authors.map((author, idx) => {
      return (
        <div className="form-row" key={this.state.authors.indexOf(author)}>
          <div className="col">
            <input className="form-control" placeholder={`Author #${idx+1}`} value={author} onChange={this.handleAuthorChange(idx)} />
          </div>
          <div className="col">
            <button id="delete-author" className="btn btn-outline-danger" type="button" onClick={this.handleAuthorRemove(idx)}>-</button>
          </div>
        </div>
      );
    });
    const publishers = this.state.publisher.map((author, idx) => {
      return (
        <div className="form-row" key={this.state.publisher.indexOf(author)}>
          <div className="col">
            <input className="form-control" placeholder={`Publisher #${idx+1}`} value={author} onChange={this.handlePublisherChange(idx)} />
          </div>
          <div className="col">
            <button id="delete-publisher" className="btn btn-outline-danger" type="button" onClick={this.handlePublisherRemove(idx)}>-</button>
          </div>
        </div>
      );
    });
    const printers = this.state.printer.map((author, idx) => {
      return (
        <div className="form-row" key={this.state.printer.indexOf(author)}>
          <div className="col">
            <input className="form-control" placeholder={`Printer #${idx+1}`} value={author} onChange={this.handlePrinterChange(idx)} />
          </div>
          <div className="col">
            <button id="delete-printer" className="btn btn-outline-danger" type="button" onClick={this.handlePrinterRemove(idx)}>-</button>
          </div>
        </div>
      );
    });
    const editors = this.state.editor.map((author, idx) => {
      return (
        <div className="form-row" key={this.state.editor.indexOf(author)}>
          <div className="col">
            <input className="form-control" placeholder={`Editor #${idx+1}`} value={author} onChange={this.handleEditorChange(idx)} />
          </div>
          <div className="col">
            <button id="delete-editor" className="btn btn-outline-danger" type="button" onClick={this.handleEditorRemove(idx)}>-</button>
          </div>
        </div>
      );
    });
    const owners = this.state.owners.map((owner, idx) => {
      return (
        <div className="form-row">
          <div className="col">
            <input className="form-control" placeholder={`Owner #${idx+1}`} value={owner.name} onChange={this.handleOwnerNameChange(idx)} />
          </div>
          <div className="col">
            <input className="form-control" placeholder={`Description#${idx+1}`} value={owner.description} onChange={this.handleOwnerDescriptionChange(idx)} />
          </div>
          <div className="col">
            <button id="delete-author" className="btn btn-outline-danger" type="button" onClick={this.handleOwnerRemove(idx)}>-</button>
          </div>
        </div>
      );
    });
    return (
      <div className="main" style={{marginBottom: '220px'}}>
        <Header src="home" loggedIn={this.state.loggedIn}/>
        <div className="p-3 container">
          <form onSubmit={this.handleSubmit} action='#'>
            <h1 className="h3 mb-3 font-width-normal">Create New Entry</h1>
            {labeler("Title", <input className="form-control" placeholder="Title" id="title" aria-label="Name" onChange={this.handleName} value={this.state.title}/>)}
            {labeler("Authors",
              <div className="form-group">
                {authors}
                <div className="p-2">
                  <button id="add-author" className="btn btn-outline-success" type="button" onClick={this.handleAuthorAdd}>Add Author</button>
                </div>
              </div>
            )}
            {labeler("Publisher", <div className="form-group">
              {publishers}
              <div className="p-2">
                <button id="add-publisher" className="btn btn-outline-success" type="button" onClick={this.handlePublisherAdd}>Add Publisher</button>
              </div>
            </div>)}
            {labeler("Date", <input className="form-control" type="number" id="date" onChange={this.handleDate} value={this.state.date}/>)}
            {labeler("Printer", <div className="form-group">
              {printers}
              <div className="p-2">
                <button id="add-printer" className="btn btn-outline-success" type="button" onClick={this.handlePrinterAdd}>Add Printer</button>
              </div>
            </div>)}
            {labeler("Editor", <div className="form-group">
              {editors}
              <div className="p-2">
                <button id="add-editor" className="btn btn-outline-success" type="button" onClick={this.handleEditorAdd}>Add Editor</button>
              </div>
            </div>)}
            {labeler("Description", <textarea className="form-control" placeholder="Description" onChange={this.handleDescription} value={this.state.description}/>)}
            {labeler("Binding", <textarea className="form-control" placeholder="Binding" onChange={this.handleBinding} value={this.state.binding}/>)}
            {labeler("Owners",
              <div className="form-group">
                {owners}
                <div className="p-2">
                  <button id="add-owner" className="btn btn-outline-success" type="button" onClick={this.handleOwnerAdd}>Add Owner</button>
                </div>
              </div>
            )}
            {labeler("Source", <input className="form-control" placeholder="Source" onChange={this.handleSource} value={this.state.source}/>)}
            {labeler("Acquired", <input className="form-control" type="date" onChange={this.handleAcquired} value={this.state.acquired}/>)}
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">Cost</label>
              <div className="input-group col-sm-10">
                <div className="input-group-prepend">
                  <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.currency}</button>
                  <div className="dropdown-menu">
                    <button type="button" className="dropdown-item" onClick={this.setCurrency('$')}>$</button>
                    <button type="button" className="dropdown-item" onClick={this.setCurrency("£")}>&pound;</button>
                    <button type="button" className="dropdown-item" onClick={this.setCurrency("€")}>&euro;</button>
                  </div>
                </div>
                <input className="form-control currency" type="number" data-number-to-fixed="2" data-number-stepfactor="100" onChange={this.handleCost} value={this.state.cost}/>
              </div>
            </div>
            {labeler("Title Transcription", <textarea className="form-control" placeholder="Transcription" onChange={this.handleTranscription} value={this.state.titleTranscription}/>)}
            {labeler("References", <textarea className="form-control" placeholder="References" onChange={this.handleReference} value={this.state.reference}/>)}
            <div className="form-group row">
              <label className="col-sm-2 col-form-label">Appraisal Value</label>
              <div className="input-group col-sm-10">
                <div className="input-group-prepend">
                  <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.appraisalCurrency}</button>
                  <div className="dropdown-menu">
                    <button type="button" className="dropdown-item" onClick={this.setAppraisal('$')}>$</button>
                    <button type="button" className="dropdown-item" onClick={this.setAppraisal("£")}>&pound;</button>
                    <button type="button" className="dropdown-item" onClick={this.setAppraisal("€")}>&euro;</button>
                  </div>
                </div>
                <input className="form-control currency" type="number" data-number-to-fixed="2" data-number-stepfactor="100" onChange={this.handleAppraisal} value={this.state.appraisalValue}/>
              </div>
            </div>
            {labeler("Type", <select className="form-control" onChange={this.handleTypeChange} >
              <option>BOOK</option>
            </select>)}
            {labeler("Images", <input type="file" className="form-control-file" id="images" ref={(ref) => {this.uploadImage = ref; }} multiple/>)}
            <button className="btn btn-outline-primary btn-lg btn-block" aria-label="Submit">Submit</button>
          </form>
          {this.renderStatus()}
        </div>
        <Footer loggedIn={this.state.loggedIn}/>
      </div>
    );
  }
}

export default Create;
