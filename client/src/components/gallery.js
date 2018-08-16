import React, {Component} from 'react';

function getMeta(url, callback) {
  var img = new Image();
  img.addEventListener("load", function(){
    callback(this.naturalWidth, this.naturalHeight);
  });
  img.src = '/' + url;
}


class Gallery extends Component{
  constructor(props){
    super(props);
    this.state = {
      files: props.files,
      max_height: 0
    };
    this.resize = this.resize.bind(this);
  }
  componentWillReceiveProps(newProps){
    this.setState({files: newProps.files}, this.resize);
  }

  resize(){
    if(this.state.files){
      this.state.files.forEach(url => {
        getMeta(url, (width, height) => { this.setState({max_height: Math.max(this.state.max_height, height)})});
      });
    }
  }

  render() {
    return (
      <div id="carousel" className="carousel slide rounded mt-3" data-ride="carousel">
        <ol className="carousel-indicators">
          {this.state.files.map((file, id) => {
            if(id === 0)
              return <li data-target='#carousel' data-slide-to={id} className="active" key={id}/>
                else
              return <li data-target='#carousel' data-slide-to={id} key={id}/>
          })}
        </ol>
        <div className="carousel-inner rounded" style={{backgroundColor: '#EEE'}}>
          {this.state.files.map((file, id) => {
            if(id === 0)
              return (
                <div className="carousel-item active justify-content-center" key={id} style={{"textAlign": "center", "height": this.state.max_height}}>
                  <img src={'/' + file} alt={id}/>
                </div>
              );
            else
              return (
                <div className="carousel-item justify-content-center" key={id} style={{textAlign: "center", height: this.state.max_height}}>
                  <img className="align-middle" src={'/' + file} alt={id} />
                </div>
              );
          })}
        </div>
        <a className="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="carousel-control-next" href="#carousel" role="button" data-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
      </div>
    );
  }
}

export default Gallery;
