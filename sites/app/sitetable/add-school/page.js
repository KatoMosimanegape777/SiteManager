"use client"
import React from 'react';
import Navbar from '../../components/navbar';
import { useFormState, useFormStatus } from "react-dom";
import { createSchool } from "../../actions";
import { getSession, getUserById } from '../../actions';
import { redirect } from 'next/navigation';
import '../../globals.css'; // Import the CSS file

// Defining the initial state for the form
const initialState = { message: null };

export default function AddSchool() {

 // const session = getSession();
  //if(!session.isLoggedIn){
 //   redirect('/login')
  //}

  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(createSchool, initialState);

  return (
    <>
      <div className="container">
        <div className="title">Add Schools</div>
        <form className="form-container" action={formAction}>
          <input className="input" placeholder='Site Name' type="text" name="sitename" id="sitename"/>
          <input className="input" placeholder='Location' type="text" name="location" id="location"/>
          <input className="input" placeholder='Technology' type="text" name="technology" id="technology"/>
          <input className="input" placeholder='ADSL/PW/VLAN' type='text' name='adslPwVLan' id='adslPwVLan'/>
          <input className="input" placeholder='Wan Address' type="text" name="wanAddress" id="wanAddress"/>
          <input className="input" placeholder='Admin Subnet' type="text" name="adminSubnet" id="adminSubnet"/>
          <input className="input" placeholder='GDN Loopback' type="text" name="GDNLoopback" id="GDNLoopback"/>
          <input className="input" placeholder='EDN Loopback' type="text" name="EDNLoopback" id="EDNLoopback"/>
          <input className="input" placeholder='EDN Gateway' type="text" name="EDNGateway" id="EDNGateway"/>
          <input className="input" placeholder='Switch Model' type="text" name="switchModel" id="switchModel"/>
          <button className="save-button" type="submit" aria-disabled={pending}>Save</button>
          {state.message && (<div aria-live="polite" role="status" className="bluetext">{state.message}</div>)}
        </form>
      </div>
    </>
  )
}
