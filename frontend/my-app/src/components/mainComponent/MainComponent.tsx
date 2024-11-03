import React, { cloneElement, isValidElement, ReactNode, useState } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import MainHeader from './MainHeaderComponent';
import SubHeader from './SubHeaderComponent';
import Sidebar from './SidebarComponent';
import './MainComponent.css';
import FullScreenSpinner from '../spinnerComponent/SpinnerComponent';
interface MainComponentProps {
  children: ReactNode;
}

const MainComponent: React.FC<MainComponentProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const handleMouseEnter = () => {
    setIsSidebarOpen(true);
    console.log('true');
  };

  const handleMouseLeave = () => {
    setIsSidebarOpen(false);
    console.log('false');
  };

  return (
    <div className="main-component">
        {showSpinner && <FullScreenSpinner />}
      <MainHeader />
      <SubHeader />
      <Container fluid>
          <Sidebar isOpen={isSidebarOpen} handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />
          <Col md={isSidebarOpen==true ? 10 : 12} className='child'  >
            {children}
          </Col>
      </Container>
    </div>
  );
};

export default MainComponent;
