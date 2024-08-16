import React, { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import Editor from '../editor'
import { Navigate } from 'react-router-dom';


 export default function CreatePost() {
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect,setRedirect] = useState(false);

    async function createNewPost(ev) {
        ev.preventDefault();

        // Remove <p> tags from the content
        const sanitizedContent = content.replace(/<p>/g, '').replace(/<\/p>/g, '');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('summary', summary);
        formData.append('content', sanitizedContent);
        if (files.length > 0) {
            formData.append('files', files[0]);
        }

        const response = await fetch('http://localhost:4000/posts', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            alert('Failed to create post');
        } else {
            setRedirect(true);
        }
    }


    if (redirect) {
        return <Navigate to={'/'} />;
    }
    return (
        <form onSubmit={createNewPost}>
        <input type="title"
               placeholder={'Title'}
               value={title}
               onChange={ev => setTitle(ev.target.value)} />
        <input type="summary"
               placeholder={'Summary'}
               value={summary}
               onChange={ev => setSummary(ev.target.value)} />
        <input type="file"
               onChange={ev => setFiles(ev.target.files)} />
        <Editor value={content} onChange={setContent} />
        <button style={{marginTop:'5px'}}>Create post</button>
      </form>
    );
}
