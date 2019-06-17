const express = require('express')
const bodyParser = require('body-parser')
const index = require('./routes/index')
var cors = require('cors')

const app = express()
app.use(cors())

const router = express.Router()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const create = router.post('/', (req, res, next) => {
	res.status(200).send(req.body)
})

const put = router.put('/:id', (req, res, next) => {
	const id = req.params.id
	res.status(200).send({ id: id, item: req.body })
})

const del = router.delete('/:id', (req, res, next) => {
	res.status(200).send(req.bod)
})

app.use('/', index)
app.use('/products', create)
app.use('/products', put)
app.use('/products', del)

module.exports = app
