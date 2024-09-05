"use server"
// components/ProfileServer.js

import Navbar from '../components/navbar';
import SitetableClient from './SitetableClient';
import { getSession } from '../actions';
import { redirect } from 'next/navigation';

export default async function SitetableServer() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect('/login');
    return null; // Ensure the function returns after redirection
  }
    
  const serializedSession = session ? {
    isLoggedIn: session.isLoggedIn,
    ministry: session.ministry,
    firstname: session.firstname,
    lastname: session.lastname,
    bod: session.bod,
    contact: session.contact,
    nationality: session.nationality,
    role: session.role,
    identifier: session.identifier,
    email: session.email
  } : null;
  
  return <SitetableClient session={serializedSession} />;
}
