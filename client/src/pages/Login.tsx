import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PrivateProfileDocument,
  PrivateProfileQuery,
  useLoginMutation,
} from '../generated/graphql'
import { setAccessToken } from '../token'

interface Props {}

export const Login: React.FC<Props> = () => {
  const [user, setUser] = useState<{ email: string; pw: string }>({
    email: '',
    pw: '',
  })
  const [login] = useLoginMutation()
  const navigate = useNavigate()
  const { email, pw } = user

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const res = await login({
          variables: { email, pw },
          update: (store, { data }) => {
            if (!data) {
              return null
            }
            store.writeQuery<PrivateProfileQuery>({
              query: PrivateProfileDocument,
              data: {
                __typename: 'Query',
                privateProfile: data.login.user,
              },
            })
          },
        })

        if (res && res.data) {
          setAccessToken(res.data.login.accessToken)
        }

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
      <button type='submit'>login</button>
    </form>
  )
}
