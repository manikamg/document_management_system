import { createSlice } from "@reduxjs/toolkit";
import { uploadDocument, searchDocument } from '../../features/document/documentThunk'

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
    srchDocData: null
}

const documentSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {
        resetUpldState: (state) => {
            state.upldLoading = false,
            state.upldSuccess = false,
            state.upldError = false,
            state.upldMessage = null
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
            // Upload document
            .addCase(uploadDocument.pending, (state) => {
                state.upldLoading = true
            })
            .addCase(uploadDocument.fulfilled, (state, action) => {
                state.upldLoading = false
                state.upldSuccess = true
                state.upldDocData = action.payload.data,
                state.upldMessage = null
            })
            .addCase(uploadDocument.rejected, (state, action) => {
                state.upldLoading = false
                state.upldError = true
                state.upldMessage = action.payload
            })

            // Search document
            .addCase(searchDocument.pending, (state) => {
                state.srchLoading = true
            })
            .addCase(searchDocument.fulfilled, (state, action) => {
                state.srchLoading = false
                state.srchSuccess = true
                state.srchDocData = action.payload
            })
            .addCase(searchDocument.rejected, (state, action) => {
                state.srchLoading = false
                state.srchError = true
                state.srchMessage = action.payload
            })
    },
})

export const { resetUpldState, resetSearchState } = documentSlice.actions
export default documentSlice.reducer