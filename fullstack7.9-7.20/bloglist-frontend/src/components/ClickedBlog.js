import { useParams } from "react-router-dom"
import React, { useState } from 'react'
import blogService from '../services/blogs'

const ClickedBlog = ({ blogs, handleLike }) => {
    const [comment, setComment] = useState('')
    const id = useParams().id
    const blog = blogs.find(b => b.id === id)

    if (!blog) {
        return null
    }

    const comments = blog.comments

    const addComment = async (event) => {
        event.preventDefault()
        try {
            await blogService.createComment(comment, blog)
            setComment('')
        } catch (exception) {
            console.log('error: ', exception)
        }
    }

    return (
        <div>
            <h2>{blog.title}</h2>
            <a href={blog.url}>{blog.url}</a>
            <div>{blog.likes} likes
                <button onClick={() => handleLike(blog.id)}>like</button>
            </div>
            <div>
                added by {blog.author}
            </div>

            <form onSubmit={addComment}>
                <input
                    value={comment}
                    onChange={({ target }) => setComment(target.value)}
                />
                <button type='submit'>add comment</button>
            </form>
            <h3>comments</h3>
            <ul>
                {comments.map(c =>
                    <li key={c}>
                        {c}
                    </li>
                )}
            </ul>
        </div >
    )
}

export default ClickedBlog
