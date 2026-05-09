import { useState } from 'react'
import axios from 'axios'
import './App.css'
import { useEffect } from 'react'

function App() {
  const[users, setUsers] = useState([])

  useEffect(()=>{
    axios.get('api/users')
    .then(response => {
      setUsers(response.data)
    })
  },[])

  return (
    <>
      <div>
        <h1>Users List</h1>
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
