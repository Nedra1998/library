import React, {
  Component
} from 'react';

import axios from 'axios';

import Header from '../components/header.js';
import Footer from '../components/footer.js';

class Entry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      title: this.props.match.params.title,
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
      status: ''
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.renderData = this.renderData.bind(this);
    this.renderOptions = this.renderOptions.bind(this);
    this.renderStatus = this.renderStatus.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    axios.get('/users/loggedin').then(res => {
      this.setState(res.data);
    });
    axios.get('/entry/' + this.state.title).then(res => {
      this.setState({
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
        type: res.data.type
      });
    });
  }

  handleDelete() {
    axios.get('/delete/' + this.state.title).then(res => {
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
        <dt className="col-sm-2">{title}</dt>
      );
    } else {
      return (<div />);
    }
  }
  renderItem(title, value, def) {
    if (value !== def && value !== null) {
      return (
        <dd className="col-sm-10">{value}</dd>
      );
    } else {
      return (<div />);
    }
  }

  renderAuthorsTitle(authors) {
    if (authors.length === 0) {
      return (<div />);
    } else if (authors.length === 1) {
      return (<dt className="col-sm-2">Author</dt>);
    } else {
      return (<dt className="col-sm-2">Authors</dt>);
    }
  }
  renderAuthors(authors) {
    if (authors.length === 0) {
      return (<div />);
    } else {
      return (<dd className="col-sm-10">{authors.map(author => {return (<a className="text-primary mx-1" href={'/people/' + author}>{author}</a>)})}</dd>);
    }
  }

  renderDateTitle(type, date) {
    if (date === null || date.toISOString() === new Date("0001-01-01").toISOString()) {
      return (<div />);
    } else {
      return (<dt className="col-sm-2">{type}</dt>);
    }
  }
  renderDate(type, date) {
    if (date === null || date.toISOString() === new Date("0001-01-01").toISOString()) {
      return (<div />);
    } else {
      return (<dd className="col-sm-10">{date.toGMTString().slice(0, -13)}</dd>);
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
        {/* {this.renderOwners(this.state.owners)} */}
        {this.renderTitle("Source", this.state.source, '')}
        {this.renderItem("Source", this.state.source, '')}
        {this.renderDateTitle("Acquired", this.state.acquired)}
        {this.renderDate("Acquired", this.state.acquired)}
        {this.renderTitle("Cost", this.state.cost, '0')}
        {this.renderItem("Cost", (this.state.cost ? '$' + this.state.cost : this.state.cost), '$0')}
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
          <a className="btn btn-outline-warning col-sm-2 mx-1" href={"/modify/" + this.state.title}>Modify</a>
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
              <p className="text-muted">{this.state.author.map(author=>{return (<a className='text-muted mx-1' href={"/people/" + author}>{author}</a>)})}</p>
              <div className="container">
                {this.state.description}
                {this.renderData()}
                {this.renderOptions()}
              </div>
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
