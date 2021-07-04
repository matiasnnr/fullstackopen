const http = require('http')
var https = require('https')

const app = http.createServer((request, response) => {


    function getCharacters() {
        // eslint-disable-next-line no-unused-vars
        return new Promise((resolve, reject) => {
            let body = ''
            https.get('https://rickandmortyapi.com/api/character', (res) => {
                res.setEncoding('utf8')
                res.on('data', data => {
                    body += data
                })
                res.on('end', () => {
                    body = JSON.parse(body)
                    // console.log(body);
                    resolve(body)
                })
            })
        })
    }

    getCharacters().then(body => {
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify(body))
    })
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)