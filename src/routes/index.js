const jsonfile = require('jsonfile')
const file = `${__dirname}/teste.json`

const express = require('express')
const router = express.Router()

const get = router.get('/', (req, res, next) => {
	//TODO: DESCOBRIR COMO PEGAR CAMINHO DO ARQUIVO JSON
	jsonfile.readFile(file)
	.then(obj => (
			res.status(200).send({
				title: 'node store API',
				data: obj,
				version: '0.0.1'
			})
		)
	)
  .catch(error => console.error(error))
})

module.exports = router;
