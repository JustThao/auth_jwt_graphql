import React from 'react'
import { usePrivateProfileQuery } from '../generated/graphql'

interface Props {}

export const ProfileInformation: React.FC<Props> = () => {
  const { data, loading, error } = usePrivateProfileQuery({
    fetchPolicy: 'network-only',
  })
  if (loading) {
    return <div>loading</div>
  }
  if (error) {
    console.log(error)
    return <div>not logged in</div>
  }

  if (!data) {
    return <div>no data</div>
  }
  return <div>{data.privateProfile?.email}</div>
}
