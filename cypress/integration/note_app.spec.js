// Podríamos haber declarado la prueba usando una función de flecha
// describe('Note app', () => {
// it('front page can be opened', () => {
// Sin embargo, Mocha recomienda que las funciones de flecha no se utilicen, porque pueden causar algunos problemas en determinadas situaciones.

// ************ ¡cada prueba comienza desde cero! Las pruebas no comienzan en el estado donde terminaron las pruebas anteriores. ***************
describe('Note app', function () {
    beforeEach(function () {
        // limpiamos la base de datos de pruebas previo a ejecutar los test para tener un ambiente limpio
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYwZTFkZjM4OTc0ZDNiN2NiMDZjMjkzNyIsImlhdCI6MTYyNTUxMzc1NiwiZXhwIjoxNjI4MTA1NzU2fQ.emGWdfvL2W9863NnOR5xzCrdRMAitRgAN2KFtC73mIg'
        cy.request({
            method: 'POST',
            url: 'http://localhost:3001/api/testing/reset',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        const user = {
            name: 'root user',
            username: 'root',
            password: 'sekret'
        }
        // cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.request({
            method: 'POST',
            url: 'http://localhost:3001/api/users/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: user
        })

        cy.visit('http://localhost:3000')
    })

    it('front page can be opened', function () {
        // cy.visit('http://localhost:3000')
        cy.contains('Notes')
        cy.contains('Note app, Department of Computer Science, University of Helsinki 2020')
    })

    it('login form can be opened', function () {
        // cy.visit('http://localhost:3000')
        cy.contains('login').click()
        cy.get('#username').type('root')
        cy.get('#password').type('sekret')
        cy.get('#login-button').click()

        cy.contains('root logged in')
    })

    it('user can log in', function () {
        cy.contains('login').click()
        cy.get('#username').type('root')
        cy.get('#password').type('sekret')
        cy.get('#login-button').click()

        cy.contains('root logged in')
    })

    // Cypress ejecuta las pruebas en el orden en que están en el código.
    // Entonces, primero ejecuta user can log in, donde el usuario inicia sesión.
    // Entonces cypress ejecutará a new note can be created que el bloque beforeEach también inicia sesión.
    // ¿Por qué hacer esto? ¿No inició sesión el usuario después de la primera prueba?
    // No, porque cada prueba comienza desde cero en lo que respecta al navegador.
    // Todos los cambios en el estado del navegador se invierten después de cada prueba.

    describe('when logged in', function () {
        // iniciar sesión desde el formulario
        // beforeEach(function () {
        //     cy.contains('login').click()
        //     cy.get('input:first').type('root')
        //     cy.get('input:last').type('sekret')
        //     cy.get('#login-button').click()
        // })

        // iniciar sesión directamente desde un request HTTP es recomendado x cypress
        // debido a que es más rapido que llenar un formulario
        // y en este caso no necesitamos hacerlo, ya que lo hicimos en una prueba anterior.
        // ahora lo que queremos el probar una funcionalidad del usuario ya logueado
        beforeEach(function () {
            // Si y cuando escribimos nuevas pruebas en nuestra aplicación, tenemos que usar el código de inicio de sesión en varios lugares.
            // Deberíamos convertirlo en un comando personalizado.
            // Los comandos personalizados se declaran en cypress/support/commands.js. El código para iniciar sesión es el siguiente:
            // Usar nuestro comando personalizado es fácil y nuestra prueba se vuelve más limpia:
            cy.login({ username: 'root', password: 'sekret' })
        })

        it('a new note can be created', function () {
            cy.contains('new note').click()
            cy.get('input').type('a note created by cypress')
            cy.contains('save').click()
            cy.contains('a note created by cypress')
        })

        describe('and a note exists', function () {
            beforeEach(function () {
                // si ya verificamos que el formulario funciona al crear una nota en la prueba de arriba
                // entonces ahora podemos simplemente crear una nota directamente a la bd mediante
                // el comando personalizado de abajo
                cy.createNote({
                    content: 'another note cypress',
                    important: false
                })
            })

            it('it can be made important', function () {
                // cy.contains('another note cypress')
                //     .contains('make important')
                //     .click()
                cy.contains('another note cypress')
                    .parent().find('button')
                    .should('contain', 'make important')
                    .click()

                // cy.contains('another note cypress')
                //     .contains('make not important')
                cy.contains('another note cypress')
                    .parent().find('button')
                    .should('contain', 'make not important')
            })
        })

        describe('and several notes exist', function () {
            beforeEach(function () {
                cy.createNote({ content: 'first note', important: false })
                cy.createNote({ content: 'second note', important: false })
                cy.createNote({ content: 'third note', important: false })
            })

            // it('one of those can be made important', function () {
            //     // Cuando está encadenado, el segundo comando contains continúa la búsqueda desde dentro del componente encontrado por el primer comando.
            //     // Si no hubiéramos encadenado los comandos, y en su lugar hubiéramos escrito
            //     // cy.contains('second note')
            //     // cy.contains('make important').click()
            //     // el resultado habría sido totalmente diferente. La segunda línea de la prueba haría clic en el botón de una nota incorrecta:
            //     // ya que hubiese encontrado el primer componente con el texto make important, que habría sido
            //     // first note con el botón make important

            //     // ¡Al codificar pruebas, debe verificar en el corredor de pruebas que las pruebas utilizan los componentes correctos!
            //     cy.contains('second note')
            //         .contains('make important')
            //         .click()

            //     cy.contains('second note')
            //         .contains('make not important')
            // })


            // En la primera línea, usamos el comando parent para acceder al elemento padre del elemento que contiene second note y busque el botón dentro de él.
            // Luego hacemos clic en el botón y verificamos que el texto cambie.

            // Tenga en cuenta que usamos el comando find para buscar el botón. No podemos usar cy.get aquí, porque siempre busca desde la página completa
            // y devolvería los 5 botones en la pagina.

            // Desafortunadamente, ahora tenemos algo de copypaste en las pruebas, porque el código para buscar el botón correcto es siempre el mismo.
            // En este tipo de situaciones, es posible usar el comando as:
            it('other of those can be made important', function () {
                // Ahora la primera línea encuentra el botón correcto y usa as para guardarlo como theButton.
                // Las siguientes líneas pueden usar el elemento nombrado con cy.get('@theButton').
                cy.contains('second note').parent().find('button').as('theButton')
                // cy.get('@theButton') === cy.contains('second note').parent().find('button')
                cy.get('@theButton').click()
                cy.get('@theButton').should('contain', 'make not important')
            })
        })
    })

    // Cypress ejecutará todas las pruebas cada vez de forma predeterminada y, a medida que aumenta el número de pruebas,
    // comienza a consumir bastante tiempo. Al desarrollar una nueva prueba o al depurar una prueba rota,
    // podemos definir la prueba con it.only en lugar de it, de modo que Cypress solo ejecutará la prueba requerida.
    // Cuando la prueba está funcionando, podemos eliminar .only.

    // it.only('login fails with wrong password', function () {
    it('login fails with wrong password', function () {
        cy.contains('login').click()
        cy.get('#username').type('mluukkai')
        cy.get('#password').type('wrong')
        cy.get('#login-button').click()

        // cy.contains('wrong credentials')

        // Podríamos hacer que la prueba asegure que el mensaje de error se representa al componente correcto, o al componente con la clase CSS error:
        // cy.get('.error').contains('wrong credentials')

        // Usar should es un poco más complicado que usar contain, pero permite pruebas más diversas que contain, que funciona solo con contenido de texto.

        // La lista de las aserciones más comunes con las que se pueden usar se puede encontrar aquí. https://docs.cypress.io/guides/references/assertions#Common-Assertions

        // Podemos, por ejemplo, asegurarnos de que el mensaje de error sea rojo y tenga un borde:
        cy.get('.error').should('contain', 'wrong credentials')
            .and('have.css', 'color', 'rgb(255, 0, 0)')
            .and('have.css', 'border-style', 'solid')

        cy.get('html').should('not.contain', 'root logged in')
    })

    // Los comandos de Cypress son como promesas, así que si queremos acceder a sus valores de retorno, tenemos que hágalo usando el comando then.
    // Por ejemplo, la siguiente prueba imprime el número de botones en la aplicación y hace clic en el primer botón:
    it('then example', function () {
        cy.get('button').then(buttons => {
            console.log('number of buttons', buttons.length)
            cy.wrap(buttons[0]).click()
        })
    })

})
