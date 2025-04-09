import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import GroupDetail from "@/pages/groups/GroupDetail";
import Leaderboard from "@/pages/leaderboard/Leaderboard";
import Logs from "@/pages/logGroup/Logs";
import NotFound from "@/pages/NotFound";
import Layout from "@/components/Layout";
import Groups from "@/pages/groups/Groups";
import CreateGroup from "@/pages/groups/CreateGroup";
import JoinGroup from "@/pages/groups/JoinGroup";



const ProtectRoutes = () => {
    return (
        <Routes>


            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="groups">
                    <Route index element={<Groups />} />
                    <Route path=":id" element={<GroupDetail />} />
                    <Route path="create" element={<CreateGroup />} />
                    <Route path="join" element={<JoinGroup />} />
                </Route>
                <Route path="logs" element={<Logs />} />
                <Route path="leaderboard" element={<Leaderboard />} />
            </Route>

        </Routes>

    );

}


export default ProtectRoutes