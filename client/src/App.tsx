import React, { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useLogoutMutation } from './generated/graphql'
import { Navbar } from './Navbar'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { ProfileInformation } from './pages/ProfileInformation'
import { Registration } from './pages/Registration'
import { setAccessToken } from './token'

export const App: React.FC = () => {
  const [_loading, setLoading] = useState(true)
  const [logout, client] = useLogoutMutation()
  useEffect(() => {
    fetch('http://localhost:5000/refresh_token', {
      method: 'POST',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setAccessToken(data.accessToken)
        setLoading(false)
      })
  }, [])

  return (
    <>
      <Navbar />
      <div>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/login' element={<Login />} />
          <Route path='/profile' element={<ProfileInformation />} />
        </Routes>
        <button
          onClick={async () => {
            await logout()
            setAccessToken('')
            client!.reset()
          }}
        >
          Logout
        </button>
      </div>
    </>
  )
}

export default App
