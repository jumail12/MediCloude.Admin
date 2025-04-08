import {
  Box,
  Pagination,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { businessAxios } from "../api/axiosInstance";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: 1000,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: "80vh",
  overflowY: "auto",
};

const statusColors: Record<string, string> = {
  completed: "#4caf50",
  pending: "#ff9800",
  failed: "#f44336",
};

const AdminDashBoardContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const pageSize = 6;

  const {
    data: paymentDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard", currentPage],
    queryFn: async () => {
      const res = await businessAxios.get(
        `/AdminView/admin-dashboard?pageNumber=${currentPage}&pageSize=${pageSize}`
      );
      return (
        res.data.data ?? {
          profit: 0,
          sales: 0,
          total_appoinments_taken: 0,
          toatal_appoinments_completed: 0,
          toatal_appoinments_pending: 0,
          payment_pending: 0,
          payment_failed: 0,
          payment_deatils: {
            total_pages: 0,
            items: [],
          },
        }
      );
    },
  });

  const handlePageChange = (_: any, value: number) => {
    setCurrentPage(value);
  };

  const handleRowClick = (payment: any) => {
    setSelectedPayment(payment);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPayment(null);
  };

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Alert severity="error">Error loading payment details</Alert>;

  return (
    <Box>
      {/* Dashboard Summary */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
          mt: 4,
        }}
      >
        <SummaryCard
          title="Profit"
          value={`$${paymentDetails.profit.toFixed(2)}`}
        />
        <SummaryCard
          title="Sales"
          value={`$${paymentDetails.sales.toFixed(2)}`}
        />
        <SummaryCard
          title="Appointments Taken"
          value={paymentDetails.total_appoinments_taken}
        />
        <SummaryCard
          title="Appointments Completed"
          value={paymentDetails.toatal_appoinments_completed}
        />
        <SummaryCard
          title="Appointments Pending"
          value={paymentDetails.toatal_appoinments_pending}
        />
        <SummaryCard
          title="Payments Pending"
          value={paymentDetails.payment_pending}
        />
        <SummaryCard
          title="Payments Failed"
          value={paymentDetails.payment_failed}
        />
      </Box>

      {/* Payment Details Table */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Patient Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Appointment Date
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Payment Method</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentDetails.payment_deatils.items.map((payment: any) => (
              <TableRow
                key={payment.id}
                hover
                onClick={() => handleRowClick(payment)}
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f9f9f9" },
                }}
              >
                <TableCell>{payment.patient_name || "N/A"}</TableCell>
                <TableCell>
                  {new Date(payment.appointmentDate).toLocaleDateString()}
                </TableCell>
                <TableCell>{payment.appointmentTime}</TableCell>
                <TableCell>${payment.amount.toFixed(2)}</TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor:
                        statusColors[payment.paymentStatus.toLowerCase()] ||
                        "#e0e0e0",
                      color: "white",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {payment.paymentStatus}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Payment Details Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="payment-details-modal"
        aria-describedby="payment-details-description"
      >
        <Box sx={style}>
          {selectedPayment && (
            <>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: "bold", mb: 3 }}
              >
                Payment Details
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 2,
                }}
              >
                <DetailItem
                  label="Transaction ID"
                  value={selectedPayment.transactionId}
                />
                <DetailItem
                  label="Patient Name"
                  value={selectedPayment.patient_name || "N/A"}
                />
                <DetailItem label="Email" value={selectedPayment.email} />
                <DetailItem
                  label="Appointment Date"
                  value={new Date(
                    selectedPayment.appointmentDate
                  ).toLocaleDateString()}
                />
                <DetailItem
                  label="Appointment Time"
                  value={selectedPayment.appointmentTime}
                />
                <DetailItem
                  label="Amount"
                  value={`$${selectedPayment.amount.toFixed(2)}`}
                />
                <DetailItem
                  label="Payment Method"
                  value={selectedPayment.paymentMethod}
                />
                <DetailItem
                  label="Payment Status"
                  value={
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor:
                          statusColors[
                            selectedPayment.paymentStatus.toLowerCase()
                          ] || "#e0e0e0",
                        color: "white",
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {selectedPayment.paymentStatus}
                    </Box>
                  }
                />
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Pagination */}
      {!isLoading &&
        !isError &&
        paymentDetails.payment_deatils?.total_pages > 1 && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={4}
            width="100%"
          >
            <Pagination
              count={paymentDetails.payment_deatils.total_pages}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  backgroundColor: "black",
                  color: "white",
                  border: "1px solid white",
                },
                "& .Mui-selected": {
                  backgroundColor: "white",
                  color: "black",
                  fontWeight: "bold",
                },
              }}
            />
          </Box>
        )}
    </Box>
  );
};

const SummaryCard = ({ title, value }: { title: string; value: string | number }) => (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>
        {value}
      </Typography>
    </Paper>
  );
  

// Helper component for modal details
const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) => (
  <Box sx={{ mb: 2 }}>
    <Typography
      variant="subtitle2"
      sx={{ color: "text.secondary", fontWeight: "bold" }}
    >
      {label}
    </Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);

export default AdminDashBoardContainer;
