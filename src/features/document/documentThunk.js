import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "@/services/api/apiRequest";
import { documentAPI } from "../../services/mock/mockStore";

// Upload document thunk
export const uploadDocument = createAsyncThunk(
    'document/upload',
    async (payload, { rejectWithValue }) => {
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
export const searchDocuments = createAsyncThunk(
    'document/search',
    async (payload, { rejectWithValue }) => {
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

export const fetchTags = createAsyncThunk(
    'document/fetchTags',
    async (_, { rejectWithValue }) => {
        try {
            const response = await documentAPI.getTags();
            return response.data;
        } catch (error) {
            return rejectWithValue({
                message: getErrorMessage(error, 'Failed to fetch tags'),
                type: classifyError(error),
                retryable: isRetryable(error),
            });
        }
    }
);

export const fetchPersonalNames = createAsyncThunk(
    'document/fetchPersonalNames',
    async (_, { rejectWithValue }) => {
        try {
            const response = await documentAPI.getPersonalNames();
            return response.data;
        } catch (error) {
            return rejectWithValue({
                message: getErrorMessage(error, 'Failed to fetch names'),
                type: classifyError(error),
                retryable: isRetryable(error),
            });
        }
    }
);

export const fetchDepartments = createAsyncThunk(
    'document/fetchDepartments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await documentAPI.getDepartments();
            return response.data;
        } catch (error) {
            return rejectWithValue({
                message: getErrorMessage(error, 'Failed to fetch departments'),
                type: classifyError(error),
                retryable: isRetryable(error),
            });
        }
    }
);