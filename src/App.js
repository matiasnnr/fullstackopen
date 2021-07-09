import React, { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'
import Togglable from './components/Togglable'
import noteService from './services/notes'
import Notification from './components/Notification'
import loginService from './services/login'

const Footer = () => {

    const footerStyle = {
        color: 'green',
        fontStyle: 'italic',
        fontSize: 16
    }

    return (
        <div style={footerStyle}>
            <br />
            <em>Note app, Department of Computer Science, University of Helsinki 2020</em>
        </div>
    )
}

const App = () => {
    const [notes, setNotes] = useState([])
    // const [newNote, setNewNote] = useState('')
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    // El hook useRef se utiliza para crear una referencia noteFormRef, que se asigna al componente
    // Togglable que contiene el formulario para crear la nota. La variable noteFormRef actúa como referencia al componente.
    // Este hook asegura que se mantenga la misma referencia (ref) en todas las rerenderizaciones del componente.
    const noteFormRef = useRef()

    useEffect(() => {
        if (user) {
            noteService
                .getAll()
                .then(initialNotes => {
                    setNotes(initialNotes)
                })
                .catch(error => console.log('fail', error))
        }
    }, [user])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            noteService.setToken(user.token)
        }
    }, [])

    // ...

    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('logging in with', username, password)

        try {
            const user = await loginService.login({
                username, password,
            })

            window.localStorage.setItem(
                'loggedNoteappUser', JSON.stringify(user)
            )
            noteService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            setErrorMessage('wrong credentials')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    // const handleNoteChange = (event) => {
    //     console.log(event.target.value)
    //     setNewNote(event.target.value)
    // }

    const addNote = (noteObject) => {
        // Ahora podemos ocultar el formulario llamando a noteFormRef.current.toggleVisibility() después de que se haya creado una nueva nota:
        noteFormRef.current.toggleVisibility()
        noteService
            .create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote))
            })
    }

    const toggleImportanceOf = id => {
        // const url = `https://fullstackopen-api-express.herokuapp.com/api/notes/${id}`
        const note = notes.find(n => n.id === id)
        const changedNote = { ...note, important: !note.important }

        noteService.update(id, changedNote)
            .then(returnedNote => {
                setNotes(notes.map(note => note.id !== id ? note : returnedNote))
            })
            .catch(error => {
                console.log('error', error)
                setErrorMessage(
                    `Note '${note.content}' was already removed from server`
                )
                setTimeout(() => {
                    setErrorMessage(null)
                }, 5000)
                setNotes(notes.filter(n => n.id !== id))
            })
    }

    const notesToShow = showAll
        ? notes
        : notes.filter(note => note.important === true)

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />

            {user === null ?
                <Togglable buttonLabel='mostrar login'>
                    <LoginForm
                        username={username}
                        password={password}
                        handleUsernameChange={({ target }) => setUsername(target.value)}
                        handlePasswordChange={({ target }) => setPassword(target.value)}
                        handleSubmit={handleLogin}
                    />
                </Togglable> :
                <div>
                    <p>{user.username} logged in</p>
                    <Togglable buttonLabel="new note" ref={noteFormRef}>
                        <NoteForm createNote={addNote} />
                    </Togglable>
                </div>
            }

            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {notesToShow.map(note =>
                    <Note
                        key={note.id}
                        note={note}
                        toggleImportance={() => toggleImportanceOf(note.id)}
                    />
                )}
            </ul>

            <Footer />
        </div>
    )
}

export default App