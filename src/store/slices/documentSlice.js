import { createSlice } from "@reduxjs/toolkit";
import { uploadDocument, searchDocuments, fetchPersonalNames, fetchDepartments } from '../../features/document/documentThunk'

// upld = upload doc
// upld = upload doc
const initialState = {
    upldLoading: false,
    upldSuccess: false,
    upldError: false,
    upldMessage: null,
    upldDocData: null,

    srchLoading: false,
    srchSuccess: false,
    srchError: false,
    srchMessage: null,
    srchDocData: null,

    tagsLoading: false,
    tagsSuccess: false,
    tagsError: false,
    tagsMessage: null,
    personalNames: ['John', 'Tom', 'Emily', 'Michael', 'Sarah', 'David', 'Lisa', 'James'],
    departments: ['Accounts', 'HR', 'IT', 'Finance', 'Marketing', 'Operations', 'Sales', 'Legal'],
    searchResults: [],

    
}

const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {
        resetUploadState: (state) => {
            state.upldLoading = false,
                state.upldSuccess = false,
                state.upldError = false,
                state.upldMessage = null
        },
        
        clearSearchParams: (state) => {
            state.searchParams = initialState.searchParams;
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
        },
        resetSearchState: (state) => {
            state.srchLoading = false,
                state.srchSuccess = false,
                state.srchError = false,
                state.srchMessage = null
        }
    },

    extraReducers: (builder) => {
        builder
            // Fetch Personal Names
            .addCase(fetchPersonalNames.fulfilled, (state, action) => {
                state.personalNames = action.payload.names || action.payload || state.personalNames;
            })
            // Fetch Departments
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.departments = action.payload.departments || action.payload || state.departments;
            })
            // Upload document
            .addCase(uploadDocument.pending, (state) => {
                state.upldLoading = true
            })
            .addCase(uploadDocument.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.upldLoading = false
                    state.upldSuccess = true
                    state.upldMessage = action.payload.message
                } else {
                    state.upldLoading = false
                    state.Error = true
                    state.upldMessage = action.payload.message
                }

            })
            .addCase(uploadDocument.rejected, (state, action) => {
                state.upldLoading = false
                state.upldError = true
                state.upldMessage = action.payload
            })

            // Search document
            .addCase(searchDocuments.pending, (state) => {
                state.srchLoading = true
            })
            .addCase(searchDocuments.fulfilled, (state, action) => {
                if (action.payload.status) {
                    state.srchLoading = false
                    state.srchSuccess = true
                    state.srchError = false
                    state.srchMessage = null
                    state.srchDocData = action.payload
                }
                else {
                    state.srchLoading = false
                    state.srchSuccess = false
                    state.srchError = true
                    state.srchMessage = null
                }
            })
            .addCase(searchDocuments.rejected, (state, action) => {
                state.srchLoading = false
                state.srchError = true
                state.srchMessage = action.payload
            })
    },
})

export const { resetUploadState, clearSearchParams, clearSearchResults, resetSearchState } = documentSlice.actions
export default documentSlice.reducer