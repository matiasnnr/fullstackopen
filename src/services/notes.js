import axios from 'axios'
// const baseUrl = 'https://fullstackopen-api-express.herokuapp.com/api/notes'

// Debido a nuestra situación, tanto el frontend como el backend están en la misma dirección, podemos declarar baseUrl como una URL relativa. Esto significa que podemos omitir la parte que declara el servidor.
const baseUrl = 'http://localhost:3001/api/notes'

// const getAll = () => {
//     const request = axios.get(baseUrl)
//     return request.then(response => response.data)
// }

let token = null

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAll = () => {
    const config = {
        headers: { Authorization: `Bearer ${JSON.parse(window.localStorage.getItem('loggedNoteappUser')).token}` },
    }

    const request = axios.get(baseUrl, config)
    const nonExisting = {
        id: 10000,
        content: 'This note is not saved to server',
        date: '2019-05-30T17:30:31.098Z',
        important: true,
    }
    return request.then(response => response.data.concat(nonExisting))
}

const create = async newObject => {
    const config = {
        headers: { Authorization: token },
    }

    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const update = (id, newObject) => {
    const config = {
        headers: { Authorization: token },
    }
    const request = axios.put(`${baseUrl}/${id}`, newObject, config)
    return request.then(response => response.data)
}

export default { getAll, create, update, setToken }