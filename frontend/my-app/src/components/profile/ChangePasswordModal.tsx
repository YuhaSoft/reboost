import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { updatePassword } from '../../services/api';
import useLoading from '../../utils/LoadingButton';
import { FaStar } from 'react-icons/fa';
import '../../App.css';
import FullScreenSpinner from '../spinnerComponent/SpinnerComponent';
interface ChangePasswordModalProps {
  show: boolean;
  handleClose: () => void;
  handleShowSpinner:()=>void;
  handleHideSpinner:()=>void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ show, handleClose, handleHideSpinner,handleShowSpinner }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  useEffect(() => {
    if (!show) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  }, [show]);

    const handleSubmit = async () => {
        setShowSpinner(true);
        if (newPassword !== confirmNewPassword) {
            toast.error('New password and confirm new password do not match');
            setShowSpinner(false);
            return;
        }
        else if(!newPassword||!currentPassword||!confirmNewPassword){
            toast.error('all fields required');
            setShowSpinner(false);
            return;
        }
        try {
            const data = await updatePassword(currentPassword, newPassword);
            if (data.success) {
                setShowSpinner(false);
                toast.success('Password changed successfully');
                handleClose();
            }
        } catch (error: any) {
            setShowSpinner(false);
            toast.error(error.response.data.message);
            setShowSpinner(false);
            return;
        }
        setShowSpinner(false);
       // Ensure the modal closes after saving
    };

  return (
    <Modal show={show} onHide={handleClose}>
         {showSpinner && <FullScreenSpinner />}
      <Modal.Header closeButton>
        <Modal.Title>Change Password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="currentPassword">
            <Form.Label className='required-label'>Current Password</Form.Label>
            <Form.Control
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="newPassword">
            <Form.Label className='required-label'>New Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="confirmNewPassword">
            <Form.Label className='required-label'>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>

        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;
