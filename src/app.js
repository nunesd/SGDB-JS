const express = require('express')
const bodyParser = require('body-parser')
const index = require('./routes/index')
const fs = require("fs")
const jsonfile = require('jsonfile')

var cors = require('cors')

const app = express()
app.use(cors())

const router = express.Router()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))



const put = router.put('/:id', (req, res, next) => {
	const id = req.params.id
	res.status(200).send({ id: id, item: req.body })
})

const del = router.delete('/:id', (req, res, next) => {
	res.status(200).send(req.bod)
})

const log = router.post('/loge', (req, res, next) => {
	const file = `${__dirname}/log.json`
	const body = req.body
	jsonfile.writeFile(file, body, { flag: 'a' })
	.then(() => (
		res.status(200).send({
			success: true
		})
	))
  .catch(error => console.error(error))
})

const writeDocument = body => {
	const file = `${__dirname}/log.json`
	jsonfile.writeFile(file, body)
	.then(() => {})
	.catch(error => console.error(error))
}

const logs = router.post('/', (req, res, next) => {
	const file = `${__dirname}/files/log.json`
	jsonfile.readFile(file)
		.then(obj => {
			obj.logs.push(req.body)
			writeDocument(obj)
		})
		.catch(error => console.error(error))

		res.status(200).send({success: true})
})

const getDB = router.get('/', (req, res, next) => {
	const file = `${__dirname}/files/DB.json`
	jsonfile.readFile(file)
		.then(obj => {
			res.status(200).send(obj)
		})
		.catch(error => console.error(error))
})

const updateDB = router.put('/', (req, res, next) => {
	// const file = `${__dirname}/files/DB.json`
	// jsonfile.readFile(file)
	// 	.then(obj => {
			res.status(200).send('atualizado')
	// 	})
	// 	.catch(error => console.error(error))
})

app.use('/', index)
app.use('/logs', logs)
app.use('/db', getDB)
app.use('/db', updateDB)

module.exports = app
