import {
  Box,
  CircularProgress,
  Pagination,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Alert,
  Button,
} from "@mui/material";
import { useState } from "react";
import { authAxios } from "../api/axiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PersonIcon from "@mui/icons-material/Person";
import { toast } from "sonner";
import RequestVerifyModal from "../components/modals/RequestVerifyModal";

const VerificationRequestsContainer = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["requests", currentPage],
    queryFn: async () => {
      const res = await authAxios.get(
        `/AdminAuth/all-dr-verify-pending?pageNumber=${currentPage}&pageSize=${pageSize}`
      );
      return res.data.data;
    },
  });

  const reqAcceptMutation = useMutation({
    mutationFn: async (drId) => {
      const res = await authAxios.patch(`/AdminAuth/dr-license-approve`, {
        drId,
      });
      return res.data.data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success(data);
      handleCloseModal();
    },
    onError: (err: any) => {
      toast.error(err);
    },
  });

  const reqRejectMutation = useMutation({
    mutationFn: async (drId) => {
      const res = await authAxios.patch(`/AdminAuth/dr-license-reject`, {
        drId,
      });
      return res.data.data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success(data);
      handleCloseModal();
    },
    onError: (err: any) => {
      toast.error(err);
    },
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleOpenModal = (request: any) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRequest(null);
  };

  const handlePageChange = (_: any, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        color: "#000000",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: "#000000", fontWeight: "bold", marginBottom: "60px" }}
      >
        Doctor Verification Requests
      </Typography>

      {isLoading && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="60vh"
        >
          <CircularProgress sx={{ color: "#000000" }} />
        </Box>
      )}

      {isError && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Alert
            severity="error"
            sx={{ backgroundColor: "#d32f2f", color: "#ffffff" }}
          >
            Failed to fetch data. Please try again later.
          </Alert>
        </Box>
      )}

      {!isLoading && !isError && data?.items?.length > 0 && (
        <Grid
          container
          spacing={5}
          justifyContent="center"
          sx={{ width: "100%", maxWidth: "1200px" }}
        >
          {data.items.map((doctor: any) => (
            <Grid item xs={12} sm={6} md={4} key={doctor.id}>
              <Card
                sx={{
                  backgroundColor: "#ffffff",
                  boxShadow: 3,
                  borderRadius: "20px",
                  textAlign: "center",
                  padding: "20px",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
                }}
              >
                <Avatar
                  sx={{
                    backgroundColor: "#000000",
                    margin: "auto",
                    width: 60,
                    height: 60,
                  }}
                >
                  <PersonIcon />
                </Avatar>
                <CardContent>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      color: "#000",
                      marginBottom: "8px",
                    }}
                  >
                    {doctor.doctor_name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#555", marginBottom: "5px" }}
                  >
                    <strong>Email:</strong> {doctor.email}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#555", marginBottom: "5px" }}
                  >
                    <strong>License:</strong> {doctor.medical_license_number}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#0288d1",
                      fontWeight: "bold",
                      marginBottom: "10px",
                    }}
                  >
                    <strong>Specialization:</strong> {doctor.specialization}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: "#000000",
                      color: "#fff",
                      marginTop: "10px",
                    }}
                    onClick={() => handleOpenModal(doctor)}
                  >
                    Verify Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {!isLoading && !isError && data?.items?.length === 0 && (
        <Typography align="center" mt={3} sx={{ color: "#000000" }}>
          No verification requests available.
        </Typography>
      )}

{data?.items.length > 0  && !isLoading && !isError && (
  <Box display="flex" justifyContent="center" mt={4}>
    <Pagination
      count={data?.total_pages}
      page={currentPage}
      onChange={handlePageChange}
      variant="outlined"
      shape="rounded"
      color="primary"
      sx={{
        button: { color: "#000000" },
        "& .Mui-selected": {
          backgroundColor: "#000000",
          color: "#ffffff",
        },
      }}
    />
  </Box>
)}


      {/* //modal */}
      <RequestVerifyModal
        open={modalOpen}
        handleClose={handleCloseModal}
        request={selectedRequest}
        reqAccept={reqAcceptMutation.mutate}
        reqDenied={reqRejectMutation.mutate}
        isPendingAcc={reqAcceptMutation.isPending}
        isPendingDen={reqRejectMutation.isPending}
      />
    </Box>
  );
};

export default VerificationRequestsContainer;
