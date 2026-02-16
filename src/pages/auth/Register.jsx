import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';


const UserManagement = () => {
    // State
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [validated, setValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [passwordMatchError, setPasswordMatchError] = useState('');

    // Load users from localStorage
    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem('dummyUsers')) || [];
        setUsers(storedUsers);
    }, []);

    // Handle input change
    const handleChange = ({ target: { name, value } }) => {
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Real-time password match check
        if (name === 'password' || name === 'confirmPassword') {
            const password = name === 'password' ? value : formData.password;
            const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;

            if (password && confirmPassword && password !== confirmPassword) {
                setPasswordMatchError('Passwords do not match');
            } else {
                setPasswordMatchError('');
            }
        }
    };

    // Handle form submit
    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();

        setValidated(true);

        // extra validation
        if (form.checkValidity() === false || formData.password !== formData.confirmPassword) {
            setPasswordMatchError(formData.password !== formData.confirmPassword ? 'Passwords do not match' : '');
            return;
        }

        // ✅ Check for duplicate username
        const usernameExists = users.some(u => u.username.toLowerCase() === formData.username.trim().toLowerCase());
        if (usernameExists) {
            toast.error('Username already exists!'); // react-toastify alert
            return; // user add mat karo
        }

        setLoading(true);

        const newUser = {
            id: Date.now(),
            username: formData.username.trim(),
            password: formData.password
        };

        const updatedUsers = [newUser, ...users];
        localStorage.setItem('dummyUsers', JSON.stringify(updatedUsers));
        setUsers(updatedUsers);
        toast.success('User added successfully!');

        // Reset
        setFormData({ username: '', password: '', confirmPassword: '' });
        setShowModal(false);
        setLoading(false);
        setPasswordMatchError('');
        setValidated(false);
    };

    // Handle delete user
    const handleDelete = (id) => {
        const updatedUsers = users.filter(u => u.id !== id); // remove user
        setUsers(updatedUsers);
        toast.success('User deleted successfully!');
    };


    return (
        <div className="container mt-4">
            <h3>User Management</h3>
            <div className="mb-3 d-flex justify-content-end">
                <Button onClick={() => setShowModal(true)}>
                    <i className="fas fa-user-plus me-2"></i>Add User
                </Button>
            </div>


            {/* User Listing */}
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan="2" className="text-center">
                                No users found
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </Table>

            {/* Add User Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group as={Col} className="mb-3" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">Username is required</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">Password is required</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} className="mb-3" controlId="confirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                isInvalid={!!passwordMatchError}
                            />
                            <Form.Control.Feedback type="invalid">
                                {passwordMatchError || 'Confirm Password is required'}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button type="submit" className="w-100" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Creating User...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-user-plus me-2"></i>
                                    Create User
                                </>
                            )}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <ToastContainer
                position="top-right"
                autoClose={3000}
            />
        </div>
    );
};

export default UserManagement;
