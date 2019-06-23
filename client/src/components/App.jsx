import React, {Component} from 'react';
import '../styles/style.css';
import Transaction from './Transaction';
import List from './List'

const dataMock = [
	{cod: 1, name: 'patri 1', status: 'shared_lock'},
	{cod: 2, name: 'patri 2', status: 'exclusive_lock'},
	{cod: 3, name: 'patri 3', status: 'free'},
]

class App extends Component {
	state = {
		title: null,
		dataList: [],
		newTran: [],
		transactionCount: 0,
		uncommittedChanges: {}
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

	newTransaction = () => {
		this.setState(state => ({
			...state,
			newTran: [...state.newTran, {title: `T${state.transactionCount + 1}`}],
			transactionCount: state.transactionCount + 1,
		}))
	}

	onChangeData = (action, values, title) => {
		//saveLog
		//saveUncommited
		this.setState(state => {
			let uncommittedChanges = state.uncommittedChanges
			let newData = []
			if(uncommittedChanges[title]) {
				newData = [ ...uncommittedChanges[title], {cod: values.data.cod ,name: values.data.name, action} ]
			}  else {
				newData = [{cod: values.data.cod ,name: values.data.name, action}]
			}
			return {
				uncommittedChanges: {
					...state.uncommittedChanges, 
					[title]: newData
				}
			}
		})
	}

	render() {
		const { dataList, newTran } = this.state;
		console.log('uncom', this.state.uncommittedChanges)
		return (
			<div className="container">
				<header>
					<h1>SGJD-JS</h1>
				</header>
				<section className="content">
					<div className="main">
						<List {...this.state} />
						<div className="buttons">
							<button onClick={this.newTransaction}>Nova transação</button>
							<button>Checkpoint</button>
						</div>
					</div>
					<div className="transactions">
						{
							newTran.map((elem, index) => {
								return <Transaction {...this.state} elem={elem} index={index} key={index} onChangeData={this.onChangeData} />
							})
						}
					</div>
				</section>
			</div>
		);
	}
}

export default App;
