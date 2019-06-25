export const utils = {
	URL: "http://localhost:3000",
	headers: {
		"Content-Type": "application/json",
	},
	findElemWithIndex: (array, column, value) => {
		let finded = null;
		array.forEach((elem, index) => {
			if(elem[column] === value) {
				finded = {index, data: elem}
			}
		});
		return finded
	},
	constants: {
		EXCLUSIVE_LOCK: 'EXCLUSIVE_LOCK',
		SHARED_LOCK: 'SHARED_LOCK',
		FREE: 'FREE', 
	},
	querys: {
		select: fields => `SELECT NAME FROM TbTabela WHERE COD = ${fields.cod}`,
		update: fields => `UPDATE FROM TbTabela SET NAME=${fields.name} WHERE COD=${fields.cod}`,
		delete: fields => `DELETE FROM TbTabela WHERE COD=${fields.cod}`,
		insert: fields => `INSERT INTO TbTabela (cod, name) values (${fields.cod}, ${fields.name})`
	},
	setLogs: body => {
		fetch(`${utils.URL}/logs`, 
			{
				method: 'POST', 
				body: JSON.stringify(body),
				headers: utils.headers
			}
		)
	},
	getDB: () => {
		return fetch(`${utils.URL}/logs`, 
			{
				method: 'GET',
				headers: utils.headers
			}
		)
	},
	updateDB: body => {
		fetch(`${utils.URL}/db`, 
			{
				method: 'POST', 
				body: JSON.stringify(body),
				headers: utils.headers
			}
		)
	},
	logBody: (sessao, tipo, acao) => ({sessao, tipo, acao})
}