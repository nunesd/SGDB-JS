import React from 'react'
import PropTypes from 'prop-types'

const List = props => {
	return (
		<div className="list">
			<div className={`header-list${!props.status ? ' center' : ''}`}>
				<div>Código</div>
				<div>Nome</div>
				{props.status && <div>Status</div> || null}
			</div>
			{
				props.dataList.map((elem, index) => (
					<div className={`row${!props.status ? ' center' : ''}`} key={index}>
						<div><span>{elem.cod}</span></div>
						<div><span>{elem.name}</span></div>
						{props.status && <div><span>{elem.status}</span></div> || null}
					</div>
				))
			}
		</div>
	)
}

List.propTypes = {
	dataList: PropTypes.array,
	status: PropTypes.bool,
}

export default List

