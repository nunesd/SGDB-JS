import React, { useState } from 'react'
import PropTypes from 'prop-types'
import List from './List'
import {utils} from './utils'

const Transaction = props => {
	const [activeValue, setValue] = useState("");
	const [searchValue, setSearchValue] = useState(""); 

		return (
		<div className="transaction">
			<div className="title">{props.elem.title}</div>
			<div className="transaction-content">
				<List {...props} />
				<div className="row">
					<div className="search">
						<label>
							Código:
							<input 
								type="text" 
								name="código" 
								value={searchValue} 
								onChange={e => setSearchValue(e.target.value ? parseInt(e.target.value) : e.target.value)} 
							/>
						</label>
						<button onClick={() => setValue(utils.findElemWithIndex(props.dataList, 'cod', searchValue))}>Buscar</button>
					</div>
				</div>
				<div className="row">
					<div className="name">
						<label>
							Nome:
							<input type="text" value={activeValue && activeValue.data.name} 
							onChange={
								e => setValue({...activeValue, data: {...activeValue.data, nome: e.target.value }})
							} />
						</label>
					</div>
				</div>
				<div className="row">
					<div className="alter-data">
						<button className="post" onClick={() => props.onChangeData('POST', activeValue, props.elem.title)}>Incluir</button>
						<button className="put" onClick={() => props.onChangeData('PUT', activeValue, props.elem.title)}>Alterar</button>
						<button className="delete" onClick={() => props.onChangeData('DELETE', activeValue, props.elem.title)}>Excluir</button>
					</div>
				</div>
				<div className="row">
					<div className="actions">
						<button>Commit</button>
						<button>Rollback</button>
					</div>
				</div>
			</div>
		</div>
		)
	
	
}

Transaction.propTypes = {
	dataList: PropTypes.array,
	newTran: PropTypes.array,
	elem: PropTypes.object,
	index: PropTypes.number,
	onChangeData: PropTypes.func,
}

export default Transaction

