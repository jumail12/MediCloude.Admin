import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { businessAxios } from "../api/axiosInstance";
import { toast } from "sonner";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import EventNoteIcon from "@mui/icons-material/EventNote";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";


const PatientByIdContainer = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: patient, isLoading } = useQuery({
    queryKey: ["patient", pid],
    queryFn: async () => {
      const res = await businessAxios.get(`/AdminView/patient-id?Id=${pid}`);
      return (
        res.data.data ?? {
          patient_id: "",
          patient_name: "",
          email: "",
          isBlocked: false,
          total_appointments_taken: 0,
          total_appointments_completed: 0,
          total_appointments_pending: 0,
          total_spended: 0,
          your_profit: 0,
        }
      );
    },
  });

  
  const blockMutation = useMutation({
    mutationFn: async () => {
      const res = await businessAxios.patch(
        `/AdminView/patient/block-unblock?id=${pid}`
      );
      return res.data.data;
    },
    onSuccess: (re:any) => {
      queryClient.invalidateQueries({ queryKey: ["patient", pid] });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success(re || "Patient status updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error|| "Failed to update patient status"
      );
    },
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Back to Patients
      </Button>

      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
        Patient Details
      </Typography>

      <Grid container spacing={3}>
        {/* Patient Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              <PersonIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Patient ID
              </Typography>
              <Typography variant="body1">{patient?.patient_id}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Name
              </Typography>
              <Typography variant="body1">
                {patient?.patient_name || "N/A"}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                <EmailIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Email
              </Typography>
              <Typography variant="body1">{patient?.email}</Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">
                Status
              </Typography>
              <Chip
                label={patient?.isBlocked ? "Blocked" : "Active"}
                color={patient?.isBlocked ? "error" : "success"}
                icon={patient?.isBlocked ? <BlockIcon /> : <CheckCircleIcon />}
                sx={{ fontWeight: "bold" }}
              />
            </Box>

            <Button
              variant="contained"
              color={patient?.isBlocked ? "success" : "error"}
              startIcon={
                patient?.isBlocked ? <CheckCircleIcon /> : <BlockIcon />
              }
              onClick={() => blockMutation.mutate()}
              disabled={blockMutation.isPending}
              fullWidth
              sx={{ mt: 2 }}
            >
              {patient?.isBlocked ? "Unblock Patient" : "Block Patient"}
              {blockMutation.isPending && (
                <CircularProgress size={20} sx={{ ml: 1 }} />
              )}
            </Button>
          </Paper>
        </Grid>

        {/* Appointment Statistics */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              <EventNoteIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              Appointment Statistics
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h5" fontWeight="bold">
                    {patient?.total_appoinments_taken || 0}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Appointments
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="success.main"
                  >
                    {patient?.toatal_appoinments_completed || 0}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Completed
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="warning.main"
                  >
                    {patient?.toatal_appoinments_pending || 0}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Pending
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Financial Information */}
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              <MonetizationOnIcon sx={{ verticalAlign: "middle", mr: 1 }} />
              Financial Information
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="h5" fontWeight="bold">
                    ${patient?.toatal_spended?.toFixed(2) || "0.00"}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Total Spent
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    ${patient?.your_profit?.toFixed(2) || "0.00"}
                  </Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Your Profit
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientByIdContainer;
