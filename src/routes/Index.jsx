import Login from "../pages/auth/Login";
// Protected routes components
import Dashboard from "../pages/dashboard/Index";
import Register from "../pages/auth/Register"
import UploadDocument from "../pages/document/UploadDocument"



export const routes = [
    { path: "/dashboard", index: false, element: <Dashboard />  },
    { path: "/users", index: false, element: <Register />  },
    { path: "/upload-document", index: false, element: <UploadDocument />  },
]