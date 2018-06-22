import React, {Component} from 'react';

import axios from 'axios';

import Header from '../components/header.js';
import SearchBox from '../components/searchBox.js';
import List from '../components/list.js';
import Footer from '../components/footer.js';

class People extends Component {
  constructor(props){
    super(props);
    this.state = {loggedIn: false};
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    axios.get('/users/loggedin').then(res => {
      this.setState(res.data);
    });
  }

  render() {
    return (
      <div className="main" style={{marginBottom: '220px'}}>
        <Header src="people" loggedIn={this.state.loggedIn}/>
        <div className="p-3 container">
          <SearchBox src="people" />
          <List src="people" />
        </div>
        <Footer loggedIn={this.state.loggedIn}/>
      </div>
    );
  }
}

export default People;
