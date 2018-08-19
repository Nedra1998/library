import React, {
  Component
} from 'react';
import ReactMarkdown from 'react-markdown';

import axios from 'axios';

import Header from '../components/header.js';
import Footer from '../components/footer.js';
import Gallery from '../components/gallery.js';

class Entry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      title: '',
      id: this.props.match.params.title,
      author: [],
      cost: 0,
      acquired: null,
      date: null,
      description: '',
      owners: [],
      printer: '',
      publisher: '',
      source: '',
      type: 'NONE',
      titleTranscription: '',
      appraisalValue: 0,
      reference: '',
      status: '',
      files: []
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.renderData = this.renderData.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.renderStatus = this.renderStatus.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    axios.get('/api/users/loggedin').then(res => {
      this.setState(res.data);
    });
    axios.get('/api/entry/' + this.state.id).then(res => {
      this.setState({
        id : res.data.id,
        title: res.data.title,
        author: res.data.author,
        cost: (res.data.cost ? res.data.cost : null),
        acquired: (res.data.acquired ? new Date(res.data.acquired) : null),
        date: (res.data.date ? new Date(res.data.date) : null),
        description: res.data.description,
        owners: res.data.owners,
        printer: res.data.printer,
        publisher: res.data.publisher,
        source: (res.data.source ? res.data.source : null),
        titleTranscription: res.data.titleTranscription,
        reference: res.data.reference,
        appraisalValue: (res.data.appraisalValue ? res.data.appraisalValue : null),
        type: res.data.type,
        files: res.data.files
      });
    });
  }

  handleDelete() {
    axios.get('/api/delete/' + this.state.id).then(res => {
      if ('error' in res.data) {
        this.setState({
          status: res.data.error
        });
      } else {
        this.props.history.push('/');
      }
    });
  }

  renderTitle(title, value, def) {
    if (value !== def && value !== null) {
      return (
        <dt className="col-sm-3">{title}</dt>
      );
    } else {
      return (<div />);
    }
  }
  renderItem(title, value, def) {
    if (value !== def && value !== null) {
      return (
        <dd className="col-sm-9"><ReactMarkdown source={value} /></dd>
      );
    } else {
      return (<div />);
    }
  }

  renderAuthorsTitle(authors) {
    if (authors.length === 0) {
      return (<div />);
    } else if (authors.length === 1) {
      return (<dt className="col-sm-3">Author</dt>);
    } else {
      return (<dt className="col-sm-3">Authors</dt>);
    }
  }
  renderAuthors(authors) {
    if (authors.length === 0) {
      return (<div />);
    } else {
      return (<dd className="col-sm-9">{authors.map(author => {return (<a className="text-primary mx-1" href={'/people/' + author} key={authors.indexOf(author)}>{author}</a>)})}</dd>);
    }
  }

  renderOwnerTitle(owners) {
    if (owners.length === 0) {
      return (<div />);
    } else if (owners.length === 1) {
      return (<dt className="col-sm-3">Owner</dt>);
    } else {
      return (<dt className="col-sm-3">Owners</dt>);
    }
  }
  renderOwners(owners) {
    if(owners.length === 0){
      return (<div />);
    }else{
      return(
        <dd className="col-sm-9">
          <dl className="row">
            {owners.map((owner, idx) => <React.Fragment key={idx}><dt className="col-sm-3"><a className="text-primary mx-1" href={'/people/' + owner.name}>{owner.name}</a></dt><dd className="col-sm-9">{owner.description}</dd></React.Fragment>)}
          </dl>
        </dd>
      );
    }
  }

  renderDateTitle(type, date) {
    if (date === null || date.toISOString() === new Date("0001-01-01").toISOString()) {
      return (<div />);
    } else {
      return (<dt className="col-sm-3">{type}</dt>);
    }
  }
  renderDate(type, date) {
    if (date === null || date.toISOString() === new Date("0001-01-01").toISOString()) {
      return (<div />);
    } else {
      return (<dd className="col-sm-9">{date.toGMTString().slice(0, -13)}</dd>);
    }
  }

  renderData() {
    return (
      <dl className="row">
        {this.renderTitle("Title", this.state.title, '')}
        {this.renderItem("Title", this.state.title, '')}
        {this.renderAuthorsTitle(this.state.author)}
        {this.renderAuthors(this.state.author)}
        {this.renderTitle("Publisher", this.state.publisher, '')}
        {this.renderItem("Publisher", this.state.publisher, '')}
        {this.renderDateTitle("Date", this.state.date)}
        {this.renderDate("Date", this.state.date)}
        {this.renderTitle("Description", this.state.description, '')}
        {this.renderItem("Description", this.state.description, '')}
        {this.renderTitle("Printer", this.state.printer, '')}
        {this.renderItem("Printer", this.state.printer, '')}
        {this.renderOwnerTitle(this.state.owners)}
        {this.renderOwners(this.state.owners)}
        {this.renderTitle("Source", this.state.source, '')}
        {this.renderItem("Source", this.state.source, '')}
        {this.renderDateTitle("Acquired", this.state.acquired)}
        {this.renderDate("Acquired", this.state.acquired)}
        {this.renderTitle("Cost", this.state.cost, '0')}
        {this.renderItem("Cost", (this.state.cost ? '$' + this.state.cost.toString() : this.state.cost), '$0')}
        {this.renderTitle("Title Transcription", this.state.titleTranscription, '')}
        {this.renderItem("Title Transcription", this.state.titleTranscription, '')}
        {this.renderTitle("References", this.state.reference, '')}
        {this.renderItem("References", this.state.reference, '')}
        {this.renderTitle("Appraisal", this.state.appraisalValue, '0')}
        {this.renderItem("Appraisal", (this.state.appraisalValue ? '$' + this.state.appraisalValue.toString() : this.state.appraisalValue), '$0')}
        {this.renderTitle("Type", this.state.type, '')}
        {this.renderItem("Type", this.state.type, '')}
      </dl>
    );
  }

  renderOptions() {
    if (this.state.loggedIn) {
      return (
        <div>
          <button type="button" className="btn btn-outline-danger col-sm-2 mx-1" onClick={this.handleDelete}>Delete</button>
          <a className="btn btn-outline-warning col-sm-2 mx-1" href={"/modify/" + this.state.id}>Modify</a>
        </div>
      );
    } else {
      return (<div />);
    }
  }

  renderStatus() {
    if (this.state.status === '') {
      return (<div />);
    } else {
      return (<div className="alert alert-danger" role="alert">
        {this.state.status}
      </div>);
    }
  }

  render() {
    return (
      <div className="main" style={{marginBottom: '220px'}}>
        <Header src="entry" loggedIn={this.state.loggedIn}/>
        <div className="p-3 container">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">{this.state.title}</h2>
              <p className="text-muted">{this.state.author.map(author=>{return (<a className='text-muted mx-1' href={"/people/" + author} key={this.state.author.indexOf(author)}>{author}</a>)})}</p>
              <div className="container">
                <ReactMarkdown source={this.state.description} />
                {this.renderData()}
                {this.renderOptions()}
              </div>
              <Gallery files={this.state.files} />
            </div>
          </div>
          {this.renderStatus()}
        </div>
        <Footer loggedIn={this.state.loggedIn}/>
      </div>
    );
  }
}

export default Entry;
