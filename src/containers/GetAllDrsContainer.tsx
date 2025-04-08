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
    Avatar,
  } from "@mui/material";
  import { useQuery } from "@tanstack/react-query";
  import { useState, useEffect } from "react";
  import { businessAxios } from "../api/axiosInstance";
  import { useNavigate } from "react-router-dom";
  import SearchIcon from "@mui/icons-material/Search";
  import ClearIcon from "@mui/icons-material/Clear";
  import BlockIcon from "@mui/icons-material/Block";
  import CheckCircleIcon from "@mui/icons-material/CheckCircle";
  import VisibilityIcon from "@mui/icons-material/Visibility";
  import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
  import SchoolIcon from "@mui/icons-material/School";
  import WorkHistoryIcon from "@mui/icons-material/WorkHistory";
  
  const GetAllDrsContainer = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;
    const [name, setName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
  
    // Debounce search term
    useEffect(() => {
      const timer = setTimeout(() => {
        setName(searchTerm);
        setCurrentPage(1); // Reset to first page when searching
      }, 500);
  
      return () => clearTimeout(timer);
    }, [searchTerm]);
  
    const { data: allDrs, isLoading } = useQuery({
      queryKey: ["alldrs", currentPage, name],
      queryFn: async () => {
        const res = await businessAxios.get(
          `/AdminView/doctors?name=${name}&pageNumber=${currentPage}&pageSize=${pageSize}`
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
  
    const handleClearSearch = () => {
      setSearchTerm("");
    };
  
    const handleViewDoctor = (doctorId: string) => {
      navigate(`/doctors/${doctorId}`);
    };
  
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
          Doctor Management
        </Typography>
  
        {/* Search Filter */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search doctors by name..."
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
  
        {/* Doctor Table */}
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead sx={{ backgroundColor: "#3CBDED" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Profile</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Doctor</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Specialization</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Qualification</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Experience</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Status</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allDrs?.items?.length > 0 ? (
                    allDrs.items.map((doctor: any) => (
                      <TableRow key={doctor.Id}>
                        <TableCell>
                          <Avatar
                            src={doctor.profile}
                            alt={doctor.doctor_name}
                            sx={{ width: 56, height: 56 }}
                          >
                            {doctor.doctor_name?.charAt(0)}
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="bold">
                            {doctor.doctor_name || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <MedicalServicesIcon color="primary" sx={{ mr: 1 }} />
                            {doctor.specialization || "N/A"}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <SchoolIcon color="secondary" sx={{ mr: 1 }} />
                            {doctor.qualification || "N/A"}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <WorkHistoryIcon color="action" sx={{ mr: 1 }} />
                            {doctor.field_experience ? `${doctor.field_experience} years` : "N/A"}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={doctor.isBlocked ? "Blocked" : "Active"}
                            color={doctor.isBlocked ? "error" : "success"}
                            icon={doctor.isBlocked ? <BlockIcon /> : <CheckCircleIcon />}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="info"
                            size="small"
                            startIcon={<VisibilityIcon />}
                            onClick={() => handleViewDoctor(doctor.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body1" color="textSecondary">
                          No doctors found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
  
            {/* Pagination */}
            {allDrs?.total_pages > 1 && (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mt={4}
                width="100%"
              >
                <Pagination
                  count={allDrs.total_pages}
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
  
  export default GetAllDrsContainer;