import React, {Component} from 'react';

import axios from 'axios';

import Header from '../components/header.js';
import Footer from '../components/footer.js';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      status: ''
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.renderStatus= this.renderStatus.bind(this);
  }

  handleLogin(){
    axios.post('/users/login', this.state).then(res => {
      this.setState({'status': 'SUCCESS'});
      this.props.history.push('/');
    }).catch(err => {
      this.setState({'status': 'FAIL'});
    });
  }

  handleName(event){
    this.setState({username: event.target.value});
  }
  handlePassword(event){
    this.setState({password: event.target.value});
  }

  renderStatus(){
    if(this.state.status === 'FAIL'){
      return (
        <div className="alert alert-danger" role="alert">
          Username or Password was incorrect.
        </div>
      );
    }else if(this.state.status === "SUCCESS"){
      return (
        <div className="alert alert-success" role="alert">
          Logged In.
        </div>
      );
    }else {
      return (<div></div>);
    }
  }

  render() {
    return (<div className="main">
      <Header src="home" loggedIn={this.state.loggedIn}/>
      <div className="text-center py-5" style={{width: '100%', maxWidth: '330px', margin: 'auto'}}>
        <form onSubmit={this.handleLogin} action='#'>
          <h1 className="h3 mb-3 font-width-normal">Please sign in</h1>
          <label htmlFor="inputName" className="sr-only">Name</label>
          <input type="name" id="inputName" className="form-control" placeholder="Name" required autoFocus onChange={this.handleName} value={this.state.username}/>
          <label htmlFor="inputPassword" className="sr-only">Name</label>
          <input type="password" id="inputPassword" className="form-control" placeholder="Password" required onChange={this.handlePassword} value={this.state.password}/>
          <div className="py-3">
            <button className="btn btn-lg btn-primary btn-block" type="button" onClick={this.handleLogin}>Sign In</button>
          </div>
        </form>
        {this.renderStatus()}
      </div>
      <Footer loggedIn={this.state.loggedIn}/>
    </div>);
  }
}

export default Login;
