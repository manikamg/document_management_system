import { createSlice } from "@reduxjs/toolkit";
import { documentTags } from '../../features/tag/tagThunk'

// tag = upload doc
// tag = upload doc
const initialState = {
    tagLoading: false,
    tagSuccess: false,
    tagError: false,
    tagMessage: null,
    tagData: null,
}

const tagSlice = createSlice({
    name: 'document',
    initialState,
    reducers: {
        resetTagState: (state) => {
            state.tagLoading = false,
            state.tagSuccess = false,
            state.tagError = false,
            state.tagMessage = null
        },
        
    },

    extraReducers: (builder) => {
        builder
            // Upload document
            .addCase(documentTags.pending, (state) => {
                state.tagLoading = true
            })
            .addCase(documentTags.fulfilled, (state, action) => {
                state.tagLoading = false
                state.tagSuccess = true
                state.tagData = action.payload.data,
                state.tagMessage = null
            })
            .addCase(documentTags.rejected, (state, action) => {
                state.tagLoading = false
                state.tagError = true
                state.tagMessage = action.payload
            })
    },
})

export const { resetTagState } = tagSlice.actions
export default tagSlice.reducer