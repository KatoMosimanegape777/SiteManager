"use client"
import React, { useState } from 'react';
import Navbar from '../../components/navbar';
import { useFormState, useFormStatus } from "react-dom";
import { createUser } from "../../actions";
import { getSession, getUserById } from '../../actions';
import { redirect } from 'next/navigation';
import '../../globals.css'; // Import the CSS file
import styled from 'styled-components';

const SelectOp = styled.select`
    padding: 8px 16px;
    color: white;
    width: 214px;
    border: 1px solid #3e3d40;
    background-color: #262628;
    border-radius: 10px;
`;

// Defining the initial state for the form
const initialState = { message: null };

export default function AddUser() {

 // const session = getSession();
 // if(!session.isLoggedIn){
  //  redirect('/login')
 // }

  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(createUser, initialState);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    const password = document.getElementById("password").value;

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
    } else {
      setPasswordMismatch(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="title">Add Officer</div>
        <form className="form-container" action={formAction} onSubmit={(e) => {
          if (passwordMismatch) {
            e.preventDefault();
            alert("Passwords do not match");
          }
        }}>
        <SelectOp className="SelectInput" name="ministry" id="ministry">
            <option value="Ministry for State President">Ministry for State President</option>
            <option value="Ministry of Agricultural Development and Food Security">Ministry of Agricultural Development and Food Security</option>
            <option value="Ministry of Basic Education">Ministry of Basic Education</option>
            <option value="Ministry of Communications, Knowledge and Technology">Ministry of Communications, Knowledge and Technology</option>
            <option value="Ministry of Defence, Justice and Security">Ministry of Defence, Justice and Security</option>
            <option value="Ministry of Environment, Natural Resources Conservation and Tourism">Ministry of Environment, Natural Resources Conservation and Tourism</option>
            <option value="Ministry of Finance and Economic Development">Ministry of Finance and Economic Development</option>
            <option value="Ministry of Health and Wellness">Ministry of Health and Wellness</option>
            <option value="Ministry of Infrastructure and Housing Development">Ministry of Infrastructure and Housing Development</option>
            <option value="Ministry of Investment, Trade and Industry">Ministry of Investment, Trade and Industry</option>
            <option value="Ministry of Land Management, Water and Sanitation Services">Ministry of Land Management, Water and Sanitation Services</option>
            <option value="Ministry of Local Government and Rural Development">Ministry of Local Government and Rural Development</option>
            <option value="Ministry of Mineral Resources, Green Technology and Energy Security">Ministry of Mineral Resources, Green Technology and Energy Security</option>
            <option value="Ministry of Nationality, Immigration and Gender Affairs">Ministry of Nationality, Immigration and Gender Affairs</option>
            <option value="Ministry of Tertiary Education, Research, Science and Technology">Ministry of Tertiary Education, Research, Science and Technology</option>
            <option value="Ministry of Transport and Communications">Ministry of Transport and Communications</option>
            <option value="Ministry of Youth Empowerment, Sport and Culture Development">Ministry of Youth Empowerment, Sport and Culture Development</option>
        </SelectOp>
          <input className="input" placeholder='First Name' type="text" name="firstname" id="firstname"/>
          <input className="input" placeholder='Last Name' type="text" name="lastname" id="lastname"/>
          <input className="input" placeholder='Email' type="email" name="email" id="email"/>
          <select className="select" name="role" id="role">
            <option value="Regular">Regular</option>
            <option value="Admin">Admin</option>
          </select>
          <input className="input" placeholder='Password' type="password" name="password" id="password" onChange={handlePasswordChange}/>
          <input className="input" placeholder='Confirm Password' type="password" name="confirmPassword" id="confirmPassword" onChange={handleConfirmPasswordChange}/>
          <input className="input" placeholder='Date of Birth' type='date' name='bod' id='bod'/>
          <input className="input" placeholder='Contact Number' type="text" name="contact" id="contact"/>
          <input className="input" placeholder='Nationality' type="text" name="nationality" id="nationality"/>
          <input className="input" placeholder='Omang / Passport #' type="text" name="identifier" id="identifier"/>
          <button className="save-button" type="submit" aria-disabled={pending}>Save</button>
          {passwordMismatch && (<div className="redtext">Passwords do not match</div>)}
          {state.message && (<div aria-live="polite" role="status" className="bluetext">{state.message}</div>)}
        </form>
      </div>
    </>
  );
}
