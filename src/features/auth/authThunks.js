import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/services/api/apiRequest";

// Request Login OTP thunk
export const requestLoginOtp = createAsyncThunk(
    'auth/requestLoginOtp',
    async (payload, {rejectWithValue}) => {
        try {
            return await apiRequest({
                method: 'post',
                url: 'generateOTP',
                data: payload
            })
        } catch (error) {
            return rejectWithValue(err.response?.data?.message || 'OTP send failed')
        }
    }
)

// Verify Login OTP thunk
export const verifyLoginOtp = createAsyncThunk(
    'auth/verifyLoginOtp',
    async (payload, {rejectWithValue}) => {
        try {
            return await apiRequest({
                method: 'post',
                url: 'validateOTP',
                data: payload
            })
        } catch (error) {
            return rejectWithValue(err.response?.data?.message || 'Verify OTP failed')
        }
    }
)
