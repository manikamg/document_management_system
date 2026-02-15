
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/">
                    <i className="fas fa-folder-open me-2"></i>
                    Document Management System
                </NavLink>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                to="/dashboard"
                                end
                            >
                                <i className="fas fa-home me-1"></i> Dashboard
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                to="/upload-document"
                            >
                                <i className="fas fa-upload me-1"></i> Upload Document
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                to="/search"
                            >
                                <i className="fas fa-search me-1"></i> Search Documents
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                                to="/users"
                            >
                                <i className="fas fa-search me-1"></i> User
                            </NavLink>
                        </li>
                    </ul>

                    <div className="d-flex align-items-center">
                        <span className="text-white me-3">
                            <i className="fas fa-user-circle me-1"></i>
                            {user?.user_name || 'User'}
                        </span>
                        <button
                            className="btn btn-outline-light btn-sm"
                            onClick={handleLogout}
                        >
                            <i className="fas fa-sign-out-alt me-1"></i> Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header