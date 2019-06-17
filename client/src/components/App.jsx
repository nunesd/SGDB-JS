import React, {Component} from 'react';
import '../styles/style.css'

const dataMock = [
  {numero_patrimonio: 1,nome_patrimonio: 'patri 1', status: 'shared_lock'},
  {numero_patrimonio: 2,nome_patrimonio: 'patri 2', status: 'exclusive_lock'},
  {numero_patrimonio: 3,nome_patrimonio: 'patri 3', status: 'free'},
]

class App extends Component {
  state = {
    title: null,
    dataList: []
  }

  componentDidMount() {
    this.setState({ dataList: dataMock })
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
    const { dataList } = this.state;
    return (
      <div className="container">
        <header>
          <h1>SGJD-JS</h1>
        </header>
        <section className="content">
          <div className="main">
            <div className="list">
              <div className="header-list">
                <div>Número</div>
                <div>Nome</div>
                <div>Status</div>
              </div>
              {
                //{numero_patrimonio: 1,nome_patrimonio: 'patri 1', status: 'shared_lock'},
                dataList.map(elem => (
                  <div className="row">
                    <div><span>{elem.numero_patrimonio}</span></div>
                    <div><span>{elem.nome_patrimonio}</span></div>
                    <div><span>{elem.status}</span></div>
                  </div>
                ))
              }
            </div>
            <div className="buttons">
              <button>Nova transação</button>
              <button>Checkpoint</button>
            </div>
          </div>
          <div className="transactions">
            
          </div>
        </section>
      </div>
    );
  }
}

export default App;
