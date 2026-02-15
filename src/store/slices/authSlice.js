import { createSlice } from "@reduxjs/toolkit";
import { requestLoginOtp, verifyLoginOtp } from '../../features/auth/authThunks'


const initialState = {
    loading: false,
    success: false,
    error: false,
    message: null,
    data: null,
    otpSent: false,

    mobileNumber: '',

    vrfyLoading: false,
    vrfySuccess: false,
    vrfyError: false,
    vrfyMessage: null,
    vrfyData: null,

    accessToken: localStorage.getItem("accessToken") || null,
    isAuthenticated: !!localStorage.getItem("accessToken"),

    isLogout: false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setMobileNumber: (state, action) => {
            state.mobileNumber = action.payload;
        },
        logout: (state) => {
            state.isLogout = true
            state.accessToken = null;
            state.isAuthenticated = false;
            localStorage.removeItem('accessToken')
        },
        resetOtpState: (state) => {
            state.loading = false
            state.success = false
            state.error = false
            state.message = null
        },
        resetVrfyState: (state) => {
            state.vrfyLoading = false
            state.vrfySuccess = false
            state.vrfyError = false
            state.vrfyMessage = null
            state.otpSent = false
            state.data = null
            state.vrfyData = null
            state.mobileNumber = ''
        },
        changeNumber: (state) => {
            state.otpSent = false
            state.mobileNumber = ''
        }

    },

    extraReducers: (builder) => {
        builder
            // Request Login Otp
            .addCase(requestLoginOtp.pending, (state) => {
                state.loading = true
            })
            .addCase(requestLoginOtp.fulfilled, (state, action) => {
                const status = action.payload.status
                const data = action.payload.data
                if (status) {
                    state.loading = false
                    state.success = true
                    state.error = false
                    state.message = data
                    state.otpSent = true
                } else {
                    state.loading = false
                    state.success = false
                    state.error = true
                    state.message = data
                    state.otpSent = false
                }
            })
            .addCase(requestLoginOtp.rejected, (state, action) => {
                state.loading = false
                state.success = false
                state.error = true
                state.message = data
                state.otpSent = false
            })

            // Verify Login OTP
            .addCase(verifyLoginOtp.pending, (state) => {
                state.vrfyLoading = true
            })
            .addCase(verifyLoginOtp.fulfilled, (state, action) => {
                const status = action.payload.status
                const data = action.payload.data
                if (status) {
                    state.vrfyLoading = false
                    state.vrfySuccess = true
                    state.isAuthenticated = true
                    state.vrfyMessage = "OTP Verification successful. Redirecting to dashboard..."
                    state.vrfyData = data
                    localStorage.setItem('userData', JSON.stringify(data))
                    localStorage.setItem('accessToken', data.token)
                }
                else {
                    state.vrfyLoading = false
                    state.vrfySuccess = false
                    state.vrfyError = true
                    state.isAuthenticated = false
                    state.vrfyMessage = action.payload.message
                    localStorage.removeItem('accessToken')
                }
            })
            .addCase(verifyLoginOtp.rejected, (state, action) => {
                state.vrfyLoading = false
                state.vrfySuccess = false
                state.vrfyError = true
                state.isAuthenticated = false
                // state.vrfyMessage = action.payload.message
                localStorage.removeItem('accessToken')
            })
    },
})

export const { setMobileNumber, logout, resetOtpState, resetVrfyState, changeNumber } = authSlice.actions
export default authSlice.reducer