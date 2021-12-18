import React from 'react'
import { Table } from 'react-bootstrap'
import { Link } from "react-router-dom"


const Users = ({ users }) => {
    return (
        <div>
            <h2>Users</h2>
            <Table striped >
                <tbody>
                    <tr>
                        <th></th>
                        <th>blogs created</th>
                    </tr>
                    {users.map(u =>
                        <><tr>
                            <td><Link to={`/users/${u.id}`}>{u.name}</Link></td>
                            <td>{u.blogs.length}</td>
                        </tr></>
                    )}
                </tbody>
            </Table>
        </div>
    )
}

export default Users