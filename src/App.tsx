
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { GroupProvider } from "./contexts/GroupContext";

// Page imports
import Layout from "./components/Layout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Groups from "./pages/groups/Groups";
import GroupDetail from "./pages/groups/GroupDetail";
import CreateGroup from "./pages/groups/CreateGroup";
import JoinGroup from "./pages/groups/JoinGroup";
import Logs from "./pages/logs/Logs";
import Leaderboard from "./pages/leaderboard/Leaderboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GroupProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/auth">
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Route>
              
              {/* App Routes */}
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
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </GroupProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
