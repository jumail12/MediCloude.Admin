import { Box, Button, TextField, Typography } from "@mui/material";
import { FormikProps } from "formik";
import React from "react";
import { useNavigate } from "react-router-dom";
import icon from "../..//assets/Images/icon.png";
import image from "../../assets/Images/admin.jpg";

interface LoginFormProps {
  formik: FormikProps<{
    email: string;
    password: string;
  }>;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ formik, isLoading }) => {
  const textFieldStyles = {
    color: "#000000",
    backgroundColor: "#F4F9FC",
    fontFamily: "Convergence",
    fontSize: "10px",
    width: "100%",
    "& .MuiInputBase-root": {
      height: "38px",
    },
    "& .MuiOutlinedInput-input": {
      padding: "10px",
    },
    "& .MuiInputLabel-root": {
      color: "#B3B4B5",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#B3B4B5",
    },
  };
  const nav = useNavigate();
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          width: { xs: "90%", md: "1130px" },
          height: "580px",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          display: "flex",
          overflow: "hidden",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          {/* Icon & Title */}
          <Box
            sx={{
              width: "90px",
              height: "90px",
              backgroundImage: `url(${icon})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          />
          <Typography
            sx={{
              fontSize: "32px",
              fontWeight: "800",
              fontFamily: "Convergence",
              color: "#000000",
              marginTop: "10px",
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            sx={{
              fontSize: "18px",
              fontWeight: "700",
              fontFamily: "Convergence",
              color: "#3CBDED",
            }}
          >
         Secure Admin Access
          </Typography>

          {/* Form */}
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
              width: "360px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            <TextField
              sx={textFieldStyles}
              label="Enter your email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              fullWidth
              required
            />
            <TextField
              sx={textFieldStyles}
              label="Password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              fullWidth
              required
            />

            <Typography
              component="span"
              onClick={() => nav("/auth/forgotpw")}
              sx={{
                color: "#000000",
                cursor: "pointer",
                fontFamily: "Convergence",
                position: "relative",
                left: 120,
                fontWeight: "700",
                "&:hover": {
                  color: "#333333",
                },
              }}
            >
              Forgot password
            </Typography>

            <Button
              sx={{
                width: "100%",
                height: "40px",
                backgroundColor: "#000000",
                color: "#FFFFFF",
                fontSize: "16px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#333333",
                },
              }}
              type="submit"
              variant="contained"
            >
              {isLoading ? "Loading..." : "Sign In"}
            </Button>

            <Typography
              sx={{
                marginTop: "8px",
                fontWeight: "600",
                textAlign: "center",
                fontSize: "12px",
                fontFamily: "Convergence",
                color: "#B3B4B5",
              }}
            >
              Dont’t have an account?{" "}
              <Typography
                component="span"
                onClick={() => nav("/auth/register")}
                sx={{
                  color: "#000000",
                  cursor: "pointer",
                  fontFamily: "Convergence",
                  fontWeight: "700",
                  "&:hover": {
                    color: "#333333",
                  },
                }}
              >
                Sign up
              </Typography>
            </Typography>
          </Box>
        </Box>

        {/* Right Section - Image Background */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "block" }, // Hide on small screens
            backgroundImage: `url(${image})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Box>
    </Box>
  );
};

export default LoginForm;
