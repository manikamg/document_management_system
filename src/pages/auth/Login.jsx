import React, { useState, useEffect } from 'react';
import { Form, } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetOtpState, resetVrfyState, setMobileNumber, changeNumber } from '../../store/slices/authSlice';
import { requestLoginOtp, verifyLoginOtp } from '../../features/auth/authThunks';


const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        loading,
        success,
        error,
        message,
        otpSent,
        mobileNumber,

        vrfyLoading,
        vrfySuccess,
        vrfyError,
        vrfyMessage,
        vrfyData,
    } = useSelector((state) => state.auth);

    const [otp, setOtp] = useState('');
    const [localMobileNumber, setLocalMobileNumber] = useState('');

    // handle send otp response
    useEffect(() => {
        if (success) {
            toast.success(message)
            dispatch(resetOtpState())
        }
        if (error) {
            toast.error(message)
            dispatch(resetOtpState())
        }
        if (vrfyError) {
            toast.error(message)
            dispatch(resetOtpState())
        }
        if (vrfySuccess) {
            toast.success(message)
            dispatch(resetOtpState())
            navigate("/")
        }

    }, [success, error, vrfySuccess, vrfyError, navigate]);

    // Clear messages on unmount
    useEffect(() => {
        return () => {
            dispatch(resetVrfyState());
        };
    }, [dispatch]);

    const handleSendOTP = (e) => {
        e.preventDefault();
        if (localMobileNumber.length === 10) {
            dispatch(setMobileNumber(localMobileNumber));
            const data = {
                mobile_number: localMobileNumber
            }
            dispatch(requestLoginOtp(data));
        }
    };

    const handleValidateOTP = (e) => {
        e.preventDefault();
        const data = {
            mobile_number: mobileNumber,
            otp
        }
        if (otp.length === 6) {
            dispatch(verifyLoginOtp(data));
        }
    };

    const handleResendOTP = () => {
        if (mobileNumber) {
            const data = {
                mobile_number: mobileNumber
            }
            dispatch(requestLoginOtp(data));
        }
    };

    const handleChangeMobileNumber = () => {
        setLocalMobileNumber('')
        dispatch(changeNumber())
    }

    return (
        <div className="login-container">
            <div className="login-card fade-in">
                <div className="login-header">
                    <h1>
                        <i className="fas fa-folder-open me-2"></i>
                        DMS Login
                    </h1>
                    <p>Document Management System</p>
                </div>


                {/* Mobile Number Form */}
                {!otpSent ? (
                    <Form onSubmit={handleSendOTP}>
                        <div className="mb-4">
                            <label htmlFor="mobile_number" className="form-label">
                                <i className="fas fa-mobile-alt me-2"></i>Mobile Number
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="mobile_number"
                                name='mobile_number'
                                placeholder="Enter 10-digit mobile number"
                                value={localMobileNumber}
                                onChange={(e) => setLocalMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                maxLength={10}
                                required
                            />
                            <div className="form-text">
                                We'll send an OTP to your mobile number
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading || localMobileNumber.length !== 10}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Sending OTP...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane me-2"></i>
                                    Send OTP
                                </>
                            )}
                        </button>
                    </Form>
                ) : (
                    /* OTP Verification Form */
                    <form onSubmit={handleValidateOTP}>
                        <div className="mb-4">
                            <label htmlFor="otp" className="form-label">
                                <i className="fas fa-key me-2"></i>Enter OTP
                            </label>
                            <input
                                type="text"
                                className="form-control otp-input"
                                id="otp"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength={6}
                                required
                            />
                            <div className="form-text text-center mt-2">
                                OTP sent to: <strong>{mobileNumber}</strong>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100 mb-3"
                            disabled={vrfyLoading || otp.length !== 6}
                        >
                            {vrfyLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check-circle me-2"></i>
                                    Verify OTP
                                </>
                            )}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                className="btn btn-link"
                                onClick={handleResendOTP}
                                disabled={vrfyLoading}
                            >
                                <i className="fas fa-redo me-1"></i>
                                Resend OTP
                            </button>

                            <button
                                type="button"
                                className="btn btn-link"
                                onClick={() => handleChangeMobileNumber()}
                            >
                                <i className="fas fa-arrow-left me-1"></i>
                                Change Number
                            </button>
                        </div>
                    </form>
                )}

            </div>
            {/* Toast container */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
            />
        </div>
    );
};

export default Login;

