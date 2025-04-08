import { Box, useMediaQuery } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/auth/Login";
import Sidebar from "./components/Sidebar";
import VerificationRequests from "./pages/VerificationRequests";
import NotFoundPage from "./components/NotFoundPage";
import GetAllPatients from "./pages/GetAllPatients";
import PatientById from "./pages/PatientById";
import GetAllDrs from "./pages/GetAllDrs";
import DrById from "./pages/DrById";
import AdminDashBoard from "./pages/AdminDashBoard";

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const sidebarWidth = isSmallScreen ? 60 : 240;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {!isAuthPage && <Sidebar />}
      <Toaster position="top-right" richColors />
      <Box
        sx={{
          flexGrow: 1,
          ml: !isAuthPage ? `${sidebarWidth}px` : 0,
          overflowX: "hidden",
          transition: "margin-left 0.3s ease",
          p: !isAuthPage ? (isSmallScreen ? 1 : 3) : 0,
        }}
      >
        <Routes>
          <Route path="/" element={<AdminDashBoard/>}/>
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/patients" element={<GetAllPatients />} />
          <Route path="/patients/:pid" element={<PatientById />} />
          <Route path="/doctors" element={<GetAllDrs />} />
          <Route  path="/doctors/:drid" element={<DrById/>}/>

          <Route path="/auth">
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="/requests" element={<VerificationRequests />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
