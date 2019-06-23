import React from 'react'
import PropTypes from 'prop-types'

const List = props => {
	return (
		<div className="list">
			<div className="header-list">
				<div>Código</div>
				<div>Nome</div>
				<div>Status</div>
			</div>
			{
				props.dataList.map((elem, index) => (
					<div className="row" key={index}>
						<div><span>{elem.cod}</span></div>
						<div><span>{elem.name}</span></div>
						<div><span>{elem.status}</span></div>
					</div>
				))
			}
		</div>
	)
}

List.propTypes = {
	dataList: PropTypes.array,
}

export default List

