import React, {
  Component
} from 'react';

import axios from 'axios';

import Header from '../components/header.js';
import Footer from '../components/footer.js';

function formatDate(date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

class Modify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      origTitle: this.props.match.params.title,
      title: this.props.match.params.title,
      authors: [''],
      publisher: '',
      printer: '',
      date: '0001-01-01',
      description: '',
      owners: [],
      cost: 0,
      acquired: '0001-01-01',
      source: '',
      type: 'BOOK',
      status: '',
      currency: '$',
      appraisalValue: 0,
      appraisalCurrency: '$',
      reference: '',
      transcription: '',
      id: null,
      rates: null
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handlePublisher = this.handlePublisher.bind(this);
    this.handlePrinter = this.handlePrinter.bind(this);
    this.handleSource = this.handleSource.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
    this.handleCost = this.handleCost.bind(this);
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
    this.convert = this.convert.bind(this);
    this.handleAppraisal = this.handleAppraisal.bind(this);
    this.handleReference = this.handleReference.bind(this);
    this.handleTranscription = this.handleTranscription.bind(this);
    this.setAppraisal = this.setAppraisal.bind(this);
  }

  componentDidMount() {
    axios.get('/api/users/loggedin').then(res => {
      this.setState(res.data);
    });
    axios.get('/api/entry/' + this.state.title).then(res => {
      this.setState({
        title: res.data.title,
        authors: res.data.author,
        cost: (res.data.cost ? res.data.cost : 0),
        acquired: (res.data.acquired ? formatDate(new Date(res.data.acquired)) : '0000-00-00'),
        date: (res.data.date ? formatDate(new Date(res.data.date)) : '0000-00-00'),
        description: res.data.description,
        owners: res.data.owners,
        printer: res.data.printer,
        publisher: res.data.publisher,
        source: (res.data.source ? res.data.source : ''),
        titleTranscription: res.data.titleTranscription,
        reference: res.data.reference,
        appraisalValue: (res.data.appraisalValue ? res.data.appraisalValue : 0),
        type: res.data.type,
        id: res.data.id
      });
    });
  }

  handleSubmit() {
    this.convert(this.state.cost, this.state.currency, this.state.acquired, false, () => {
      this.convert(this.state.appraisalValue, this.state.appraisalCurrency, null, true, () => {
        var formData = new FormData();
        const files = [...this.uploadImage.files];
        files.forEach((file, id) => {
          formData.append(id, files[id]);
        });
        for (var key in this.state) {
          if (key === 'owners') {
            formData.append(key, JSON.stringify(this.state[key]));
          } else {
            formData.append(key, this.state[key]);
          }
        }
        axios.post('/api/modify/' + this.state.id, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          if ('error' in res.data) this.setState({
            status: res.data.error
          });
          else this.setState({
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
  handlePublisher(event) {
    this.setState({
      publisher: event.target.value
    });
  }
  handlePrinter(event) {
    this.setState({
      printer: event.target.value
    });
  }
  handleSource(event) {
    this.setState({
      source: event.target.value
    });
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
      transcription: event.target.value
    });
  }
  handleAppraisal(event) {
    this.setState({
      appraisalValue: event.target.value
    });
  }
  setAppraisal = (currency) => () => {
    this.setState({
      appraisalCurrency: currency
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


  renderStatus() {
    if (this.state.status === '') {
      return (<div></div>);
    } else if (this.state.status === 'SUCCESS') {
      return (
        <div className="alert alert-success" role="alert">
          Modified entry
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
    const owners = this.state.owners.map((owner, idx) => {
      return (
        <div className="form-row" key={idx}>
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
            <h1 className="h3 mb-3 font-width-normal">Modify Entry <a style={{color: 'inherit'}} href={"/entry/" + this.state.id}>{this.state.title}</a></h1>
            {labeler("Title", <input className="form-control" placeholder="Title" id="title" aria-label="Name" onChange={this.handleName} value={this.state.title}/>)}
            {labeler("Authors",
              <div className="form-group">
                {authors}
                <div className="p-2">
                  <button id="add-author" className="btn btn-outline-success" type="button" onClick={this.handleAuthorAdd}>Add Author</button>
                </div>
              </div>
            )}
            {labeler("Publisher", <input className="form-control" placeholder="Publisher" onChange={this.handlePublisher} value={this.state.publisher}/>)}
            {labeler("Date", <input className="form-control" type="date" id="date" onChange={this.handleDate} value={this.state.date}/>)}
            {labeler("Printer", <input className="form-control" placeholder="Printer" onChange={this.handlePrinter} value={this.state.printer}/>)}
            {labeler("Description", <textarea className="form-control" placeholder="Description" onChange={this.handleDescription} value={this.state.description}/>)}
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
            {labeler("Title Transcription", <textarea className="form-control" placeholder="Transcription" onChange={this.handleTranscription} value={this.state.transcription}/>)}
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
            {labeler("Images", <input type="file" className="form-control-file" ref={(ref) => {this.uploadImage = ref; }} multiple/>)}
            <button className="btn btn-outline-primary btn-lg btn-block" type="button" aria-label="Submit" onClick={this.handleSubmit}>Submit</button>
          </form>
          {this.renderStatus()}
        </div>
        <Footer loggedIn={this.state.loggedIn}/>
      </div>
    );
  }
}

export default Modify;
