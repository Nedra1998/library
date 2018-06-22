import React, {Component} from 'react';

import axios from 'axios';

class Footer extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn: props.loggedIn
    };
    this.renderOptions = this.renderOptions.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  componentWillReceiveProps(newProps){
    this.setState({loggedIn: newProps.loggedIn});
  }

  handleLogout(){
    axios.get('/users/logout').then(res => {this.setState({loggedIn: false})});
  }

  renderOptions(){
    if(this.state.loggedIn){
      return (
        <ul className="list-group list-group-flush">
          <a href="/create" className="list-group-item list-group-item-action">Create</a>
          <button onClick={this.handleLogout} className="list-group-item list-group-item-action">Logout</button>
          <a href="/users/create" className="list-group-item list-group-item-action">Create User</a>
          <a href="/users/delete" className="list-group-item list-group-item-action">Delete User</a>
        </ul>
      );
    }else{
      return (
        <ul className="list-group list-group-flush"> 
          <a href="/users/login" className="list-group-item list-group-item-action list-group-item-dark">Login</a>
        </ul>
      );
    }
  }

  render() {
    return (
      <footer className="footer p-3 bg-dark" style={{position: 'absolute', left: 0, bottom: 0, width: '100%', overflow: 'hidden'}}>
        <div className="container">
            {this.renderOptions()}
        </div>
      </footer>
    )
  }
}
export default Footer;
