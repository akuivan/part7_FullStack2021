import storage from './utils/storage'
import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import NewBlog from './components/NewBlog'
import Users from './components/Users'
import User from './components/User'

import loginService from './services/login'
import userService from './services/users'

import { useDispatch, useSelector } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { create, initializeBlogs, likeABlog, deleteBlog } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'
import {
  BrowserRouter as Router,
  Switch, Route, Link
} from 'react-router-dom'
import ClickedBlog from './components/ClickedBlog'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'



const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const blogFormRef = React.createRef()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const user = storage.loadUser()
    dispatch(setUser(user))
  }, [])

  //tieto kaikista käyttäjistä
  const [users, setUsers] = useState([])
  useEffect(() => {
    userService
      .getAll()
      .then(users => {
        setUsers(users)
      })
  }, [])

  const user = useSelector(state => state.user)
  const blogs = useSelector(state => state.blogs)

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      setUsername('')
      setPassword('')

      dispatch(setUser(user))
      dispatch(setNotification(`${user.name} welcome back!`))
      storage.saveUser(user)
    } catch (exception) {
      dispatch(setNotification('wrong username/password', 'error'))
    }
  }

  const createBlog = async (blog) => {
    try {
      dispatch(create(blog))
      blogFormRef.current.toggleVisibility()
      dispatch(setNotification(`a new blog '${blog.title}' by ${blog.author} added!`))
    } catch (exception) {
      console.log(exception)
    }
  }

  const handleLike = (id) => {
    dispatch(likeABlog(id))
  }

  const handleRemove = (id) => {
    dispatch(deleteBlog(id))
  }

  const handleLogout = () => {
    dispatch(setUser(null))
    storage.logoutUser()
  }


  if (!user) {
    return (
      <div>
        <h2>login to application</h2>

        <Notification />

        <Form onSubmit={handleLogin}>
          <Form.Group>
            <Form.Label>username:</Form.Label>
            <Form.Control
              id='username'
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
            <Form.Label>password:</Form.Label>
            <Form.Control
              id='password'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
            <Button variant="primary" type="submit" id='login'>
              login
            </Button>
          </Form.Group>
        </Form>

      </div>
    )
  }

  const byLikes = (b1, b2) => b2.likes - b1.likes

  const padding = {
    padding: 5
  }

  return (
    <div className="container">
      <Router>
        <Notification />
        <div style={{ backgroundColor: 'powderblue' }}>
          <Link style={padding} to="/">blogs</Link>
          <Link style={padding} to="/users">users</Link>

          {user.name} logged in <Button
            variant="secondary" onClick={handleLogout}>logout</Button>
        </div>

        <h2>blog app</h2>

        <Switch>
          <Route path="/blogs/:id">
            <ClickedBlog blogs={blogs} handleLike={handleLike} />
          </Route>
          <Route path="/users/:id">
            <User users={users} />
          </Route>
          <Route path="/users">
            <Users users={users} />
          </Route>
          <Route path="/">
            <Togglable buttonLabel='create new blog' ref={blogFormRef}>
              <NewBlog createBlog={createBlog} />
            </Togglable>

            {blogs.sort(byLikes).map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                handleLike={handleLike}
                handleRemove={handleRemove}
                own={user.username === blog.user.username}
              />
            )}
          </Route>
        </Switch>

      </Router>
    </div>
  )
}

export default App