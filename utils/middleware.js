const logger = require('./logger')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    logger.info('Method:', request.method)
    logger.info('Path:  ', request.path)
    logger.info('Body:  ', request.body)
    logger.info('--------------------------------------')
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        })
    }

    logger.error(error.message)
    // si no se cumple ninguna condición anterior pasamos el error al sgte middleware en la pila, de lo contrario la app quedará colgada
    next(error)
}

const tokenHandler = (request, response, next) => {
    let pathsWithoutToken = []

    if (process.env.NODE_ENV === 'test') {
        pathsWithoutToken = ['/api/login', '/api/register', 'api/testing/reset']
    } else {
        pathsWithoutToken = ['/api/login', '/api/register']
    }

    // console.log('pathsWithoutToken', pathsWithoutToken)

    // si intentamos loguearnos no validamos el token, pero para todas las otras rutas hacemos la validación con el middleware
    // después si el token es válido ingresamos la información del token en el request a través del objeto payload
    // de manera que todas las rutas que exijan token puedan obtener la información desde request.payload
    if (pathsWithoutToken.includes(request.path)) {
        next()
    } else {
        if (!request.get('authorization')) return response.status(401).json({ error: 'invalid token' })

        const authorization = request.get('authorization')
        // const bearer = authorization.split(' ')[0].trim()
        const token = authorization.split(' ')[1].trim()

        jwt.verify(token, process.env.SECRET, (error, payload) => {
            if (error) {
                return response.status(401).json({ error: 'invalid token' })
            }

            // si el token es válido le pasamos la información del token al request dentro del objeto payload
            request.payload = payload
            next()
        })
    }
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenHandler
}