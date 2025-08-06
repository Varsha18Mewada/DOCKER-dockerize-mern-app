import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess } from '../../slices/authSlice';
import { menu } from '../../assets';
import './Navbar.css';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  /**  Function to handle user logout*/
  const LogoutUser = () => {
    localStorage.clear();
    dispatch(logoutSuccess());
    navigate('/login');
  };

  /**  Function to close the hamburger menu when a link is clicked */
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleToggleMenu = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <nav>
        <div className="nav-left">
          <img
            src={menu}
            className="hamburger-icon"
            onClick={toggleMenu}
            style={isOpen ? { transform: 'rotate(90deg)' } : {}}
            role="button"
          />
          <h2>Recipe Sharing App</h2>
        </div>
        <div className={`nav-right ${isOpen ? 'open' : ''}`}>
          <ul>
            {token ? (
              <>
                <li>
                  <NavLink to="/" onClick={handleToggleMenu}>
                    Recipes
                  </NavLink>{' '}
                </li>

                <li>
                  <NavLink to="/addRecipe" onClick={handleToggleMenu}>
                    Add Recipe
                  </NavLink>{' '}
                </li>
                <li>
                  <NavLink to="login" onClick={LogoutUser}>
                    Logout
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="login">Login</NavLink>{' '}
                </li>
                <li>
                  <NavLink to="signup">SignUp</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};
