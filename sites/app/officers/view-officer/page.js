"use client";

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../../components/navbar';
import { useRouter } from 'next/navigation';
import { getUserById, updateUser, deleteUser } from '../../actions';

export default function ViewOfficer() {
  const router = useRouter();
  const { id } = router.query;
  const [isEditing, setIsEditing] = useState(false);
  const [officerData, setOfficerData] = useState(null);

  useEffect(() => {
    const fetchOfficer = async () => {
      if (id) {
        const response = await getUserById(id);
        if (response.success) {
          setOfficerData(response.user);
        } else {
          alert(response.message);
        }
      }
    };

    fetchOfficer();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const response = await updateUser(officerData);
    if (response.success) {
      setIsEditing(false);
    } else {
      alert(response.message);
    }
  };

  const handleDelete = async () => {
    const response = await deleteUser(officerData._id);
    if (response.success) {
      router.push('/officers');
    } else {
      alert(response.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfficerData({ ...officerData, [name]: value });
  };

  if (!officerData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Container>
        <Title>View Officer</Title>
        <FormContainer>
          <Input
            placeholder='First Name'
            type="text"
            name="firstname"
            value={officerData.firstname}
            onChange={handleChange}
            readOnly={!isEditing}
          />
          <Input
            placeholder='Last Name'
            type="text"
            name="lastname"
            value={officerData.lastname}
            onChange={handleChange}
            readOnly={!isEditing}
          />
          <Input
            placeholder='Email'
            type="email"
            name="email"
            value={officerData.email}
            onChange={handleChange}
            readOnly={!isEditing}
          />
          <Select
            name="role"
            value={officerData.role}
            onChange={handleChange}
            disabled={!isEditing}
          >
            <option value="Regular">Regular</option>
            <option value="Admin">Admin</option>
          </Select>
          <Input
            placeholder='Password'
            type="password"
            name="password"
            value={officerData.password}
            onChange={handleChange}
            readOnly={!isEditing}
          />
          <Input
            placeholder='Date of Birth'
            type="date"
            name="bod"
            value={officerData.bod}
            onChange={handleChange}
            readOnly={!isEditing}
          />
          <Input
            placeholder='Contact Number'
            type="text"
            name="contact"
            value={officerData.contact}
            onChange={handleChange}
            readOnly={!isEditing}
          />
          <Input
            placeholder='Nationality'
            type="text"
            name="nationality"
            value={officerData.nationality}
            onChange={handleChange}
            readOnly={!isEditing}
          />
          <Input
            placeholder='Omang / Passport #'
            type="text"
            name="identifier"
            value={officerData.identifier}
            onChange={handleChange}
            readOnly={!isEditing}
          />
          {isEditing ? (
            <SaveButton onClick={handleSave}>Update</SaveButton>
          ) : (
            <EditButton onClick={handleEdit}>Edit</EditButton>
          )}
          <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
        </FormContainer>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  color: white;
  font-weight: bold;
  font-size: 20px;
  margin: 20px;;
`;

const Input = styled.input`
  padding: 8px 16px;
  color: white;
  width: 180px;
  border: 1px solid #3e3d40;
  background-color: #262628;
  border-radius: 10px;
`;

const Select = styled.select`
  padding: 8px 16px;
  color: white;
  width: 214px;
  border: 1px solid #3e3d40;
  background-color: #262628;
  border-radius: 10px;
`;

const EditButton = styled.button`
  background-color: #007bff;
  color: white;
  width: 215px;
  text-align: center;
  padding: 5px 16px;
  text-decoration: none;
  border: 1px solid #3e3d40;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  transition:  0.3s;
  margin: 10px 0;
`;

const SaveButton = styled(EditButton)`
  background-color: #28a745;
`;

const DeleteButton = styled.button`
  background-color: #dc3545;
  color: white;
  width: 215px;
  text-align: center;
  padding: 5px 16px;
  text-decoration: none;
  border: 1px solid #3e3d40;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  transition: 0.3s;
  margin: 10px 0;
`;