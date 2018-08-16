import React, {Component} from 'react';

import axios from 'axios';

import Header from '../components/header.js';
import Footer from '../components/footer.js';

class CreateUser extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn: false,
      name: '',
      password: '',
      status: ''
    };
    this.handleCreate = this.handleCreate.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.renderStatus= this.renderStatus.bind(this);
  }

  componentDidMount() {
    axios.get('/api/users/loggedin').then(res => {
      this.setState(res.data);
    });
  }

  handleCreate(){
    axios.post('/api/users/register', this.state).then(res => {
      if('error' in res.data) this.setState({'status': res.data.error});
      else this.setState({status: 'SUCCESS'});
    });
  }

  handleName(event){
    this.setState({name: event.target.value});
  }
  handlePassword(event){
    this.setState({password: event.target.value});
  }

  renderStatus(){
    if(this.state.status === ''){
      return ( <div> </div>);
    }else if(this.state.status === "SUCCESS"){
      return (
        <div className="alert alert-success" role="alert">
          Created user.
        </div>
      );
    }else {
      return (
        <div className="alert alert-danger" role="alert">
          {this.state.status}
        </div>
      );
    }
  }

  render() {
    return (<div className="main">
      <Header src="home" loggedIn={this.state.loggedIn}/>
      <div className="text-center py-5" style={{width: '100%', maxWidth: '330px', margin: 'auto'}}>
        <form onSubmit={this.handleCreate} action='' autoComplete="off">
          <h1 className="h3 mb-3 font-width-normal">Create User</h1>
          <label htmlFor="inputName" className="sr-only">Name</label>
          <input type="name" id="inputName" className="form-control" placeholder="Name" required autoFocus onChange={this.handleName} value={this.state.username}/>
          <label htmlFor="inputPassword" className="sr-only">Name</label>
          <input type="password" id="inputPassword" className="form-control" placeholder="Password" required onChange={this.handlePassword} value={this.state.password}/>
          <div className="py-3">
            <button className="btn btn-lg btn-primary btn-block" type="button" onClick={this.handleCreate}>Register</button>
          </div>
        </form>
        {this.renderStatus()}
      </div>
      <Footer loggedIn={this.state.loggedIn}/>
    </div>);
  }
}

export default CreateUser;
