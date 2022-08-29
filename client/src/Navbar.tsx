import React from 'react'
import { Link } from 'react-router-dom'

interface Props {}

export const Navbar: React.FC<Props> = () => {
  return (
    <nav>
      <Link to='/'>home</Link>
      <ul>
        <li>
          <Link to='/registration'>Registration</Link>
        </li>
        <li>
          <Link to='/login'>Login</Link>
        </li>
        <li>
          <Link to='/profile'>Profile information</Link>
        </li>
      </ul>
    </nav>
  )
}
