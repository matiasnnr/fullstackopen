const mongoose = require('mongoose')

// esquema o estructura de la tabla notes en la base de datos de mongo
const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minlength: 5,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    important: Boolean,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

// ayuda a formatear a json la respuesta de mongo
noteSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        // eliminamos ambos elementos del objeto que devuelve mongo
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Note = mongoose.model('Note', noteSchema)

module.exports = Note
// module.exports = mongoose.model('Note', noteSchema)