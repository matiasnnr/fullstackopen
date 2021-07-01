// heroku url: https://fullstackopen-api-express.herokuapp.com/api/notes

require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')


// Para hacer que express muestre contenido estático, la página index.html y el JavaScript, etc., necesitamos un middleware integrado de express llamado static.
app.use(express.static('build'))

app.use(cors())

// Para acceder a los datos fácilmente, necesitamos la ayuda del json-parser de express, que se usa con el comando app.use(express.json()).
// Sin json-parser, la propiedad body no estaría definida.
// const note = request.body
app.use(express.json())

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

// Implementemos nuestro propio middleware que imprime información sobre cada solicitud que se envía al servidor.
// Middleware es una función que recibe tres parámetros:
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

// El middleware se utiliza así:
app.use(requestLogger)


// let notes = [
//     {
//         id: 1,
//         content: 'HTML is easy',
//         date: '2019-05-30T17:30:31.098Z',
//         important: true
//     },
//     {
//         id: 2,
//         content: 'Browser can execute only Javascript',
//         date: '2019-05-30T18:39:34.091Z',
//         important: false
//     },
//     {
//         id: 3,
//         content: 'GET and POST are the most important methods of HTTP protocol',
//         date: '2019-05-30T19:20:14.298Z',
//         important: true
//     },
//     {
//         id: 4,
//         content: 'PUT is a method of HTTP protocol',
//         date: '2019-05-30T19:20:14.298Z',
//         important: true
//     }
// ]

// ¿Qué está sucediendo exactamente en esa línea de código? notes.map(n => n.id) crea un nuevo array que contiene todos los ids de las notas. Math.max devuelve el valor máximo de los números que se le pasan. Sin embargo, notes.map(n => n.id) es un array, por lo que no se puede asignar directamente como parámetro a Math.max. El array se puede transformar en números individuales mediante el uso de la sintaxis de spread de los "tres puntos", ....
// const generateId = () => {
//     const maxId = notes.length > 0
//         ? Math.max(...notes.map(n => n.id))
//         : 0
//     return maxId + 1
// }

app.get('/', (request, response) => {
    response.send('<h1>Hello World</h1>')
})

app.get('/api/notes', (request, response) => {
    Note.find({}).then(notes => {
        response.json(notes)
        console.log('notes', notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {
    const id = request.params.id
    Note.findById(id)
        .then(note => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
    const body = request.body

    // ahora lo validamos desde el Schema de Mongoose
    // if (body.content === undefined) {
    //     return response.status(400).json({ error: 'content missing' })
    // }

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save()
        .then(savedNote => {
            response.json(savedNote)
        })
        .catch(error => next(error))
})

app.delete('/api/notes/:id', (request, response, next) => {
    const id = request.params.id

    Note.findByIdAndRemove(id)
        .then(result => {
            console.log(result)
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    // Hay un detalle importante con respecto al uso del método findByIdAndUpdate. De forma predeterminada, el parámetro updatedNote del controlador de eventos recibe el documento original sin las modificaciones. Agregamos el parámetro opcional { new: true }, que hará que nuestro controlador de eventos sea llamado con el nuevo documento modificado en lugar del original.
    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})