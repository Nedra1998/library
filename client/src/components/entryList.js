import React, {Component} from 'react';

class EntryList extends Component {
  constructor(props){
    super(props);
    this.state = {
      dir: (props.dir ? props.dir : 'entry'),
      entries: props.entries
    };
  }

  componentWillReceiveProps(newProps){
    this.setState({entries: newProps.entries});
  }

  render(){
    var entryItems = ''
    if(Array.isArray(this.state.entries)){
      entryItems = this.state.entries.map(entry => {
        if(typeof entry === 'string'){
          return (
            <a href={"/" + this.state.dir + "/" + entry} className="list-group-item list-group-item-active align-items-start">
              <h5>{entry}</h5>
            </a>
          );
        }else{
          return (
            <a href={"/" + this.state.dir + "/" + entry.title} className="list-group-item list-group-item-active align-items-start">
              <h5>{entry.title}</h5>
              <p className="text-muted">{entry.author.map(author=>{return <a className="text-muted mx-1" href={"/people/" + author}>{author}</a>})}</p>
            </a>
          );
        }
      });
    }
    return (
      <div className="list-group py-3">
        {entryItems}
      </div>
    );
  }
}

export default EntryList;
