import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice"
import documentReducer from "./slices/documentSlice"
import tagReducer from "./slices/tagSlice"
import uiReducer from "./slices/uiSlice"

const store = configureStore({
    reducer: {
        auth: authReducer,
        document: documentReducer,
        tag: tagReducer,
        ui: uiReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
})

export default store