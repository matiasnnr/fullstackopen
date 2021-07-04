const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.get('/', async (request, response) => {
    const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
    response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
    const note = await Note.findById(request.params.id)
    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
})

notesRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findById(request.payload.id)

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
        user: user._id
    })

    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    await user.save()

    response.json(savedNote)
})

notesRouter.delete('/:id', async (request, response) => {

    // con async/await y try/catch
    // try {
    //     await Note.findByIdAndRemove(request.params.id)
    //     response.status(204).end()
    // } catch (exception) {
    //     next(exception)
    // }

    // usando express async errors podemos controlarlo mejor
    // Debido a la biblioteca, ya no necesitamos la llamada next(exception).
    // La biblioteca se encarga de todo lo que hay debajo del capó. Si ocurre una excepción en una ruta async,
    // la ejecución se pasa automáticamente al middleware de manejo de errores.
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

notesRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

module.exports = notesRouter