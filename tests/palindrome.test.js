const palindrome = require('../utils/for_testing').palindrome

test('palindrome of a', () => {
    const result = palindrome('a')

    expect(result).toBe('a')
})

// Los casos de prueba individual se definen con la función test. El primer parámetro de la función es la descripción de la prueba como una cadena.
// El segundo parámetro es una función, que define la funcionalidad para el caso de prueba. La funcionalidad para el segundo caso de prueba se ve así:
test('palindrome of react', () => {
    const result = palindrome('react')

    expect(result).toBe('tcaer')
})

test('palindrome of releveler', () => {
    const result = palindrome('releveler')

    expect(result).toBe('releveler')
})