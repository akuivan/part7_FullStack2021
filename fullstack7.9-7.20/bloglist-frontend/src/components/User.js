import React from 'react'
import { useParams } from "react-router-dom"
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

const User = ({ users }) => {
    const id = useParams().id
    const user = users.find(u => u.id === id)

    if (!user) {
        return null
    }

    return (
        <div>
            <h2>{user.name}</h2>
            <Card border="info" style={{ width: '18rem' }}>
                <Card.Header>added blogs</Card.Header>
                <ListGroup variant="flush">
                    {user.blogs.map(b =>
                        <ListGroup.Item>
                            {b.title}
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Card>
        </div>
    )
}

export default User