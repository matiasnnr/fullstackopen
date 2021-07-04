const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findOne({ username: body.username })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    // El token ha sido firmado digitalmente usando una cadena de variable de entorno SECRET como secreto.
    // La firma digital garantiza que solo las partes que conocen el secreto puedan generar un token válido.
    // El valor de la variable de entorno debe establecerse en el archivo .env

    // expressed in seconds or a string describing a time span zeit/ms.
    // Eg: 60s, "2 days", "10h", "7d".
    const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '30d' })

    response
        .status(200)
        .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter