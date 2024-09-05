
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logoImg from '../logo_1.png';
import { getSession } from '../actions';
import styles from '../Navbar.module.css';
import LogoutForm from './logout';

export default async function Navbar() {
  const session = await getSession();
  
  //console.log("Session data:", session); // Add this line

  return (
    <div className={styles.navbarContainer}>
      {session.isLoggedIn && 
      <>
      <div className={styles.logoContainer}>
        <Link href="/sitetable">
          <Image src={logoImg} alt="Logo" width={40} height={40}  />
        </Link>
      </div>
      <div className={styles.navLinks}>
        <Link
          href="/sitetable"
          className={`${styles.navLink}`}
        >
          Sites
        </Link>
        {session.role === 'Admin' && (
          <Link
            href="/officers"
            className={`${styles.navLink}`}
          >
            Officers
          </Link>
        )}
        <Link
          href="/profile"
          className={`${styles.navLink}`}
        >
          Profile
        </Link>
      </div>
      <LogoutForm  className={styles.logoutLink} />
      </>}
    </div>
  );
}