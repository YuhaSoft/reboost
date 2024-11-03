import React, { useEffect, useRef, useState } from 'react';
import MainComponent from '../mainComponent/MainComponent';
import { getUser, IMAGE_URL, updatePassword, updateProfile, updateProfileImage } from '../../services/api';
import { FaEdit, FaKey, FaSave, FaUserSecret } from 'react-icons/fa';
import './ProfileComponent.css';
import { getUUID } from '../../utils/auth';
import FullScreenSpinner from '../spinnerComponent/SpinnerComponent';
import { toast } from 'react-toastify';
import PhoneInputWithCountrySelect, { isValidPhoneNumber } from 'react-phone-number-input';
import ChangePasswordModal from './ChangePasswordModal';

const DEAULT_IMAGE = "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg";

const Profile = () => {
  const [profile, setProfile] = useState({
    imageUrl: '',
    email: '',
    username: '',
    phone: '',
  });
  const [editing, setEditing] = useState<boolean>(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setShowSpinner(true);
        const data = await getUser(getUUID() + "");
        setProfile({ 
          email: data.data.email, 
          imageUrl: (data.data.profileImage) ? IMAGE_URL + data.data.profileImage.url : DEAULT_IMAGE, 
          phone: data.data.phoneNumber, 
          username: data.data.username 
        });
      } catch (error) {
        toast.error("Can't fetch profile");
        console.error('Error fetching profile:', error);
      }
      setShowSpinner(false);
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(e.target.files);
    if (file) {
      try {
        const imageUrl = URL.createObjectURL(file);
        setProfile(prevProfile => ({ ...prevProfile, imageUrl }));
  
        setShowSpinner(true);
        const data = await updateProfileImage(file);
        setShowSpinner(false);
  
        if (data.success) {
          toast.success('Profile image updated successfully');
        } else {
          toast.error('Failed to update profile image');
        }
      } catch (err) {
        console.error(err);
        setShowSpinner(false);
        toast.error('Error updating profile image');
      }
    }
  };
  

  const handleSave = async () => {
    try {
      setShowSpinner(true);
      const data = await updateProfile(profile.email,profile.phone);
      if(data.success){
        toast.success("profile updated successfully");
      }
      setEditing(false);
    } catch (error:any) {
      toast.error("can't update profile" + error.message);
      console.error('Error updating profile:', error);
    }
    setShowSpinner(false);
  };

  const handleChange = (field: string, value: string) => {
    setProfile(prevProfile => ({ ...prevProfile, [field]: value }));
  };

  const showSpinnerInChild = () => {
    setShowSpinner(true);
  };

  const hideSpinnerInChild = () => {
    setShowSpinner(false);
  };

  return (
    <MainComponent>
      {showSpinner && <FullScreenSpinner />}
      <div className="profile-container">
        <div className="profile-header">
          <img src={profile.imageUrl} alt="Profile" className="profile-image" />
          <button className="edit-button" onClick={() => fileInputRef.current?.click()}>
            Edit <FaEdit />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
        <div className="profile-info">
          <div className="profile-item">
            <label>Username:</label>
            <input type="text" value={profile.username} readOnly />
          </div>
          <div className="profile-item">
            <label>Email:</label>
            <div className="input-wrapper">
              <input
                type="email"
                value={profile.email}
                disabled={!editing}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
          </div>
          <div className="profile-item">
            <label>Phone Number:</label>
            <div className="input-wrapper">
              {editing ? (
                <PhoneInputWithCountrySelect
                  placeholder="Enter phone number"
                  value={profile.phone}
                  onChange={(value) => handleChange('phone', value || '')}
                  defaultCountry="LB"
                  countries={['LB', 'GB', 'FR', 'DE', 'PS']}
                  error={
                    profile.phone ? (isValidPhoneNumber(profile.phone) ? undefined : 'Invalid phone number') : 'Phone number required'
                  }
                  maxDropdownHeight="100px"
                  className="form-control"
                />
              ) : (
                <input
                  type="text"
                  value={profile.phone}
                  disabled={!editing}
                  readOnly
                />
              )}
            </div>
          </div>
          <div className="profile-actions">
            {editing ? (
              <button className="save-button" onClick={handleSave}>
               Save <FaSave />
              </button>
            ) : (
              <>
                <button className="edit-button" onClick={handleEdit}>
                 Edit <FaEdit />
                </button>
                <button className="edit-button" onClick={() => setShowChangePasswordModal(true)}>
                Change Password <FaKey />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <ChangePasswordModal
        show={showChangePasswordModal}
        handleClose={() => setShowChangePasswordModal(false)}
        handleShowSpinner = {()=>showSpinnerInChild}
        handleHideSpinner = {()=>hideSpinnerInChild}
      />
    </MainComponent>
  );
};

export default Profile;
