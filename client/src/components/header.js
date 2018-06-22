import React, {Component} from 'react';

class Header extends Component {
  constructor(props){
    super(props);
    this.state = {};
    this.renderOptions = this.renderOptions.bind(this);
  }

  renderOptions(){
    if (this.props.loggedIn){
      return (
        <ul className="navbar-nav mr-auto">
          <li className={"nav-item " + (this.props.src === "home" ? "active" : "")}>
            <a className="nav-link" href="/">Home</a>
          </li>
          <li className={"nav-item " + (this.props.src === "books" ? "active" : "")}>
            <a className="nav-link" href="/books">Books</a>
          </li>
          <li className={"nav-item " + (this.props.src === "people" ? "active" : "")}>
            <a className="nav-link" href="/people">People</a>
          </li>
          <li className={"nav-item " + (this.props.src === "create" ? "active" : "")}>
            <a className="nav-link" href="/create">Create</a>
          </li>
        </ul>
      );
    }else{
      return (
        <ul className="navbar-nav mr-auto">
          <li className={"nav-item " + (this.props.src === "home" ? "active" : "")}>
            <a className="nav-link" href="/">Home</a>
          </li>
          <li className={"nav-item " + (this.props.src === "books" ? "active" : "")}>
            <a className="nav-link" href="/books">Books</a>
          </li>
          <li className={"nav-item " + (this.props.src === "people" ? "active" : "")}>
            <a className="nav-link" href="/people">People</a>
          </li>
        </ul>
      );
    }
  }

  render(){
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <a className="navbar-brand" href="/">Rasmussen Collection</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          {this.renderOptions()}
        </div>
      </nav>
    );
  }
}

export default Header;
