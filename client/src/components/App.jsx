import React, {Component} from 'react';
import '../styles/style.css';
import Transaction from './Transaction';
import List from './List'
import { utils } from './utils'

const dataMock = [
	{cod: 1, name: 'patri 1', status: utils.constants.SHARED_LOCK},
	{cod: 2, name: 'patri 2', status: utils.constants.SHARED_LOCK},
	{cod: 3, name: 'patri 3', status: utils.constants.FREE},
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
		fetch('http://localhost:3000', {method: 'GET'}).then(res => res.json()).then(res => {
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

	onSearch = (id, title) => {
		let index = null
		
		this.state.dataList.find((elem, i) => {
			index = i
			return elem.cod === id
		})

		this.setState(state => {
			let dataList = state.dataList.slice();

			dataList[index].status = utils.constants.SHARED_LOCK
			
			return {...state, dataList}
		})
		
		utils.setLogs(
			utils.logBody(
				title, 
				'SELECT', 
				utils.querys.select(this.state.dataList[index])
			)
		)
	}

	onChangeData = (action, values, title) => {
		//saveLog
		//changeStatus
		if(action !== 'POST') {
			this.setState( state => {
				let dataList = state.dataList.slice();
				dataList[values.index].status = utils.constants.EXCLUSIVE_LOCK

				return {...state, dataList}
			})
		}

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
		
		let body = utils.logBody(
			title, 
			action, 
			action === 'UPDATE' ? 
				utils.querys.update(values.data)
			:
				action === 'POST' ?
					utils.querys.insert(values.data)
				:
					utils.querys.delete(values.data)
		)

		utils.setLogs(body)
	}

	render() {
		const { dataList, newTran } = this.state;
		return (
			<div className="container">
				<header>
					<h1>SGJD-JS</h1>
				</header>
				<section className="content">
					<div className="main">
						<List {...this.state} status={true} />
						<div className="buttons">
							<button onClick={this.newTransaction}>Nova transação</button>
							<button>Checkpoint</button>
						</div>
					</div>
					<div className="transactions">
						{
							newTran.map((elem, index) => {
								return (
									<Transaction 
										key={index} 
										{...this.state} 
										elem={elem} 
										index={index} 
										onChangeData={this.onChangeData} 
										onSearch={this.onSearch}
									/>
								)
							})
						}
					</div>
				</section>
			</div>
		);
	}
}

export default App;
