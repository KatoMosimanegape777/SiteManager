"use client"; // Ensure this is the first line
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logoImg from '../loginlogo.png';
import { loginUser } from "../actions";
import { useState } from "react";
import '../login.css'; // Import the CSS file

export default function Login() {
  const [state, setState] = useState({ message: null });
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await loginUser(null, formData);
    
    if (response.user) {
      router.push(`/sitetable`);
    } else {
      setState({ message: response.message });
    }
  };

  return (
    <div className="center-container">
      <div className="login-container">
        <div className="logo-container">
          <Image src={logoImg} alt="Logo" width={150} height={150} />
        </div>
        <form className="form-container" onSubmit={handleSubmit}>
          <input className="login-input" required placeholder="Your email" type="email" name="email" id="email" />
          <input className="login-input" required placeholder="Password" type="password" name="password" id="password" />
          {state.message && (<p className="redtext">{state.message}</p>)}
          <button className="login-button" type="submit">LOGIN</button>
        </form>
      </div>
    </div>
  );
}
