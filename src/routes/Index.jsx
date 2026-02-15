import Login from "../pages/auth/Login";
// Protected routes components
import Dashboard from "../pages/dashboard/Index";
import Register from "../pages/auth/Register"



export const routes = [
    { path: "/dashboard", index: false, element: <Dashboard />  },
    { path: "/users", index: false, element: <Register />  },
]