import {
  Box,
  Typography,
  Paper,
  Avatar,
  Divider,
  CircularProgress,
  Chip,
  Grid,
  Button,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { businessAxios } from "../api/axiosInstance";
import { useParams } from "react-router-dom";
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Male as MaleIcon,
  Female as FemaleIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  MonetizationOn as MonetizationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Pending as PendingIcon,
  DoneAll as DoneAllIcon,
} from "@mui/icons-material";
import { toast } from "sonner";

const DrByIdContainer = () => {
  const { drid } = useParams();
  const queryClient = useQueryClient();

  const { data: doctor, isLoading } = useQuery({
    queryKey: ["dr", drid],
    queryFn: async () => {
      const res = await businessAxios.get(`/AdminView/dr-by-id?drId=${drid}`);
      return (
        res.data.data ?? {
          your_profit: 0,
          total_appoinments_taken: 0,
          toatal_appoinments_completed: 0,
          toatal_appoinments_pending: 0,
          id: "",
          doctor_name: "",
          specialization: "",
          email: "",
          qualification: "",
          phone: "",
          profile: "",
          gender: "",
          field_experience: 0,
          isBlocked: false,
        }
      );
    },
  });

  const blockMutation = useMutation({
    mutationFn: async () => {
      const res = await businessAxios.patch(
        `/AdminView/dr-block/unblock?id=${drid}`
      );
      return res.data.data;
    },
    onSuccess: (re: any) => {
      queryClient.invalidateQueries({ queryKey: ["dr", drid] });
      queryClient.invalidateQueries({ queryKey: ["alldrs"] });
      toast.success(re || "Patient status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error || "Failed to update patient status");
    },
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="300px"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        Doctor Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Doctor Profile Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={doctor?.profile}
                sx={{ width: 150, height: 150, mb: 2 }}
              >
                {doctor?.doctor_name?.charAt(0)}
              </Avatar>
              <Typography variant="h5" fontWeight="bold">
                Dr. {doctor?.doctor_name}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                gutterBottom
              >
                {doctor?.specialization}
              </Typography>
              <Chip
                label={doctor?.isBlocked ? "Blocked" : "Active"}
                color={doctor?.isBlocked ? "error" : "success"}
                icon={doctor?.isBlocked ? <BlockIcon /> : <CheckCircleIcon />}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color={doctor?.isBlocked ? "success" : "error"}
                startIcon={
                  doctor?.isBlocked ? <CheckCircleIcon /> : <BlockIcon />
                }
                onClick={() => blockMutation.mutate()}
                disabled={blockMutation.isPending}
              >
                {blockMutation.isPending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : doctor?.isBlocked ? (
                  "Unblock Doctor"
                ) : (
                  "Block Doctor"
                )}
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <DetailItem
                icon={<EmailIcon />}
                label="Email"
                value={doctor?.email}
              />
              <DetailItem
                icon={<PhoneIcon />}
                label="Phone"
                value={doctor?.phone}
              />
              <DetailItem
                icon={<SchoolIcon />}
                label="Qualification"
                value={doctor?.qualification}
              />
              <DetailItem
                icon={
                  doctor?.gender?.toLowerCase() === "male" ? (
                    <MaleIcon />
                  ) : (
                    <FemaleIcon />
                  )
                }
                label="Gender"
                value={doctor?.gender}
              />
              <DetailItem
                icon={<WorkIcon />}
                label="Experience"
                value={`${doctor?.field_experience} years`}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Stats Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Performance Metrics
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  icon={<MonetizationOnIcon fontSize="large" />}
                  title="Total Profit"
                  value={`₹${doctor?.your_profit?.toFixed(2) || "0.00"}`}
                  color="#4caf50"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  icon={<CalendarTodayIcon fontSize="large" />}
                  title="Appointments Taken"
                  value={doctor?.total_appoinments_taken || 0}
                  color="#2196f3"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  icon={<DoneAllIcon fontSize="large" />}
                  title="Completed"
                  value={doctor?.toatal_appoinments_completed || 0}
                  color="#009688"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  icon={<PendingIcon fontSize="large" />}
                  title="Pending"
                  value={doctor?.toatal_appoinments_pending || 0}
                  color="#ff9800"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Doctor ID
            </Typography>
            <Chip label={doctor?.id} variant="outlined" sx={{ p: 1 }} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

// Helper Components
const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <Box display="flex" alignItems="center" mb={2}>
    <Box mr={2} color="text.secondary">
      {icon}
    </Box>
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value || "N/A"}</Typography>
    </Box>
  </Box>
);

const StatCard = ({
  icon,
  title,
  value,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  color: string;
}) => (
  <Paper
    sx={{
      p: 2,
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: `${color}10`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 1,
    }}
  >
    <Box color={color} mb={1}>
      {icon}
    </Box>
    <Typography variant="h5" fontWeight="bold" gutterBottom>
      {value}
    </Typography>
    <Typography variant="subtitle2" color="text.secondary">
      {title}
    </Typography>
  </Paper>
);

export default DrByIdContainer;
