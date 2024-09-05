"use client"
import React from 'react'
import { logout } from '../actions'

export default function LogoutForm() {
  return (
    <form action={logout}>
        <button className='logoutLink'>LogOut</button>
    </form>
  )
}
