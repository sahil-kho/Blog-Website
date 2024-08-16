import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Editor from '../editor';

export default function EditPost(){
    const [title,setTitle] = useState('');
    const [summary,setSummary] = useState('');
    const [content,setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect,setRedirect] = useState(false);

    const { id } = useParams();

      useEffect(() => {
        // console.log(id);
        fetch(`http://localhost:4000/posts/${id}`).then(response => {
            response.json().then(postInfo => {
                setTitle(postInfo.title);
                setSummary(postInfo.summary);
                setContent(postInfo.content);
            });
        });

    }, [id]);

    async function updatePost(ev) {
        ev.preventDefault();
         // Remove <p> tags from the content
        const sanitizedContent = content.replace(/<p>/g, '').replace(/<\/p>/g, '');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('summary', summary);
        formData.append('content', sanitizedContent);
        formData.append('id', id);
        if (files.length > 0) {
            formData.append('files', files[0]);
        }



        fetch(`http://localhost:4000/posts`, {
            method: 'PUT',
            body: formData,
            credentials: 'include',
        }).then(response => {
            if (!response.ok) {
                alert('Failed to update post');
            } else {
                setRedirect(true);
            }
        });
    }

    // console.log(id);



    if (redirect) {
        return <Navigate to={`/post/${id}`} />;
    }

    return (
        <form onSubmit={updatePost}>
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
        <button style={{marginTop:'5px'}}>Update post</button>
      </form>
    );
}