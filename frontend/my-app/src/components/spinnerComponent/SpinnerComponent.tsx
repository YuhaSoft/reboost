import React from 'react';
import { Spinner } from 'react-bootstrap';
import './SpinnerComponent.css';

const SpinnerComponent: React.FC = () => {
  return (
    <div className="fullscreen-spinner">
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default SpinnerComponent;
