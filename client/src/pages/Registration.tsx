import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegisterMutation } from '../generated/graphql'

interface Props {}

export const Registration: React.FC<Props> = () => {
  const [user, setUser] = useState<{ email: string; pw: string }>({
    email: '',
    pw: '',
  })
  const [register] = useRegisterMutation()
  const navigate = useNavigate()
  const { email, pw } = user

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const res = await register({
          variables: { email, pw },
        })
        console.log(res)
        navigate('/')
      }}
    >
      <div>
        <input
          type='text'
          value={email}
          placeholder='email@gmail.de'
          onChange={(e) => {
            setUser((prevState) => ({ ...prevState, email: e.target.value }))
          }}
        />
      </div>
      <div>
        <input
          type='password'
          value={pw}
          placeholder='password'
          onChange={(e) => {
            setUser((prevState) => ({ ...prevState, pw: e.target.value }))
          }}
        />
      </div>
      <button type='submit'>register</button>
    </form>
  )
}
