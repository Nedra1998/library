import React, {Component} from 'react';

class EntryList extends Component {
  constructor(props){
    super(props);
    this.state = {
      dir: (props.dir ? props.dir : 'entry'),
      entries: props.entries
    };
    this.date = this.date.bind(this);
  }

  componentWillReceiveProps(newProps){
    this.setState({entries: newProps.entries});
  }

  date(entry) {
    if(entry.date)
      return <p className="text-muted">{new Date(entry.date).toGMTString().slice(0, -13)}</p>
    else
      return <p />
  }

  render(){
    var entryItems = ''
    if(Array.isArray(this.state.entries)){
      entryItems = this.state.entries.map(entry => {
        if(typeof entry === 'string'){
          return (
            <a href={"/" + this.state.dir + "/" + entry} className="list-group-item list-group-item-active align-items-start" key={this.state.entries.indexOf(entry)}>
              <h5>{entry}</h5>
            </a>
          );
        }else if(entry){
          return (
            <a href={"/" + this.state.dir + "/" + entry.id} className="list-group-item list-group-item-active align-items-start" key={this.state.entries.indexOf(entry)}>
              <h5>{entry.title}</h5>
              <p className="text-muted">{entry.author.map(author=>{return <a className="text-muted mx-1" href={"/people/" + author} key={entry.author.indexOf(author)}>{author}</a>})}</p>
              {this.date(entry)}
            </a>
          );
        }else{
          return (<div />);
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
