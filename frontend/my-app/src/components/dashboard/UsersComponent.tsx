import React, { useEffect, useState } from 'react';
import { getAllUsers, IMAGE_URL } from '../../services/api';
import FullScreenSpinner from '../spinnerComponent/SpinnerComponent';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './UsersComponent.css';
import MainComponent from '../mainComponent/MainComponent';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [emailSearch, setEmailSearch] = useState('');
  const [usernameSearch, setUsernameSearch] = useState('');
  const [phoneSearch, setPhoneSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSize, setTotalSize] = useState(0);
  const [showSpinner, setShowSpinner] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setShowSpinner(true);
        const filters = JSON.stringify({
          email: { contains: emailSearch },
          username: { contains: usernameSearch },
          phoneNumber: { contains: phoneSearch },
        });
        const orderBy = JSON.stringify({ createdAt: 'desc' });
        const data = await getAllUsers(filters, orderBy, currentPage, pageSize);
        setUsers(data.data.results); // Adjust based on your response structure
        setTotalSize(data.data.totalCount); // Adjust based on your response structure
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      setShowSpinner(false);
    };
    fetchUsers();
  }, [emailSearch, usernameSearch, phoneSearch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    { dataField: 'profileImage.url', text: 'Profile Image', formatter: (cell:string) => <img src={IMAGE_URL+cell} alt="Profile" className="profile-image-small" /> },
    { dataField: 'id', text: 'ID' },
    { dataField: 'email', text: 'Email' },
    { dataField: 'username', text: 'Username' },
    { dataField: 'phoneNumber', text: 'Phone Number' },
  ];

  return (
    <MainComponent>
      <div className="users-container">
        {showSpinner && <FullScreenSpinner />}
        <div className="search-inputs">
          <input
            type="text"
            placeholder="Search by email"
            value={emailSearch}
            onChange={(e) => setEmailSearch(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Search by username"
            value={usernameSearch}
            onChange={(e) => setUsernameSearch(e.target.value)}
            className="search-input"
          />
          <input
            type="text"
            placeholder="Search by phone number"
            value={phoneSearch}
            onChange={(e) => setPhoneSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <BootstrapTable
          keyField="id"
          data={users}
          columns={columns}
          pagination={paginationFactory({
            page: currentPage,
            sizePerPage: pageSize,
            totalSize: totalSize,
            onPageChange: handlePageChange,
          })}
        />
      </div>
    </MainComponent>
  );
};

export default Users;
