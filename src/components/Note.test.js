import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
// import { prettyDOM } from '@testing-library/dom'
import Note from './Note'

// NB: la consola puede emitir una advertencia si no ha instalado Watchman.
// Watchman es una aplicación desarrollada por Facebook que observa los cambios que se realizan en los archivos.
// El programa acelera la ejecución de las pruebas y al menos a partir de macOS Sierra, ejecutar pruebas en modo watch
// emite algunas advertencias a la consola, que se pueden eliminar instalando Watchman.

// Las instrucciones para instalar Watchman en diferentes sistemas operativos se pueden encontrar en el sitio web oficial de Watchman:
// https://facebook.github.io/watchman/

test('renders content', () => {
    // este sería el caso de uso:
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
    }

    // la prueba renderiza el componente con el método render proporcionado por el react-testing-library:
    const component = render(
        <Note note={note} />
    )

    // muestra el html renderizado por el componente en la consola
    // component.debug()

    // permite buscar una parte más pequeña del componente e imprimir su código HTML.
    // const li = component.container.querySelector('li')
    // console.log(prettyDOM(li))

    // render devuelve un objeto que tiene varias propiedades. Una de las propiedades se llama container y contiene todo el HTML renderizado por el componente.

    // method 1
    // La primera forma usa el método toHaveTextContent para buscar un texto coincidente de todo el código HTML renderizado por el componente.
    // toHaveTextContent es uno de los muchos métodos de "emparejamiento" que proporciona la biblioteca jest-dom.
    expect(component.container).toHaveTextContent(
        'Component testing is done with react-testing-library'
    )

    expect(component.container).toHaveTextContent(
        'make not important'
    )

    // method 2
    // La segunda forma utiliza el método getByText del objeto devuelto por el método render.
    // El método devuelve el elemento que contiene el texto dado. Se produce una excepción si no existe tal elemento.
    // Por esta razón, técnicamente no necesitaríamos especificar ninguna expectativa adicional.
    const element = component.getByText(
        'Component testing is done with react-testing-library'
    )
    expect(element).toBeDefined()

    // method 3
    // La tercera forma es buscar un elemento específico que el componente representa con el método querySelector que recibe un Selector de CSS como parámetro.
    const div = component.container.querySelector('.note')
    expect(div).toHaveTextContent(
        'Component testing is done with react-testing-library'
    )

    // Los dos últimos métodos utilizan los métodos getByText y querySelector para encontrar un elemento que coincida con alguna
    // condición del componente renderizado. Hay numerosos métodos de consulta similares disponibles.

})

// Además de mostrar el contenido, el componente Note también se asegura de que cuando se presiona el botón asociado con la nota,
// se llama a la función del controlador de eventos toggleImportance.
test('clicking the button calls event handler once', () => {
    const note = {
        content: 'Component testing is done with react-testing-library',
        important: true
    }

    const mockHandler = jest.fn()

    const component = render(
        <Note note={note} toggleImportance={mockHandler} />
    )

    const button = component.getByText('make not important')
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(1)
})