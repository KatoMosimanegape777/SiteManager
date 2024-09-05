"use client"
import React from 'react'
import styled from 'styled-components';
import Navbar from '../../components/navbar';
import { useFormState, useFormStatus } from "react-dom";
import { createSite } from  "../../actions";
import { getSession, getUserById } from '../../actions';
import { redirect } from 'next/navigation';
import './addsite.css'; // Import the CSS file

// Defining the initial state for the form
const initialState = { message: null };

export default function AddSite() {
  
 // const session = getSession();
  //if(!session.isLoggedIn){
 //   redirect('/login')
 // }

  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(createSite, initialState);

  return (
    <>
      <div className="container">
        <div className='title'>Add Site</div>
        <form  className="form-container" action={formAction}>
        <select className="SelectInput" name="ministry" id="ministry">
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
        </select>
        <input className="input" placeholder='Department' type="text" name="department" id="department"/>
          <input className="input" placeholder='Site Location' type="text" name="sitelocation" id="sitelocation"/>
          <input className="input" placeholder='Site Name' type="text" name="sitename" id="sitename"/>
          <input className="input" placeholder='Node Address' type="text" name="nodeAddress" id="nodeAddress"/>
          <input className="input" placeholder='Remote Address' type="text" name="remoteaddress" id="remoteaddress"/>
          <input className="input" placeholder='VLAN ID' type="text" name="vlanID" id="vlanID"/>
          <input className="input" placeholder='PW Number' type="text" name="pwNumber" id="pwNumber"/>
          <input className="input" placeholder='Connection Type' type="text" name="connectionType" id="connectionType"/>
          <input className="input" placeholder='Bandwidth' type="text" name="bandwidth" id="bandwidth"/>
          <input className="input" placeholder='Router Model' type="text" name="routerModel" id="routerModel"/>
          <input className="input" placeholder='Router ISO Version' type="text" name="routerISO" id="routerISO"/>
          <input className="input" placeholder='Router Serial No.' type="text" name="routerSerialNumber" id="routerSerialNumber"/>
          <input className="input" placeholder='Switch Model' type="text" name="switchModel" id="switchModel"/>
          <input className="input" placeholder='Switch ISO Version' type="text" name="switchISO" id="switchISO"/>
          <input className="input" placeholder='Node' type="text" name="node" id="node"/>
          <input className="input" placeholder='Area Number' type="text" name="areaNumber" id="areaNumber"/>
          <button className="save-button" type="submit" aria-disabled={pending}>Save</button>
          {state.message && (<div aria-live="polite" role="status" className="bluetext">{state.message}</div>)}
        </form>
      </div>
    </>
  )
}