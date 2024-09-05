"use client"
import React from 'react'
import styled from 'styled-components'
import Link from 'next/link';

const WelcomeText = styled.div`
  font-size: 40px;
  color: white;
  font-weight: Bold;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
`;


export default function Home() {
  return (
    <>
    <WelcomeText>Welcome to GOB Site Viewer</WelcomeText>
    </>
  )
}
