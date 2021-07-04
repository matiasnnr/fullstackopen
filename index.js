const app = require('./app') // la aplicación Express real
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')

// creamos el servicio con todas las funcionalidades que declaramos en app.js
const server = http.createServer(app)

// dejamos a la aplicación escuchando en el puerto configurado en las variables de entorno
server.listen(config.PORT, () => {
    logger.info(`Server running on port ${config.PORT}`)
})