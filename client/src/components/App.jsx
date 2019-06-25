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
		uncommittedChanges: {},
		hasUncommited : null
	}

	componentDidMount() {
		utils.getDB().then(res => res.json()).then(res => this.setState({dataList: res.data}))
		// this.setState({ dataList: dataMock })
		this.setState({
			hasUncommited: sessionStorage.uncommittedChanges
		})
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
			newTran: [...state.newTran, {title: `T${state.transactionCount + 1}`, disabled: false}],
			transactionCount: state.transactionCount + 1,
		}))
	}

	onSearch = (id, title, index) => {
		const { newTran, dataList } = this.state
		
		let i = null
		
		dataList.find((elem, key) => {
			i = key
			return elem.cod === id
		})

		if (dataList[i].status === utils.constants.EXCLUSIVE_LOCK) {
			alert("Esta linha está bloqueada, aguarde até que ela seja liberada")
			this.setState( state => {
				let newTransac = newTran.slice();
				newTransac[index].disabled = true
				return { ...state, newTran: newTransac }
			})
		} else {
			this.setState(state => {
				let dataList = state.dataList.slice();
	
				dataList[i].status = utils.constants.SHARED_LOCK
				
				return {...state, dataList}
			})
		}

		console.log('log search')
		utils.setLogs(
			utils.logBody(
				title, 
				'SELECT', 
				utils.querys.select(this.state.dataList[i])
			)
		)
	}

	saveOnLocalStorage = (data) => {
		sessionStorage.uncommittedChanges = JSON.stringify(data);
	}

	onChangeData = (action, values, title) => {
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
		}, () => {
			this.saveOnLocalStorage(this.state.uncommittedChanges)
			console.log(this.state.uncommittedChanges)
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

	filterUncommittedChanges = (title) => {
		
		const { uncommittedChanges, newTran } = this.state
		let newUncommittedChanges = []
		
		for (var key in uncommittedChanges) {
			if(key !== title)
				newUncommittedChanges.push( {[key]: uncommittedChanges[key]})
		}

		this.saveOnLocalStorage(newUncommittedChanges)
		
		return newUncommittedChanges
	}

	onRollback = title => {
		this.setState({
			uncommittedChanges: this.filterUncommittedChanges(title)
		})
		this.setState(state => {
			let newTransac = state.newTran.slice().filter(elem => elem.title !== title)
			return { ...state, newTran: newTransac }
		})
		
		utils.setLogs({action: 'ROLLBACK', session: title})
	}


	onCommit = title => {
		const { uncommittedChanges } = this.state

		let newUncommittedChanges = null

		for (var key in uncommittedChanges) {
			if(key === title)
				newUncommittedChanges = {[key]: uncommittedChanges[key]}
		}

		console.log(newUncommittedChanges[title], 'newUncommittedChanges')

		this.setState({
			uncommittedChanges: this.filterUncommittedChanges(title)
		})

		this.setState(state => {
			let newTransac = state.newTran.slice().filter(elem => elem.title !== title)
			return { ...state, newTran: newTransac }
		})

		utils.updateDB({data: newUncommittedChanges[title]})
	}

	handleUndo = () => {
		this.saveOnLocalStorage(null)
		this.setState({hasUncommited: null})
		let parse = JSON.parse(this.state.hasUncommited)
		for(let key in parse) {
			utils.setLogs({action: 'ROLLBACK', session: key})
		}		
	}

	handleRedo = () => {
		this.saveOnLocalStorage(null)
		
		let parse = JSON.parse(this.state.hasUncommited)
		let keys = []
		let arr = []
		for(let key in parse) {
			keys.push(parse[key])
		}
		keys.forEach(elem => {
			arr.push(elem)
		});
		
		this.setState({hasUncommited: null})
		utils.updateDB({data: arr})
	}

	render() {
		const { dataList, newTran, hasUncommited } = this.state;
		if(hasUncommited && hasUncommited.length && hasUncommited !== "null") {
			return (
				<div style={{width: '500px', height: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItens: 'center'}}>
					<div className="title" style={{display: 'flex', justifyContent: 'center'}}> Existem itens não commitados, o que fazer com eles? </div>
					<div className="buttuns" style={{display: 'flex', justifyContent: 'space-evenly'}}>
						<button onClick={this.handleRedo}>Redo</button>
						<button onClick={this.handleUndo}>Undo</button>
					</div>
				</div>
			)
		}
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
										onRollback={this.onRollback}
										onCommit={this.onCommit}
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
