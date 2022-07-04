import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Quill from 'quill'
import QuillCursors from 'quill-cursors'
import * as Y from 'yjs'
import { QuillBinding } from 'y-quill'
import { WebsocketProvider } from 'y-websocket'
import { Box,Button } from '@mui/material'
import './Myeditor.css'
import CssBaseline from '@mui/material/CssBaseline'
import { saveAs } from 'file-saver'
import { pdfExporter } from 'quill-to-pdf'
const App = () => {
    const quillRef = useRef()
    const { id } = useParams()
    async function handleExport(e){
        e.preventDefault()
        const delta = quillRef.current.getContents()
        const pdfAsBlob = await pdfExporter.generatePdf(delta)
        saveAs(pdfAsBlob, 'pdf-export.pdf')
    }
    function config() {
        Quill.register('modules/cursors', QuillCursors)
        const board = document.createElement('div')
        board.id = 'editor'
        board.setAttribute('id', 'editor')
        const quill = new Quill(document.querySelector('#editor'), {
            modules: {
                cursors: true,
                toolbar: [
                    // adding some basic Quill content features
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['image', 'code-block'],
                ],
                history: {
                    // Local undo shouldn't undo changes
                    // from remote users
                    userOnly: true,
                },
            },
            placeholder: 'Start collaborating...',
            theme: 'snow', 
        })
        quillRef.current =quill
        const ydoc = new Y.Doc()
        // const persistProvider = new IndexeddbPersistence(id, ydoc)
       const provider = new WebsocketProvider(
            'wss://35.77.189.172',
            id,
            ydoc
        )

        // Define a shared text type on the document
        const ytext = ydoc.getText('quill')
        // "Bind" the quill editor to a Yjs text type.
        const binding = new QuillBinding(
            ytext,
            quill,
            provider.awareness
        )
        // const persistBinding = new QuillBinding(ytext, quill)
        // Remove the selection when the iframe is blurred
        window.addEventListener('blur', () => {
            quill.blur()
        })
        quill.update()
    }
    useEffect(() => {
        config()
    }, [])
    return (
        <>
            <CssBaseline />
            <link
                href="https://cdn.quilljs.com/1.3.6/quill.snow.css"
                rel="stylesheet"
            />
            <Button variant='contained' sx={{mt:'2%',mb:'2%'}} onClick={handleExport} >Download</Button>
            <Box id="editor" />
        </>
    )
}
export default App
