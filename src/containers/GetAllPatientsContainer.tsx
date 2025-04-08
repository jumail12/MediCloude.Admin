import {
  Box,
  Pagination,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  InputAdornment,
  IconButton,
  Button,
  Chip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { businessAxios } from "../api/axiosInstance";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";

const GetAllPatientsContainer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [name, setName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setName(searchTerm);
      setCurrentPage(1); // Reset to first page when searching
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: patients, isLoading: patientLoading } = useQuery({
    queryKey: ["patients", currentPage, name],
    queryFn: async () => {
      const res = await businessAxios.get(
        `/AdminView/patients?name=${name}&pageNumber=${currentPage}&pageSize=${pageSize}`
      );
      return (
        res.data.data ?? {
          total_pages: 0,
          items: [],
        }
      );
    },
  });



  const handlePageChange = (_: any, value: number) => {
    setCurrentPage(value);
  };

  const nav=useNavigate();

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
        Patient Management
      </Typography>

      {/* Search Filter */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search patients by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <IconButton onClick={handleClearSearch}>
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
      </Box>

      {/* Patient Table */}
      {patientLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead sx={{ backgroundColor: "#3CBDED" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Patient ID
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {patients?.items?.length > 0 ? (
                  patients.items.map((patient: any) => (
                    <TableRow key={patient.patient_id}>
                      <TableCell>{patient.patient_id}</TableCell>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {patient.patient_name || "N/A"}
                        </Typography>
                      </TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={patient.isBlocked ? "Blocked" : "Active"}
                          color={patient.isBlocked ? "error" : "success"}
                          variant="outlined"
                          icon={
                            patient.isBlocked ? (
                              <BlockIcon />
                            ) : (
                              <CheckCircleIcon />
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                       
                          <Button
                            variant="contained"
                            color="info"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={()=>nav(`/patients/${patient.patient_id}`)}
                          >
                            View
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography variant="body1" color="textSecondary">
                        No patients found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {patients?.total_pages > 1 && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={4}
              width="100%"
            >
              <Pagination
                count={patients.total_pages}
                page={currentPage}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderColor: "primary.main",
                  },
                  "& .Mui-selected": {
                    backgroundColor: "primary.main",
                    color: "white",
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default GetAllPatientsContainer;
