"use client";
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../components/navbar';
import { getUsers, deleteUser, updateUser } from "../actions";

export default function OfficersClient({ session }) {  
    if (!session) {
        return <div>Loading...</div>; // Add a loading state or handle the case where session is not available
    }

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        if (response && Array.isArray(response.users)) {
          setUsers(response.users);
        } else {
          console.error('Unexpected response structure:', response);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = Array.isArray(users) ? users.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) : [];

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    const selectedUser = users.find(user => user._id === userId);
    setUserDetails(selectedUser);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleDelete = async () => {
    const response = await deleteUser(userDetails._id);
    if (response.success) {
      setUsers(users.filter(user => user._id !== userDetails._id));
      setIsModalOpen(false);
    } else {
      console.error(response.message);
    }
  };

  const handleUpdate = async () => {
    const response = await updateUser(userDetails);
    if (response.success) {
      setUsers(users.map(user => user._id === userDetails._id ? userDetails : user));
      setIsEditMode(false);
      setIsModalOpen(false);
    } else {
      console.error(response.message);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };
  return (
    <>
      {isLoading ? (
        <LoadingScreen>Loading...</LoadingScreen>
      ) : (
        <>
          <Container>
            <SearchContainer>
              <SearchInput
                placeholder="Search Users"
                value={searchTerm}
                onChange={handleSearch}
              />
            </SearchContainer>
            <Header>
              <GridInfo>Total: {filteredUsers.length}</GridInfo>
              <AddButton href="/officers/add-officer">Add</AddButton>
            </Header>
            <GridContainer>
              {filteredUsers.length === 0 ? (
                <NoResultsMessage>NO RESULTS</NoResultsMessage>
              ) : (
                filteredUsers.map((user) => (
                  <GridItem key={user._id} onDoubleClick={() => handleUserClick(user._id)} isSelected={user._id === selectedUserId}>
                    <UserName>{user.firstname} {user.lastname}</UserName>
                    <UserEmail>{user.email}</UserEmail>
                    <UserRole>{user.role}</UserRole>
                  </GridItem>
                ))
              )}
            </GridContainer>
          </Container>

          {isModalOpen && (
            <Modal>
              <ModalContent>
                {isEditMode ? (
                  <>
                  <select className="SelectInput" name="ministry" id="ministry" value={userDetails.ministry} onChange={handleChange}>
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
                    <Input name="firstname" value={userDetails.firstname} onChange={handleChange} />
                    <Input name="lastname" value={userDetails.lastname} onChange={handleChange} />
                    <Input name="email" type='email' value={userDetails.email} onChange={handleChange} />
                    <Select name="role" value={userDetails.role} onChange={handleChange}>
                      <option value="Regular">Regular</option>
                      <option value="Admin">Admin</option>
                    </Select>
                    <Input name="bod" type='date' value={userDetails.bod} onChange={handleChange} />
                    <Input name="contact" value={userDetails.contact} onChange={handleChange} />
                    <Input name="nationality" value={userDetails.nationality} onChange={handleChange} />
                    <Input name="identifier" value={userDetails.identifier} onChange={handleChange} />
                    <Button onClick={handleUpdate}>Update</Button>
                  </>
                ) : (
                  <>
                    <OfficerInfo>{userDetails.ministry} </OfficerInfo>
                    <OfficerInfo>Name: {userDetails.firstname} </OfficerInfo>
                    <OfficerInfo>Last Name: {userDetails.lastname}</OfficerInfo>
                    <OfficerInfo>Email: {userDetails.email}</OfficerInfo>
                    <OfficerInfo>Role: {userDetails.role}</OfficerInfo>
                    <OfficerInfo>Date of Birth: {userDetails.bod}</OfficerInfo>
                    <OfficerInfo>Contact: {userDetails.contact}</OfficerInfo>
                    <OfficerInfo>Nationality: {userDetails.nationality}</OfficerInfo>
                    <OfficerInfo>Identifier: {userDetails.identifier}</OfficerInfo>
                    <Button onClick={handleEdit}>Edit</Button>
                    <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
                  </>
                )}
                <CloseButton onClick={handleModalClose}>Close</CloseButton>
              </ModalContent>
            </Modal>
          )}
        </>
      )}
    </>
  );
}

// Styled components for the modal and buttons

const OfficerInfo = styled.div`
  padding: 8px 16px;
  font-size:12px;
  color: gray;
  width: 85%;
  border: 1px solid #3e3d40;
  background-color: #262628;
  border-radius: 10px;
`;

const Select = styled.select`
  padding: 8px 16px;
  color: white;
  width: 240px;
  border: 1px solid #3e3d40;
  background-color: #262628;
  border-radius: 10px;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #18181b;
  width: 500px;
  padding: 10px;
  margin-top: -250px;
  border-radius: 20px;
  border: 1px solid #272628;
  max-height: 730px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
`;

const Input = styled.input`
  padding: 8px 16px;
  color: white;
  width: 206px;
  border: 1px solid #3e3d40;
  background-color: #262628;
  border-radius: 10px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  width: 242px;
  text-align: center;
  padding: 6.5px 16px;
  text-decoration: none;
  border: 1px solid #3e3d40;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #ff4d4d;

  &:hover {
    background-color: #d40000;
  }
`;

const CloseButton = styled(Button)`
  background-color: #6c757d;

  &:hover {
    background-color: #5a6268;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  width: 85%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const LoadingScreen = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 24px;
  color: white;
  background-color: #18181b;
  z-index: 1000;
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px 0 0px;
`;

const SearchInput = styled.input`
  padding: 8px 16px;
  color: white;
  width: 280px;
  border: 1px solid #3e3d40;
  background-color: #262628;
  border-radius: 10px;
  text-align: center;
`;

const GridContainer = styled.div`
  background-color: #18181b;
  width: 85%;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #272628;
  max-height: 730px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: linear-gradient(to bottom, rgba(24, 24, 27, 0), rgba(24, 24, 27, 1));
    pointer-events: none;
  }

  &::-webkit-scrollbar {
    width: 15px;
  }

  &::-webkit-scrollbar-track {
    background: #1f1f22;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #3e3d40;
    border-radius: 10px;
    border: 3px solid #1f1f22;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }
`;

const GridInfo = styled.div`
  color: #808082;
  padding: 5px;
  font-size: 12px;
`;

const AddButton = styled.a`
  background-color: #007bff;
  color: white;
  padding: 5px 16px;
  text-decoration: none;
  border-radius: 8px;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const GridItem = styled.div`
  background-color: ${({ isSelected }) => (isSelected ? '#007bff' : '#262628')};
  color: white;
  padding: 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #007bff;
    color: white;
  }
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const UserEmail = styled.p`
  margin: 5px 0 0;
  font-size: 14px;
  color: #808082;
`;

const UserRole = styled.p`
  margin: 5px 0 0;
  font-size: 12px;
  color: #808082;
`;

const NoResultsMessage = styled.p`
  color: white;
  font-size: 16px;
  text-align: center;
  padding: 20px;
`;
