import React, {Component} from 'react';
import axios from 'axios';

import EntryList from './entryList.js';

class SearchBox extends Component{
  constructor(props){
    super(props);
    this.state = {
      query: '',
      live: true,
      results: []
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleSearch(){
    axios.get((this.props.src !== 'home' ? '/' + this.props.src : '') + '/search?query=' + this.state.query).then(res => {
      this.setState({results: res.data});
    })
  }

  handleChange(event){
    this.setState({query: event.target.value}, (this.state.live ? this.handleSearch : null));
  }

  handleClick(){
    this.setState({live: !this.state.live});
  }

  render(){
    return (
      <div className="search-box">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">Search</h2>
            <form onSubmit={this.handleSearch}>
              <div className="form-group row px-3">
                <div className="col-md-10">
                  <input className="form-control" type="search" placeholder="Search" aria-label="Search" onChange={this.handleChange}/>
                </div>
                <button className="btn btn-outline-success col-md-2" type="button" onClick={this.handleSearch}>Search</button>
              </div>
              <div className="px-3 form-group row">
                <div className="col-md-10"></div>
                <button className={"col-md-2 btn " + (this.state.live ? 'btn-success' : '')} type="button" onClick={this.handleClick}>Live Search</button>
              </div>
            </form>
          </div>
        </div>
        <EntryList entries={this.state.results} dir={this.props.src === 'people' ? this.props.src : null}/>
      </div>
    );
  }
}

export default SearchBox;
