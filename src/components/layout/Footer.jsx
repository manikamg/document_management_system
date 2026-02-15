import React from 'react'

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <p className="text-muted mb-0">
                    © {new Date().getFullYear()} Document Management System. All rights reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer