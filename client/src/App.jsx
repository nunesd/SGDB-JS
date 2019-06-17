import React, {Component} from 'react';
import './App.css';
import './style.less'

class App extends Component {
  state = {
    title: null 
  }

  handleSetTitle = title => {
    this.setState({ title })
  }

  fetchData = () => {
    fetch('http://localhost:3000/', {method: 'GET'}).then(res => res.json()).then(res => {
      this.handleSetTitle(res.data.teste)
    })
  }

  render() {
    const { title } = this.state;
    return (
      <div className="container">
        <header>
          <h1>SGJD-JS</h1>
        </header>
        <section className="content">
          <div className="main">
            <div className="list">

            </div>
            <div className="buttons"></div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
