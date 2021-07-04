const config = require('./utils/config')
const express = require('express')
require('express-async-errors') // permite eliminar el uso de los try/catch para controlar los errores con async/await
const app = express()
const cors = require('cors')
// enrutadores
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
// nuestros middlewares personalizados
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// usamos el log del logger que creamos
logger.info('connecting to', config.MONGODB_URI)

// nos conectamos a la base de datos de mongo
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

// MIDDLEWARES
// para problemas de cors
app.use(cors())
// para poder mostrar archivos estáticos, por ejemplo la aplicación de react desde el servidor
app.use(express.static('build'))
// para poder responder a las solicitudes con formatos json
app.use(express.json())
// muestra un log cada vez que se ejecuta un método o se llama a un endpoint
app.use(middleware.requestLogger)
// permite validar el token y mostrar un error en caso de que sea inválido
app.use(middleware.tokenHandler)

// El enrutador que definimos anteriormente (notesRouter) se usa si la URL de la solicitud comienza con /api/notes. Por esta razón,
// el objeto notesRouter solo debe definir las partes relativas de las rutas, es decir, la ruta vacía / o solo el parámetro /:id.
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// para mostrar un mensaje cuando no se encuentra la ruta en la solicitud
app.use(middleware.unknownEndpoint)
// para controlar los errores de las peticiones y mostrarlas en pantalla
app.use(middleware.errorHandler)

module.exports = app