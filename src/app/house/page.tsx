"use client";
import React, { useEffect, useState } from "react";
import "../globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";

interface Home {
  id: number;
  code: string;
  numberOfRooms: number;
  rent: number;
  isOccupied: boolean,
  homeId: number

}

function House() {
  const [homes, setHomes] = useState<Home[]>([]);
  const [formData, setFormData] = useState({
    code: "",
    numberOfRooms: 0,
    rent: 0,
    homeId: 1
  });

  const [formErrors, setFormErrors] = useState({
    code: false,
    numberOfRooms: false,
    rent: false,
  });

  const fetchHomes = async () => {
    try {
      const response = await fetch(
        "https://tenant-home-production.up.railway.app/houses"
      );
      const data = await response.json();
      setHomes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des homes :", error);
    }
  };

  useEffect(() => {
    fetchHomes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [statusMessage, setStatusMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const validateForm = () => {
    const errors = {
      code: !formData.code,
      numberOfRooms: !formData.numberOfRooms,
      rent: !formData.rent,
    };

    setFormErrors(errors);

    return !Object.values(errors).includes(true); // Return true if no error
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      setStatusMessage("Tous les champs doivent être remplis.");
      setSeverity("error");
      setOpenSnackbar(true);
      return; 
    }

    try {
      const response = await fetch(
        "https://tenant-home-production.up.railway.app/houses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout des données.");
      }

      setStatusMessage("Données ajoutées avec succès.");
      setSeverity("success");
      setFormData({
        code: "",
        numberOfRooms:0 ,
        rent: 0,
        homeId:1
      });
      setFormErrors({ code: false, numberOfRooms: false, rent: false });
      await fetchHomes();
    } catch {
      setStatusMessage("Une erreur est survenue.");
      setSeverity("error");
    }
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedHomeToDelete, setSelectedHomeToDelete] = useState<Home | null>(null);

  const handleDeleteClick = (home: Home) => {
    setSelectedHomeToDelete(home);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedHomeToDelete) {
      try {
        const response = await fetch(
          `https://tenant-home-production.up.railway.app/houses/${selectedHomeToDelete.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la suppression.");
        }

        setStatusMessage("Maison supprimée avec succès");
        setSeverity("success");
        setHomes(
          homes.filter((home) => home.id !== selectedHomeToDelete.id)
        );
      } catch {
        setStatusMessage("Une erreur est survenue");
        setSeverity("error");
      }
      setOpenSnackbar(true);
    }
    setOpenDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setOpenDeleteDialog(false);
  };

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedHome, setSelectedHome] = useState<Home | null>(null);

  const handleEditClick = (home: Home) => {
    setSelectedHome(home);
    setFormData({
      code: home.code,
      numberOfRooms: home.numberOfRooms,
      rent: home.rent,
      homeId: home.homeId
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSaveChanges = async () => {
    if (selectedHome) {
      try {
        const response = await fetch(
          `https://tenant-home-production.up.railway.app/houses/${selectedHome.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors de la mise à jour des données.");
        }

        setStatusMessage("Donnée mise à jour avec succès.");
        setSeverity("success");
        setOpenSnackbar(true);

        await fetchHomes();
        setOpenDialog(false);
      } catch {
        setStatusMessage("Une erreur est survenue.");
        setSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  return (
    <div className="container1">
      <div className="header1">
        <Header />
      </div>

      <div className="main-content1">
        <Sidebar />
        <div className="home1">
          <Box sx={{ padding: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Code"
                  variant="outlined"
                  fullWidth
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  size="small"
                  autoComplete="off"
                  required
                  error={formErrors.code}
                  helperText={formErrors.code ? "Ce champ est requis" : ""}
                  sx={{ marginBottom: 2 }} // Adding space below the input
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Number of rooms"
                  variant="outlined"
                  fullWidth
                  name="numberOfRooms"
                  value={formData.numberOfRooms}
                  onChange={handleChange}
                  size="small"
                  autoComplete="off"
                  required
                  error={formErrors.numberOfRooms}
                  helperText={formErrors.numberOfRooms ? "Ce champ est requis" : ""}
                  sx={{ marginBottom: 2 }} // Adding space below the input
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Rent"
                  variant="outlined"
                  fullWidth
                  name="rent"
                  value={formData.rent}
                  onChange={handleChange}
                  size="small"
                  autoComplete="off"
                  required
                  error={formErrors.rent}
                  helperText={formErrors.rent ? "Ce champ est requis" : ""}
                  sx={{ marginBottom: 2 }} // Adding space below the input
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleCreate}
                >
                  Ajouter
                </Button>
              </Grid>
            </Grid>

            <Snackbar
              open={openSnackbar}
              autoHideDuration={3000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: "100%" }}>
                {statusMessage}
              </Alert>
            </Snackbar>

            <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogContent>
                Êtes-vous sûr de vouloir supprimer cette maison ?
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteCancel} color="primary">
                  Annuler
                </Button>
                <Button onClick={handleDeleteConfirm} color="secondary">
                  Confirmer
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Modifier la maison</DialogTitle>
              <DialogContent>
                <TextField
                  label="Code"
                  variant="outlined"
                  fullWidth
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  size="small"
                  autoComplete="off"
                  required
                  sx={{ marginBottom: 2 }} // Adding space below the input
                />
                <TextField
                  label="number of rooms"
                  variant="outlined"
                  fullWidth
                  name="number of rooms"
                  value={formData.numberOfRooms}
                  onChange={handleChange}
                  size="small"
                  autoComplete="off"
                  required
                  sx={{ marginBottom: 2 }} // Adding space below the input
                />
                <TextField
                  label="Rent"
                  variant="outlined"
                  fullWidth
                  name="rent"
                  value={formData.rent}
                  onChange={handleChange}
                  size="small"
                  autoComplete="off"
                  required
                  sx={{ marginBottom: 2 }} // Adding space below the input
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Annuler
                </Button>
                <Button onClick={handleSaveChanges} color="secondary">
                  Sauvegarder
                </Button>
              </DialogActions>
            </Dialog>

            <TableContainer>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell className="table-header">Numero</TableCell>
                    <TableCell align="right" className="table-header">
                      Code
                    </TableCell>
                    <TableCell align="right" className="table-header">
                      Number od rooms
                    </TableCell>
                    <TableCell align="right" className="table-header">
                      Rent
                    </TableCell>
                    <TableCell align="right" className="table-header">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {homes.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="right">{row.code}</TableCell>
                      <TableCell align="right">{row.numberOfRooms}</TableCell>
                      <TableCell align="right">{row.rent}</TableCell>
                      <TableCell align="right">
                        <Button sx={{ fontSize: "16px" }} onClick={() => handleDeleteClick(row)}>
                          <DeleteOutlineOutlinedIcon
                            sx={{
                              fontSize: "16px",
                              "&:hover": {
                                fontSize: "20px",
                                color: "red",
                              },
                            }}
                          />
                        </Button>
                        <Button sx={{ fontSize: "16px" }} onClick={() => handleEditClick(row)}>
                          <ModeEditOutlinedIcon
                            sx={{
                              fontSize: "16px",
                              "&:hover": {
                                fontSize: "20px",
                                color: "blue",
                              },
                            }}
                          />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default House;
