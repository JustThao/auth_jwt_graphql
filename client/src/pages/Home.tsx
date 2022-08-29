import React from 'react'
import { useUsersQuery } from '../generated/graphql'

interface Props {}

export const Home: React.FC<Props> = () => {
  const { data } = useUsersQuery({ fetchPolicy: 'network-only' })
  if (!data) {
    return <div>loading</div>
  }

  const renderUsers = () =>
    data.users.map((user) => (
      <li key={user.id}>
        {user.email}, {user.id}
      </li>
    ))

  return (
    <div>
      <ul>{renderUsers()}</ul>
    </div>
  )
}
