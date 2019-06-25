const express = require('express')
const bodyParser = require('body-parser')
const index = require('./routes/index')
const fs = require("fs")
const jsonfile = require('jsonfile')
const writeJsonFile = require('write-json-file');
 
(async () => {
    await writeJsonFile('foo.json', {foo: true});
})();

var cors = require('cors')

const app = express()
app.use(cors())

const router = express.Router()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const findElemWithIndex = (array, column, value) => {
	let finded = null;
	array.forEach((elem, index) => {
		if(elem.cod === value) {
			finded = index
		}
	});
	return finded
}


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

const writeLogDocument = body => {
	const file = `${__dirname}/files/log.json`
	jsonfile.writeFile(file, body)
	.then(() => {})
	.catch(error => console.error(error))
}

const writeDocument = (file,body) => {
	jsonfile.writeFile(file, body)
	.then(() => {})
	.catch(error => console.error(error))
}

async function teste(body) {
	const file = `${__dirname}/files/DB.json`
    await writeJsonFile(file, body);
}

const readDocument = (file) => {
	return jsonfile.readFile(file)
	
}

const logs = router.post('/', (req, res, next) => {
	const file = `${__dirname}/files/log.json`
	jsonfile.readFile(file)
		.then(obj => {
			obj.logs.push(req.body)
			writeLogDocument(obj)
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

	const { data } = req.body;
	const file = `${__dirname}/files/DB.json`
	
	data.map((elem, index) => {
		readDocument(file).then(myDB => {
			if(elem.action === 'UPDATE') {
				const i = findElemWithIndex(myDB.data, 'cod', elem.cod)
				// res.status(200).send(i)
				if(i !== null) {
					myDB.data[i].name = elem.name
					writeDocument(file, myDB)
				}
			} else if (elem.action === "POST") {
				let copyDB = myDB
				copyDB.data.push({cod: elem.cod, name: elem.name, status: 'FREE'})
				// res.status(200).send('POST')
				writeDocument(file, copyDB)
			} else {
				let copyDB = myDB.data.filter(el => el.cod !== elem.cod)
				writeDocument(file, {data: copyDB})
				// res.status(200).send('DELETE')
			}
		})
		.catch(error => console.error(error))		
	})

	readDocument(file).then(myDB => {
		res.status(200).send({data: myDB})
	})
	// const file = `${__dirname}/files/DB.json`
	// jsonfile.readFile(file)
	// 	.then(obj => {
	// 	})
	// 	.catch(error => console.error(error))
})

app.use('/', index)
app.use('/logs', logs)
app.use('/db', getDB)
app.use('/db', updateDB)

module.exports = app
