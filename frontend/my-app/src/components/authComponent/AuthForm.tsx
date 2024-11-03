import React, { useState } from 'react';
import { Button, Container, Form, Image } from 'react-bootstrap';
import './AuthForm.css';
import 'react-phone-number-input/style.css'
import useLoading from '../../utils/LoadingButton';
import { register, login } from '../../services/api';
import FullScreenSpinner from '../spinnerComponent/SpinnerComponent';
import logo from '../../resources/reboost.svg'
import PhoneInputWithCountrySelect, { isValidPhoneNumber } from 'react-phone-number-input';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { saveIsAdmin, saveToken, saveUUID } from '../../utils/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { Login } from '../../interfaces/Login';
const AuthForm: React.FC = () => {
  const { isLoading, setIsLoading, LoadingButton } = useLoading();
  const [isLogin, setIsLogin] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [first, setFirst] = useState('');
  const [middle, setMiddle] = useState('');
  const [last, setLast] = useState('');
  const [username,setUsername] = useState('');
  const navigate = useNavigate();

  const toggleForm = (isLoginForm: boolean) => {
    if(isLogin!=isLoginForm){
    setShowSpinner(true);
    setTimeout(() => {
      setIsLogin(isLoginForm);
      setShowSpinner(false);
    }, 500);
  }
};

const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await login({ username, password });
        console.log(data);
        toast.success('Login Done');
        saveToken(data.data.JWT);
        saveIsAdmin(data.data.isAdmin);
        saveUUID(data.data.UUID)
        navigate("/profile");
    } catch (error:any) {
      toast.error(`Login Failed : ${error.response.data.message}`);
    }
    setIsLoading(false);
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await register({ first,middle,last,phoneNumber:phone, email,username,password});
      toast.success('Registration Done');
      console.log("Registration successful:", data);
      toggleForm(true);
    } catch (error:any) {
      toast.error(`Registration Failed : ${error.response.data.message}`);
    }
    setIsLoading(false);
  };

  return (
    <Container className="auth-container">
      {showSpinner && <FullScreenSpinner />}
      <div className="box">
      <Image src={logo} className="logo" alt="Reboost" ></Image>
        <div className="toggle">
          <Button
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => toggleForm(true)}
          >
            Login
          </Button>
          <Button
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => toggleForm(false)}
          >
            Register
          </Button>
        </div>
        <div className="form-wrapper">
          {isLogin ? (
            <Form id="login-form" onSubmit={handleLoginSubmit}>
              <Form.Group controlId="formLoginUsername">
                <Form.Control type="text" placeholder="Username" required value={username} onChange={e => setUsername(e.target.value)}/>
              </Form.Group>
              <Form.Group controlId="formLoginPassword">
                <Form.Control type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)}/>
              </Form.Group>
              <LoadingButton variant="primary" type="submit" className="submit-btn">
                Login
              </LoadingButton>
            </Form>
          ) : (
          <Form id="register-form" onSubmit={handleRegisterSubmit}>
              <Form.Group controlId="formRegisterFirstName">
                <Form.Control type="text" placeholder="First Name" required value={first} onChange={e => setFirst(e.target.value)}/>
              </Form.Group>
              <Form.Group controlId="formRegisterMiddleName">
                <Form.Control type="text" placeholder="Middle Name" value={middle} onChange={e => setMiddle(e.target.value)}/>
              </Form.Group>
              <Form.Group controlId="formRegisterLastName">
                <Form.Control type="text" placeholder="Last Name" required value={last} onChange={e => setLast(e.target.value)}/>
              </Form.Group>
              <Form.Group controlId="formRegisterUsername">
                <Form.Control type="text" placeholder="Username" required value={username} onChange={e => setUsername(e.target.value)}/>
              </Form.Group>
              <Form.Group controlId="formRegisterEmail">
                <Form.Control type="email" placeholder="email" required value={email} onChange={e => setEmail(e.target.value)}/>
              </Form.Group>
              <Form.Group controlId="formRegisterPassword">
                <Form.Control type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)}/>
              </Form.Group>
              <Form.Group controlId="formRegisterPhoneNumber" >
      <PhoneInputWithCountrySelect
        placeholder="Enter phone number"
        // value={phone}
        onChange={setPhone as any}
        defaultCountry="LB"
        countries={['LB', 'GB', 'FR', 'DE','PS']} // Specify countries to include
        error={
          phone ? (isValidPhoneNumber(phone) ? undefined : 'Invalid phone number') : 'Phone number required'
        }
        maxDropdownHeight="100px" // Limit the dropdown height
        className="form-control"
      />
    </Form.Group>
              <LoadingButton variant="primary" type="submit" className="submit-btn">
                Register
              </LoadingButton>
          </Form>
          )}
        </div>
      </div>
    </Container>
  );
};

export default AuthForm;
