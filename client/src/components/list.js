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
      results: []
    };
    this.getResults = this.getResults.bind(this);
    this.setLetter = this.setLetter.bind(this);
    this.getLetters = this.getLetters.bind(this);
  }

  componentDidMount(){
    this.getLetters();
    this.getResults();
  }

  getResults(){
    if(this.state.letter !== 'all'){
      axios.get((this.props.src !== 'home' ? '/' + this.props.src : '' ) + '/letter/' + this.state.letter).then(res => {
        this.setState({results : res.data});
      });
    }else{
      axios.get((this.props.src !== 'home' ? '/' + this.props.src : '') + '/all').then(res => {
        this.setState({results: res.data});
      })
    }
  }

  getLetters(){
    axios.get((this.props.src !== 'home' ? '/' + this.props.src : '') + '/index').then(res => {
      var letters = new Set([]);
      var titles = res.data;
      titles.forEach(str => {letters.add(str[0])});
      this.setState({letters: Array.from(letters)});
    });
  }

  setLetter = (letter) => (evt) => {
    this.setState({letter: letter}, () => this.getResults());
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
                    return (<button type="button" className={"btn btn-sm btn-primary" + (letter === this.state.letter ? " active" : "")} onClick={this.setLetter(letter)}>{letter}</button>);
                  })}
                </div>
              </div>
            </div>
          </div>
          <EntryList entries={this.state.results} dir={this.props.src === 'people' ? this.props.src : null}/>
      </div>
    );
  }
}
export default List;
