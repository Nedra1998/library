import React, {Component} from 'react';
import axios from 'axios';

import EntryList from './entryList.js';

class List extends Component {
  constructor(props){
    super(props);
    this.state = {
      src: props.src,
      letter: 'all',
      letters: [],
      sort: 'Title',
      results: []
    };
    this.getResults = this.getResults.bind(this);
    this.setLetter = this.setLetter.bind(this);
    this.getLetters = this.getLetters.bind(this);
    this.renderDropdown = this.renderDropdown.bind(this);
  }

  componentDidMount(){
    this.getLetters();
    this.getResults();
  }

  getResults(){
    if(this.state.sort === 'Title'){
      if(this.state.letter !== 'all'){
        axios.get((this.props.src !== 'home' ? '/api/' + this.props.src : '/api' ) + '/letter/' + this.state.letter).then(res => {
          this.setState({results : res.data});
        });
      }else{
        axios.get((this.props.src !== 'home' ? '/api/' + this.props.src : '/api') + '/all').then(res => {
          this.setState({results: res.data}, () => {console.log(this.state)});
        });
      }
    }else{
      if(this.state.letter !== 'all'){
        axios.get((this.props.src !== 'home' ? '/api/' + this.props.src : '/api') + '/date/' + this.state.letter).then(res => {
          this.setState({results : res.data});
        });
      }else{
        axios.get((this.props.src !== 'home' ? '/api/' + this.props.src : '/api') + '/all?sort=date').then(res => {
          this.setState({results: res.data});
        });
      }
    }
  }

  getLetters(){
    if(this.state.sort === 'Title'){
      axios.get((this.props.src !== 'home' ? '/api/' + this.props.src : '/api') + '/index').then(res => {
        var letters = new Set([]);
        var titles = res.data;
        if(titles){
          titles.forEach(str => {letters.add(str[0])});
        }
        this.setState({letters: Array.from(letters).sort()});
      });
    }else{
      axios.get((this.props.src !== 'home' ? '/api/' + this.props.src : '/api') + '/dates').then(res => {
        var century = new Set([]);
        var dates = res.data;
        dates.forEach(str => { if(str.substr(0, 4) !== '0001') {century.add(Math.floor(parseInt(str.substr(0, 4), 10) / 100) * 100)}});
        this.setState({letters: Array.from(century).sort()});
      });
    }
  }

  setLetter = (letter) => (evt) => {
    this.setState({letter: letter}, () => this.getResults());
  }

  changeMethod = (method) => (evt) => {
    this.setState({sort: method}, () => {this.getLetters(); this.getResults()});
  }

  renderDropdown(){
    if(this.state.src !== 'people'){
      return(<div className="btn-group btn-group-sm" role="group">
        <div className="btn-group" role="group">
          <button type="button" className="btn dropdown-toggle btn-sm btn-primary mx-2" data-toggle="dropdown">{this.state.sort}</button>
          <div className="dropdown-menu">
            <button className="dropdown-item" onClick={this.changeMethod("Title")}>Title</button>
            <button className="dropdown-item" onClick={this.changeMethod("Date")}>Date</button>
          </div>
        </div>
      </div>);
      }else{
        return (<div />);
      }
  }

  render(){
    return (
      <div className="entry-list">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title mx-auto">Listing</h2>
          <div className="mx-auto">
            <div className="btn-group btn-group-sm" role="group">
              <button type="button" className={"btn btn-sm btn-primary mx-2" + ("all" === this.state.letter ? " active" : "")} onClick={this.setLetter("all")}>All</button>
            </div>
            <div className="btn-group btn-group-sm" role="group">
      {this.state.letters.map(letter => {
        return (<button type="button" className={"btn btn-sm btn-primary" + (letter === this.state.letter ? " active" : "")} onClick={this.setLetter(letter)} key={this.state.letters.indexOf(letter)}>{letter}</button>);
      })}
    </div>
      {this.renderDropdown()}
    </div>
  </div>
</div>
<EntryList entries={this.state.results} dir={this.props.src === 'people' ? this.props.src : null}/>
      </div>
      );
  }
}
export default List;
