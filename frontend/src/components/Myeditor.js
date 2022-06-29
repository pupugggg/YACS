import React, { useState,useCallback } from 'react'
// Import the Slate editor factory.
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
function MyEditor() {
  const [editor] = useState(() => withReact(createEditor()))
  const renderElement = useCallback(({ attributes, children, element }) => {
    switch (element.type) {
      case 'quote':
        return <blockquote {...attributes}>{children}</blockquote>
      case 'link':
        return (
          <a {...attributes} href={element.url}>
            {children}
          </a>
        )
      default:
        return <p {...attributes}>{children}</p>
    }
  }, [])

  return (
    // <Slate editor={editor}>
    //   <Editable renderElement={renderElement} />
    // </Slate>
    null
  )
}

export default MyEditor
