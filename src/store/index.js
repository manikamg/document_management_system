import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice"
import documentReducer from "./slices/documentSlice"
import tagReducer from "./slices/tagSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        document: documentReducer,
        tag: tagReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
})

export default store