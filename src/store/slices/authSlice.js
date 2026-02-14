import { createSlice } from "@reduxjs/toolkit";
import { requestLoginOtp, verifyLoginOtp } from '../../features/auth/authThunks'


const initialState = {
    loading: false,
    success: false,
    error: false,
    message: null,
    data: null,

    vrfyLoading: false,
    vrfySuccess: false,
    vrfyError: false,
    vrfyMessage: null,
    vrfyData: null
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null
            localStorage.removeItem('accessToken')
        },
        resetOtpState: (state) => {
            state.loading = false,
            state.success = false,
            state.error = false,
            state.message = null
        },
        resetVrfyState: (state) => {
            state.vrfyLoading = false,
            state.vrfySuccess = false,
            state.vrfyError = false,
            state.vrfyMessage = null
        }
    },

    extraReducers: (builder) => {
        builder
            // Request Login Otp
            .addCase(requestLoginOtp.pending, (state) => {
                state.loading = true
            })
            .addCase(requestLoginOtp.fulfilled, (state, action) => {
                state.loading = false
                state.success = true
                state.data = action.payload.user
                localStorage.setItem('accessToken', action.payload.token)
            })
            .addCase(requestLoginOtp.rejected, (state, action) => {
                state.loading = false
                state.error = true
                state.message = action.payload
            })

            // Verify Login OTP
            .addCase(verifyLoginOtp.pending, (state) => {
                state.vrfyLoading = true
            })
            .addCase(verifyLoginOtp.fulfilled, (state, action) => {
                state.vrfyLoading = false
                state.vrfySuccess = true
                state.vrfyData = action.payload.user
                localStorage.setItem('accessToken', action.payload.token)
            })
            .addCase(verifyLoginOtp.rejected, (state, action) => {
                state.vrfyLoading = false
                state.vrfyError = true
                state.vrfyMessage = action.payload
            })
    },
})

export const { logout, resetOtpState, resetVrfyState } = authSlice.actions
export default authSlice.reducer