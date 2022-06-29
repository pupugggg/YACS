import React, { useState } from 'react'
import { EditorState,convertToRaw,convertFromRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './App.css'
const App = () => {
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    )
    const handleEditorStateChange = (e) => {
        setEditorState(e)
        console.log(convertFromRaw(convertToRaw(e.getCurrentContent())))
    }
    return (
        <>
            <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorStateChange}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
            />
        </>
    )
}
export default App
