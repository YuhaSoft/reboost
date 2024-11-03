import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthForm from './components/authComponent/AuthForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthGuard from './components/AuthGuard';
import MainComponent from './components/mainComponent/MainComponent';
import Dashboard from './components/dashboard/UsersComponent';
import Profile from './components/profile/ProfileComponent';
import Users from './components/dashboard/UsersComponent';
const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
    <ToastContainer />
        <Routes>
          <Route path="/auth" element={<AuthForm />} />
          <Route element={<AuthGuard />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Users />} />
            <Route path="*" element={<Navigate to="/profile" />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
