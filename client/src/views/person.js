import React, {
  Component
} from 'react';

import axios from 'axios';

import Header from '../components/header.js';
import Footer from '../components/footer.js';

import EntryList from '../components/entryList.js';

class Person extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      name: this.props.match.params.name,
      author: [],
      owner: []
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.renderSet = this.renderSet.bind(this);
  }

  componentDidMount() {
    axios.get('/users/loggedin').then(res => {
      this.setState(res.data);
    });
    axios.get('/name/' + this.state.name).then(res => {
      this.setState(res.data);
    });
  }

  renderSet(title, set) {
    if (set.length !== 0) {
      return (
        <div>
          <h4>{title}</h4>
          <EntryList entries={set}/>
        </div>
      );
    }else{
      return (<div />);
    }
  }

  render() {
    return (
      <div className="main" style={{marginBottom: '220px'}}>
        <Header src="person" loggedIn={this.state.loggedIn}/>
        <div className="p-3 container">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">{this.state.name}</h2>
              <div className="container">
                {this.renderSet("Authored", this.state.author)}
                {this.renderSet("Owned", this.state.owner)}
              </div>
            </div>
          </div>
        </div>
        <Footer loggedIn={this.state.loggedIn}/>
      </div>
    );
  }
}

export default Person;
