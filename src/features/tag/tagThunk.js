import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/services/api/apiRequest";

export const documentTags = createAsyncThunk(
    'tag/documentTags',
    async (payload, {rejectWithValue}) => {
        try {
            return await apiRequest({
                method: 'post',
                url: 'documentTags',
                data: payload
            })
        } catch (error) {
            return rejectWithValue(err.response?.data?.message || 'Save tags failed')
        }
    }
)