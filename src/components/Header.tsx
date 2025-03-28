import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const Header: React.FC = () => {
  const { setIsOpen, setPosition } = useSettings();
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleProfileClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      top: rect.bottom + 10,
      left: rect.left,
      anchor: 'profile',
    });
    setIsOpen(true);
  };

  const handleCloseForms = () => {
    setShowSignIn(false);
    setShowSignUp(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-left">
          <img src="src/assets/logo.png" alt="Guard Spire Logo" className="logo" />
          <h1>GUARD SPIRE</h1>
        </div>

        <div className="header-right">
          <button className="sign-in" onClick={() => setShowSignIn(true)}>Sign In</button>
          <button className="sign-up" onClick={() => setShowSignUp(true)}>Sign Up</button>
          <img
            src="src/assets/user.png"
            alt="User Profile"
            className="user-icon"
            onClick={handleProfileClick}
          />
        </div>
      </header>

      {/* Popup Forms */}
      {showSignIn && (
        <div className="popup-overlay">
          <SignInForm onClose={handleCloseForms} />
        </div>
      )}
      {showSignUp && (
        <div className="popup-overlay">
          <SignUpForm onClose={handleCloseForms} />
        </div>
      )}
    </>
  );
};

export default Header;
