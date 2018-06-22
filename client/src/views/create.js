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
      currency: '$'
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
  }

  componentDidMount() {
    axios.get('/users/loggedin').then(res => {
      this.setState(res.data);
    });
  }

  handleSubmit() {
    this.convert(this.state.cost, this.state.currency, () => {
      axios.post('/', this.state).then(res => {
        if('error' in res.data) this.setState({status: res.data.error});
        else this.setState({ loggedIn: false, title: '', authors: [''], publisher: '', printer: '', date: '0001-01-01', description: '', owners: [], cost: 0, acquired: '0001-01-01', source: '', type: 'BOOK', status: 'SUCCESS' });
      });
    });
  }

  convert(value, currency, callback){
    if (currency === '$'){
      callback(value);
    }else if(currency === '€'){
      axios.get('http://free.currencyconverterapi.com/api/v5/convert?q=EUR_USD&compact=y').then(res => {
        value = parseFloat(value) * parseFloat(res.data['EUR_USD'].val)
        this.setState({cost: Math.round(value)}, callback);
      });
    }else if(currency === '£'){
      axios.get('http://free.currencyconverterapi.com/api/v5/convert?q=GBP_USD&compact=y').then(res => {
        value = parseFloat(value) * parseFloat(res.data['GBP_USD'].val)
        this.setState({cost: Math.round(value)}, callback);
      });
    }else{
      callback(value);
    }
  }

  handleName(event) {
    this.setState({title: event.target.value});
  }
  handlePublisher(event){
    this.setState({publisher: event.target.value});
  }
  handlePrinter(event){
    this.setState({printer: event.target.value});
  }
  handleSource(event){
    this.setState({source: event.target.value});
  }
  handleDescription(event){
    this.setState({description: event.target.value});
  }
  handleCost(event){
    this.setState({cost: event.target.value});
  }
  handleDate(event){
    this.setState({date: event.target.value});
  }
  handleAcquired(event){
    this.setState({acquired: event.target.value});
  }
  handleTypeChange(event){
    this.setState({type: event.target.value});
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
      return {...owner, name:evt.target.value};
    });
    this.setState({
      owners:newOwners 
    });
  }
  handleOwnerDescriptionChange = (idx) => (evt) => {
    const newOwners = this.state.owners.map((owner, id) => {
      if (id !== idx) return owner;
      return {...owner, description:evt.target.value};
    });
    this.setState({
      owners:newOwners 
    });
  }

  handleOwnerAdd = () => {
    this.setState({
      owners: this.state.owners.concat([{'name': '', 'description': ''}])
    });
  }
  handleOwnerRemove = (idx) => () => {
    this.setState({
      owners: this.state.owners.filter((a, id) => idx !== id)
    });
  }

  setCurrency = (currency) => () =>{
    this.setState({currency: currency});
  }


  renderStatus(){
    if(this.state.status === ''){
      return (<div></div>);
    }else if(this.state.status === 'SUCCESS'){
      return(
        <div className="alert alert-success" role="alert">
          Created new entry
        </div>
      );
    }else{
      return(
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
        <div className="form-row">
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
                <div class="input-group-prepend">
                  <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{this.state.currency}</button>
                  <div class="dropdown-menu">
                    <button type="button" className="dropdown-item" onClick={this.setCurrency('$')}>$</button>
                    <button type="button" className="dropdown-item" onClick={this.setCurrency("£")}>&pound;</button>
                    <button type="button" className="dropdown-item" onClick={this.setCurrency("€")}>&euro;</button>
                  </div>
                </div>
                <input className="form-control currency" type="number" data-number-to-fixed="2" data-number-stepfactor="100" onChange={this.handleCost} value={this.state.cost}/>
              </div>
            </div>
            {labeler("Type", <select class="form-control" onChange={this.handleTypeChange} >
              <option>BOOK</option>
            </select>)}
            <button className="btn btn-outline-primary btn-lg btn-block" type="button" aria-label="Submit" onClick={this.handleSubmit}>Submit</button>
          </form>
          {this.renderStatus()}
        </div>
        <Footer loggedIn={this.state.loggedIn}/>
      </div>
    );
  }
}

export default Create;
