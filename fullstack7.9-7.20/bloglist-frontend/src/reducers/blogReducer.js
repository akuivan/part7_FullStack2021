import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
    console.log('state now: ', state)
    console.log('action', action)

    switch (action.type) {
        case 'NEW_BLOG':
            return [...state, action.data]
        case 'INIT_BLOGS':
            return action.data
        case 'LIKE':
            const liked = action.data
            return state.map(blog =>
                blog.id !== liked.id ? blog : liked)
        case 'DELETE_BLOG':
            const deleted = action.blogToRemove
            return state.filter(blog =>
                blog.id !== deleted.id)
        default:
            return state
    }
}

export const create = (content) => {
    return async dispatch => {
        const newBlog = await blogService.create(content)
        dispatch({
            type: 'NEW_BLOG',
            data: newBlog,
        })
    }
}

export const deleteBlog = (id) => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        const blogToRemove = blogs.find(b => b.id === id)
        const ok = window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}`)

        if (ok) {
            await blogService.remove(id)
            dispatch({
                type: 'DELETE_BLOG',
                blogToRemove
            })
        }
    }
}


export const likeABlog = (id) => {
    return async dispatch => {
        const blogs = await blogService.getAll()

        const blogToChange = blogs.find(b => b.id === id)
        const changedBlog = {
            ...blogToChange,
            user: blogToChange.user.id,
            likes: blogToChange.likes + 1
        }
        let data = await blogService.update(changedBlog)
        // change data in a way that user info is preserved
        // and doesn't disappear from listing after liking
        data = { ...blogToChange, likes: blogToChange.likes + 1 }

        dispatch({
            type: 'LIKE',
            data
        })
    }
}

export const initializeBlogs = () => {
    return async dispatch => {
        const blogs = await blogService.getAll()
        dispatch({
            type: 'INIT_BLOGS',
            data: blogs,
        })
    }
}

export default blogReducer