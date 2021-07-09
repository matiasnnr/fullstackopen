import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Togglable from './Togglable'

describe('<Togglable />', () => {
    let component

    // La función beforeEach se llama antes de cada prueba, que luego convierte el componente Togglable en la variable component.
    beforeEach(() => {
        component = render(
            <Togglable buttonLabel="show...">
                <div className="testDiv" />
            </Togglable>
        )
    })

    // La primera prueba verifica que el componente Togglable representa su componente hijo <div className="testDiv" />
    // validamos si renderiza el componente que le pasamos por children props
    test('renders its children', () => {

        // muestra el html renderizado por el componente en la consola
        // component.debug()

        expect(
            component.container.querySelector('.testDiv')
        ).toBeDefined()
    })

    test('at start the children are not displayed', () => {
        const div = component.container.querySelector('.togglableContent')

        expect(div).toHaveStyle('display: none')
    })

    test('after clicking the button, children are displayed', () => {
        // El componente contiene dos botones, pero como querySelector devuelve el primer botón de coincidencia, sucede que obtenemos el botón que queríamos.
        // clickea el botón para mostrar el siguiente componente
        // ya que ejecuta toggleVisibility que cambia la variable visible de false a true
        const button = component.getByText('show...')
        fireEvent.click(button)

        // ahora valida eque el componente con className="togglableContent" no tenga display none
        const div = component.container.querySelector('.togglableContent')
        expect(div).not.toHaveStyle('display: none')
    })

    // Agreguemos también una prueba que se puede utilizar para verificar que el contenido visible se puede ocultar haciendo clic en el segundo botón del componente:
    test('toggled content can be closed', () => {
        // muestra el contenido del segundo div al hacerlo visible
        const button = component.container.querySelector('button')
        fireEvent.click(button)

        // seleccionamos el segundo botón del componente
        // Definimos un selector que devuelve el segundo botón button:nth-child(2).
        // No es un acierto depender del orden de los botones en el componente, y se recomienda buscar los elementos en función de su texto:
        // const closeButton = component.container.querySelector(
        //     'button:nth-child(2)'
        // )

        const closeButton = component.getByText('cancel')
        // volvemos a dejar no visible este div
        fireEvent.click(closeButton)

        // verificamos que realmente ahora el div tiene de nuevo display none
        const div = component.container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
    })

})