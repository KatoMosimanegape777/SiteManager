"use client";
import styled from 'styled-components';

export default function ProfileClient({ session }) {
  if (!session) {
    return <div>Loading...</div>; // Add a loading state or handle the case where session is not available
  }

  return (
    <div>
      <TitleText>Profile</TitleText>
      <MainContent>
        <ProfileContent>
          <OfficerInfo>{session.ministry}</OfficerInfo>
          <OfficerInfo>Name: {session.firstname} {session.lastname}</OfficerInfo>
          <OfficerInfo>Email: {session.email}</OfficerInfo>
          <OfficerInfo>Role: {session.role}</OfficerInfo>
          <OfficerInfo>Date of Birth: {session.bod}</OfficerInfo>
          <OfficerInfo>Contact: {session.contact}</OfficerInfo>
          <OfficerInfo>Nationality: {session.nationality}</OfficerInfo>
          <OfficerInfo>Identifier: {session.identifier}</OfficerInfo>
        </ProfileContent>
      </MainContent>
    </div>
  );
}

const TitleText = styled.div`
  font-size: 30px;
  margin: 10px 0;
  color: white;
  font-weight: bold;
  text-align: center;
`;
const OfficerInfo = styled.div`
  padding: 8px 16px;
  font-size:12px;
  color: gray;
  width: 210px;
  border-bottom: 1px solid #3e3d40;
  background-color: #262628;
  border-radius: 10px 10px 0 0;
`;

const ProfileContent = styled.div`
  background-color: #18181b;
  width: 500px;
  padding: 10px;
  margin-top: -450px;
  border-radius: 20px;
  border: 1px solid #272628;
  max-height: 730px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
`;

const MainContent = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;