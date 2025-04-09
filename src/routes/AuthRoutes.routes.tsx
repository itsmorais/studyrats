import { Routes, Route } from "react-router-dom";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import NotFound from "@/pages/NotFound";


const AuthRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={<Login />}
            />

            <Route
                path="/auth/register"
                element={<Register />}
            />

            <Route path="*" element={<NotFound />} />


        </Routes>
    );
}


export default AuthRoutes