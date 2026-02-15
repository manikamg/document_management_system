import React from 'react';
import { Outlet } from 'react-router-dom';
// Components
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';

const MainLayout = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Navbar */}
            <Header />

            {/* Main Content */}
            <main className="flex-grow-1 py-4">
                <div className="container-fluid px-4">
                    <Outlet />
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default MainLayout;

