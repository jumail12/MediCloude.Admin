import { Box, useMediaQuery } from "@mui/material";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/auth/Login";
import Sidebar from "./components/Sidebar";
import VerificationRequests from "./pages/VerificationRequests";
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
