import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      memes: [],
      topComment: '',
      bottomComment: '',
    }

    this.handleTopComment = this.handleTopComment.bind(this);
    this.handleBottomComment = this.handleBottomComment.bind(this);

  }

  componentDidMount() {
    fetch('/get_memes')
      .then(response => response.json())
      .then(data => {
        this.list = data.data.memes;

        this.setState({
          memes: this.list
        })
      })
  }

  handleTopComment(event) {
    this.setState({topComment: event.target.value});
  }

  handleBottomComment(event) {
    this.setState({bottomComment: event.target.value});
  }

  postData(meme) {
    let url = `/caption_image?username=evetsu&password=P@ssw0rd123&template_id=${meme.id}&text0=${this.state.topComment}&text1=${this.state.bottomComment}`;

    fetch(url, {
      method: 'POST',
      headers: {"Content-Type": "application/json; charset=utf-8"},
    })
      .then(response => response.json())
      .then(data => {
        let newObject = {
          id: meme.id,
          url: data.data.url,
          name: meme.name
        }

        this.setState({
          memes: [newObject]
        })
      })
  }

  backButton() {
    if(this.state.memes.length === 1){
      return(
        <button onClick={ () => {this.setState({memes: this.list})}}>Back</button>
      )
    }
  }

  inputs() {
    if(this.state.memes.length === 1){
      return(
        <div className="individual-inputs--container">
          <p className="individual-inputs--comments">
            Top comment:
            <input type="text" value={this.state.topComment} onChange={this.handleTopComment} name="top" />
          </p>
          <p className="individual-inputs--comments">
            Bottom comment:
            <input type="text" value={this.state.bottomComment} onChange={this.handleBottomComment} name="bottom" />
          </p>
          <button onClick={() => {this.postData(this.state.memes[0])}}>
            Submit
          </button>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to the Meme Generator</h1>
        </header>

        {this.backButton()}

        <div className="container">
          {
            this.state.memes.map( (meme) => {
              return(
                <a onClick={ () => {this.setState({ memes: [meme] })} }>
                  <img src={meme.url} alt={meme.name} className={(this.state.memes.length > 1) ? 'list--image' : 'individual--image'} />
                </a>
              )
            })
          }

          {this.inputs()}
        </div>
      </div>
    );
  }
}

export default App;
