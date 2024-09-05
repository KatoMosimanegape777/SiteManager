"use client";
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getSchools, getSites, deleteSchool, updateSchool, deleteSite, updateSite } from "../actions";

export default function SitetableClient({ session }) {
  
  if (!session) {
    return <div>Loading...</div>;
  }

  const [schools, setSchools] = useState([]);
  const [sites, setSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [itemDetails, setItemDetails] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentTable, setCurrentTable] = useState('schools');

  const fetchData = async () => {
    try {
      setIsLoading(true);
      if (currentTable === 'schools') {
        const response = await getSchools();
        if (response && Array.isArray(response.schools)) {
          setSchools(response.schools);
        }
      } else {
        const response = await getSites();
        if (response && Array.isArray(response.sites)) {
          setSites(response.sites);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${currentTable}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentTable]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const currentData = currentTable === 'schools' ? schools : sites;

  const filteredData = currentTable === 'schools' ? currentData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) : (session.ministry === "Ministry of Communications, Knowledge and Technology" ? currentData : currentData.filter((item) =>
    item.ministry === session.ministry
  )).filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = filteredData.sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    }
    return 0;
  });

  const handleRowClick = (itemId) => {
    setSelectedItemId(itemId);
    const selectedItem = currentData.find(item => item._id === itemId);
    setItemDetails(selectedItem);
    setIsModalOpen(true);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleDelete = async () => {
    const deleteFunction = currentTable === 'schools' ? deleteSchool : deleteSite;
    const response = await deleteFunction(itemDetails._id);
    if (response.success) {
      if (currentTable === 'schools') {
        setSchools(schools.filter(school => school._id !== itemDetails._id));
      } else {
        setSites(sites.filter(site => site._id !== itemDetails._id));
      }
      setIsModalOpen(false);
    } else {
      console.error(response.message);
    }
  };

  const handleUpdate = async () => {
    const updateFunction = currentTable === 'schools' ? updateSchool : updateSite;
    const response = await updateFunction(itemDetails);
    if (response.success) {
      fetchData();
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
    setItemDetails({ ...itemDetails, [name]: value });
  };

  const schoolHeaders = [
    { key: 'schoolname', label: 'School Name' },
    { key: 'location', label: 'Location' },
    { key: 'connectivityTechnology', label: 'Technology' },
    { key: 'adslPwVlanid', label: 'ADSL/PW/VLAN' },
    { key: 'wansiteaddress', label: 'WAN Address' },
    { key: 'adminsubnet', label: 'Admin Subnet' },
    { key: 'gdnloopback', label: 'GDN Loopback' },
    { key: 'ednloopback', label: 'EDN Loopback' },
    { key: 'studentedngatewayaddr', label: 'EDN Gateway' },
  ];

  const siteHeaders = [
    { key: 'ministry', label: 'Ministry' },
    { key: 'sitename', label: 'Site Name' },
    { key: 'sitelocation', label: 'Site Location' },
    { key: 'node', label: 'Node' },
    { key: 'lan', label: 'LAN' },
    { key: 'nodeAddress', label: 'Node Address' },
    { key: 'remoteaddress', label: 'Remote_Address' },
    { key: 'vlanID', label: 'VLAN_ID' },
    { key: 'pwNumber', label: 'PW #' },
    { key: 'connectionType', label: 'Connection_Type' },
    { key: 'bandwidth', label: 'Bandwidth' },
    { key: 'routerModel', label: 'Router Model' },
    { key: 'routerSerialNumber', label: 'Router_Seria #' },
    { key: 'switchModel', label: 'Switch Model' },
    { key: 'switchISO', label: 'Switch ISO' },
  ];

  const headers = currentTable === 'schools' ? schoolHeaders : siteHeaders;

  return (
    <>
      {isLoading ? (
        <LoadingScreen>Loading...</LoadingScreen>
      ) : (
        <>
          <Container>
            <SearchContainer>
              <SearchInput
                placeholder={`Search ${currentTable}`}
                value={searchTerm}
                onChange={handleSearch}
              />
            </SearchContainer>
            <Header>
              <TableInfo>Total: {filteredData.length}</TableInfo>
              <ButtonGroup>
                <SwitchButton onClick={() => setCurrentTable(currentTable === 'schools' ? 'sites' : 'schools')}>
                  Switch to {currentTable === 'schools' ? 'Sites' : 'Schools'}
                </SwitchButton>
                {session.role === 'Admin' && ( 
                  <AddButton href={currentTable === 'schools' ? "/sitetable/add-school" : "/sitetable/add-site"}>
                    Add
                  </AddButton>
                )}
              </ButtonGroup>
            </Header>
            <TableContainer>
              <Table>
                <thead>
                  <TableHeaderRow>
                    {headers.map((header, index) => {
                      if (index === 0) {
                        return (
                          <TableHeaderFirst key={header.key} onClick={() => handleSort(header.key)}>
                            {header.label}
                          </TableHeaderFirst>
                        );
                      } else if (index === headers.length - 1) {
                        return (
                          <TableHeaderLast key={header.key} onClick={() => handleSort(header.key)}>
                            {header.label}
                          </TableHeaderLast>
                        );
                      } else {
                        return (
                          <TableHeader key={header.key} onClick={() => handleSort(header.key)}>
                            {header.label}
                          </TableHeader>
                        );
                      }
                    })}
                  </TableHeaderRow>
                </thead>
                <tbody>
                  {sortedData.length === 0 ? (
                    <TableRow>
                      <TableData colSpan={headers.length}>
                        <NoResultsMessage>NO RESULTS</NoResultsMessage>
                      </TableData>
                    </TableRow>
                  ) : (
                    sortedData.map((item) => (
                      <TableRow
                        key={item._id}
                        onDoubleClick={() => handleRowClick(item._id)}
                        isSelected={item._id === selectedItemId}
                      >
                        {headers.map((header) => (
                          <TableData 
                            key={header.key} 
                            isWide={header.key === 'ministry' || header.key === 'sitename'}
                          >
                            {item[header.key]}
                          </TableData>
                        ))}
                      </TableRow>
                    ))
                  )}
                </tbody>
              </Table>
            </TableContainer>
          </Container>

          {isModalOpen && (
            <Modal>
              <ModalContent>
                {isEditMode ? (
                  <>
                    {headers.map((header) => (
                      <Input
                        key={header.key}
                        name={header.key}
                        placeholder={header.label}
                        value={itemDetails[header.key]}
                        onChange={handleChange}
                      />
                    ))}
                    <Button onClick={handleUpdate}>Update</Button>
                  </>
                ) : (
                  <>
                    {headers.map((header) => (
                      <SchoolInfo key={header.key}>
                        {header.label}: {itemDetails[header.key]}
                      </SchoolInfo>
                    ))}
                    {session.role === 'Admin' && (<Button onClick={handleEdit}>Edit</Button>)}
                    {session.role === 'Admin' && (<DeleteButton onClick={handleDelete}>Delete</DeleteButton>)}
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


const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100vh - 60px);
  padding: 20px;
  box-sizing: border-box;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
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

const Header = styled.div`
  width: 85%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const TableInfo = styled.div`
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

const SwitchButton = styled.a`
  background-color: #007bff;
  color: white;
  padding: 5px 16px;
  text-decoration: none;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  transition: background-color 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const TableContainer = styled.div`
  background-color: #18181b;
  width: 97%;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #272628;
  height: calc(100vh - 200px);
  min-height: 300px;
  overflow-y: auto;
  position: relative;

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

  @media (max-height: 600px) {
    height: calc(100vh - 100px);
  }
`;

const Table = styled.table`
  width: 100%;
  font-size: 14px;
  padding: 5px;
  color: #fff;
  border-collapse: separate;
  border-spacing: 0;
  margin: 0 auto;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const TableHeaderRow = styled.tr``;

const TableHeader = styled.th`
  padding: 10px;
  color: #808082;
  background-color: #1f1f22;
  cursor: pointer;
  text-align: left;
  position: sticky;
  top: 0;
  z-index: 1;
  border-bottom: 1px solid #3e3d40;
  border-top: 1px solid #3e3d40;
`;

const TableHeaderFirst = styled(TableHeader)`
  border-radius: 12px 0 0 12px;
  border-left: 1px solid #3e3d40;
  min-width: 250px;
`;

const TableHeaderLast = styled(TableHeader)`
  border-radius: 0 12px 12px 0;
  border-right: 1px solid #3e3d40;
`;

const TableRow = styled.tr`
  cursor: pointer;
  background-color: ${({ isSelected }) => (isSelected ? '#262628' : 'transparent')};
  &:hover {
    background-color: #262628;
  }
`;

const TableData = styled.td`
  text-align: left;
  padding: 10px;
  min-width: ${({ isWide }) => (isWide ? '200px' : '100px')};
  border-bottom: 1px solid #272628;
`;

const NoResultsMessage = styled.div`
  color: #808082;
  font-style: italic;
  text-align: center;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #18181b;
  width: 690px;
  padding: 20px;
  margin-top: -250px;
  border-radius: 20px;
  border: 1px solid #272628;
  max-height: 730px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 13px;
`;

const Input = styled.input`
  padding: 8px 16px;
  color: white;
  width: 188px;
  border: 1px solid #3e3d40;
  background-color: #262628;
  border-radius: 10px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  width: 222px;
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

const SchoolInfo = styled.div`
  padding: 8px 16px;
  font-size: 12px;
  color: gray;
  width: 85%;
  border: 1px solid #3e3d40;
  background-color: #262628;
  border-radius: 10px;
`;