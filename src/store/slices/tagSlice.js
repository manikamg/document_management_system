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
    name: 'tag',
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
                console.log(action.payload)
                // state.tagLoading = false
                // state.tagSuccess = true
                // state.tagSuccess = false
                // state.tagMessage = null
                // state.tagData = action.payload.data,
            })
            .addCase(documentTags.rejected, (state, action) => {
                // state.tagLoading = false
                // state.tagError = true
                // state.tagMessage = action.payload
            })
    },
})

export const { resetTagState } = tagSlice.actions
export default tagSlice.reducer