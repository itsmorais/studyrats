
import { useAuth } from "@/contexts/AuthContext";
import AuthRoutes from "./AuthRoutes.routes";
import ProtectRoutes from "./ProtectRoutes.routes";



const AppRoutes = () => {
    const {user} = useAuth()

    return user ? <ProtectRoutes/> : <AuthRoutes/>
   

}

export default AppRoutes