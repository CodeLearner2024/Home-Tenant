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
  Paper,
  TextField,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";

interface Home {
  id: number;
  code: string;
  name: string;
  adresse: string;
}

function Urupangu() {
  const [homes, setHomes] = useState<Home[]>([]);
  const [filteredHomes, setFilteredHomes] = useState<Home[]>([]);
  const [search, setSearch] = useState<string>("");

  const fetchHomes = async () => {
    try {
      const response = await fetch("https://tenant-home-production.up.railway.app/homes");
      const data = await response.json();
      setHomes(data);
      setFilteredHomes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des homes :", error);
    }
  };

  useEffect(() => {
    fetchHomes();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredHomes(homes);
    } else {
      const lowerSearch = search.toLowerCase();
      setFilteredHomes(
        homes.filter((home) => home.code.toLowerCase().includes(lowerSearch))
      );
    }
  }, [search, homes]);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    adresse: "",
  });

  const [formErrors, setFormErrors] = useState({
    code: false,
    name: false,
    adresse: false,
  });

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
      name: !formData.name,
      adresse: !formData.adresse,
    };
    setFormErrors(errors);
    return !Object.values(errors).includes(true);
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      setStatusMessage("Tous les champs doivent être remplis.");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch("https://tenant-home-production.up.railway.app/homes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Erreur lors de l'ajout.");

      setStatusMessage("Données ajoutées avec succès.");
      setSeverity("success");
      setFormData({ code: "", name: "", adresse: "" });
      setFormErrors({ code: false, name: false, adresse: false });
      await fetchHomes();
      setOpenCreateDialog(false); // Fermer le popup après succès
    } catch {
      setStatusMessage("Une erreur est survenue.");
      setSeverity("error");
    }
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

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
          `https://tenant-home-production.up.railway.app/homes/${selectedHomeToDelete.id}`,
          { method: "DELETE" }
        );

        if (!response.ok) throw new Error("Erreur lors de la suppression.");

        setStatusMessage("Maison supprimée avec succès");
        setSeverity("success");
        setHomes(homes.filter((home) => home.id !== selectedHomeToDelete.id));
      } catch {
        setStatusMessage("Une erreur est survenue");
        setSeverity("error");
      }
      setOpenSnackbar(true);
    }
    setOpenDeleteDialog(false);
  };

  const handleDeleteCancel = () => setOpenDeleteDialog(false);

  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedHome, setSelectedHome] = useState<Home | null>(null);

  const handleEditClick = (home: Home) => {
    setSelectedHome(home);
    setFormData({
      code: home.code,
      name: home.name,
      adresse: home.adresse,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveChanges = async () => {
    if (selectedHome) {
      try {
        const response = await fetch(
          `https://tenant-home-production.up.railway.app/homes/${selectedHome.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (!response.ok) throw new Error("Erreur lors de la mise à jour.");

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

  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);

  const handleOpenCreateDialog = () => {
    setFormData({ code: "", name: "", adresse: "" });
    setFormErrors({ code: false, name: false, adresse: false });
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
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
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Rechercher par code"
                  variant="outlined"
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleOpenCreateDialog}
                >
                  Ajouter
                </Button>
              </Grid>
            </Grid>

            {/* Snackbar */}
            <Snackbar
              open={openSnackbar}
              autoHideDuration={3000}
              onClose={handleCloseSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: "100%" }}>
                {statusMessage}
              </Alert>
            </Snackbar>

            {/* Create Dialog (Popup pour Ajouter) */}
            <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog}>
              <DialogTitle>Ajouter une maison</DialogTitle>
              <DialogContent>
                <TextField
                  label="Code"
                  name="code"
                  fullWidth
                  value={formData.code}
                  onChange={handleChange}
                  error={formErrors.code}
                  helperText={formErrors.code ? "Champ requis" : ""}
                  margin="dense"
                />
                <TextField
                  label="Nom"
                  name="name"
                  fullWidth
                  value={formData.name}
                  onChange={handleChange}
                  error={formErrors.name}
                  helperText={formErrors.name ? "Champ requis" : ""}
                  margin="dense"
                />
                <TextField
                  label="Adresse"
                  name="adresse"
                  fullWidth
                  value={formData.adresse}
                  onChange={handleChange}
                  error={formErrors.adresse}
                  helperText={formErrors.adresse ? "Champ requis" : ""}
                  margin="dense"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseCreateDialog}>Annuler</Button>
                <Button onClick={handleCreate} color="primary">
                  Ajouter
                </Button>
              </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={openDeleteDialog} onClose={handleDeleteCancel}>
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogContent>
                Êtes-vous sûr de vouloir supprimer cette maison ?
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDeleteCancel}>Annuler</Button>
                <Button onClick={handleDeleteConfirm} color="secondary">
                  Confirmer
                </Button>
              </DialogActions>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>Modifier la maison</DialogTitle>
              <DialogContent>
                <TextField
                  label="Code"
                  name="code"
                  fullWidth
                  value={formData.code}
                  onChange={handleChange}
                  margin="dense"
                />
                <TextField
                  label="Nom"
                  name="name"
                  fullWidth
                  value={formData.name}
                  onChange={handleChange}
                  margin="dense"
                />
                <TextField
                  label="Adresse"
                  name="adresse"
                  fullWidth
                  value={formData.adresse}
                  onChange={handleChange}
                  margin="dense"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Annuler</Button>
                <Button onClick={handleSaveChanges} color="secondary">
                  Sauvegarder
                </Button>
              </DialogActions>
            </Dialog>

            {/* Table */}
            <TableContainer component={Paper} sx={{ marginTop: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Numéro</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Nom</TableCell>
                    <TableCell>Adresse</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHomes.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.code}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.adresse}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleDeleteClick(row)}>
                          <DeleteOutlineOutlinedIcon />
                        </Button>
                        <Button onClick={() => handleEditClick(row)}>
                          <ModeEditOutlinedIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredHomes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Aucun résultat trouvé.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Urupangu;
