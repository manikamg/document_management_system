import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/services/api/apiRequest";

// Upload document thunk
export const uploadDocument = createAsyncThunk(
    'document/upload',
    async (payload, {rejectWithValue}) => {
        try {
            return await apiRequest({
                method: 'post',
                url: 'saveDocumentEntry',
                data: payload
            })
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Upload document failed')
        }
    }
)
// Upload document thunk
export const searchDocument = createAsyncThunk(
    'document/search',
    async (payload, {rejectWithValue}) => {
        try {
            return await apiRequest({
                method: 'post',
                url: 'searchDocumentEntry',
                data: payload
            })
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Search document failed')
        }
    }
)