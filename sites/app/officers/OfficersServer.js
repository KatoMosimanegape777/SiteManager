"use server"

import Navbar from '../components/navbar';
import OfficersClient from './OfficersClient';
import { getSession } from '../actions';
import { redirect } from 'next/navigation';

export default async function OfficersServer() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect('/login');
    return null; // Ensure the function returns after redirection
  }
  
  const serializedSession = session ? {
    isLoggedIn: session.isLoggedIn,
    firstname: session.firstname,
    lastname: session.lastname,
    bod: session.bod,
    contact: session.contact,
    nationality: session.nationality,
    role: session.role,
    identifier: session.identifier,
    email: session.email
  } : null;

  return <OfficersClient session={serializedSession} />;
}
