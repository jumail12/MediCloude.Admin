import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Typography,
    IconButton,
    Box
  } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
  
  interface RequestModalProps {
    open: boolean;
    request: {
      id: string;
      doctor_name: string;
      email: string;
      medical_license_number: string;
      specialization: string;
    } | null;
    handleClose: () => void;
    reqAccept: (requestId: any) => void;
    reqDenied: (requestId: any) => void;
    isPendingAcc: boolean;
    isPendingDen: boolean;
  }
  
  const RequestVerifyModal: React.FC<RequestModalProps> = ({
    reqAccept,
    reqDenied,
    isPendingAcc,
    isPendingDen,
    request,
    handleClose,
    open,
  }) => {
    if (!request) return null;
  
    return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" sx={{ borderRadius: "10px" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", borderBottom: "1px solid #ddd" }}>
          <DialogTitle sx={{ fontWeight: "bold", fontSize: "20px" }}>Doctor Verification</DialogTitle>
          <IconButton onClick={handleClose} sx={{ color: "#000" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
          <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: "10px" }}>
            {request.doctor_name}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: "5px" }}>
            <strong>Email:</strong> {request.email}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: "5px" }}>
            <strong>License:</strong> {request.medical_license_number}
          </Typography>
          <Typography variant="body2" sx={{ marginBottom: "10px", fontWeight: "bold", color: "#0288d1" }}>
            <strong>Specialization:</strong> {request.specialization}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between", padding: "16px" }}>
          <Button
            onClick={() => reqDenied(request.id)}
            variant="outlined"
            color="error"
            disabled={isPendingDen}
            sx={{ fontWeight: "bold", padding: "10px 20px" }}
          >
            {isPendingDen ? "Rejecting..." : "Reject"}
          </Button>
          <Button
            onClick={() => reqAccept(request.id)}
            variant="contained"
            sx={{ backgroundColor: "#3CBDED", color: "#ffffff", fontWeight: "bold", padding: "10px 20px" }}
            disabled={isPendingAcc}
          >
            {isPendingAcc ? "Approving..." : "Approve"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default RequestVerifyModal;
