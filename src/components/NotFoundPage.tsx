import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom"; // For navigation
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"; // MUI Icon

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        bgcolor: "#f9f9f9",
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 80, color: "#d32f2f" }} />
      <Typography variant="h2" fontWeight={600} mt={2} color="text.primary">
        404
      </Typography>
      <Typography variant="h5" color="text.secondary" mt={1}>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" mt={1}>
        The page you are looking for does not exist.
      </Typography>
      <Button 
        variant="contained" 
         
        sx={{ mt: 3, textTransform: "none",bgcolor:"#3CBDED" }} 
        onClick={() => navigate("/")}
      >
        Back to Home
      </Button>
    </Box>
  );
};

export default NotFoundPage;
