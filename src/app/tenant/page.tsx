"use client";  // Cette ligne doit être placée au tout début du fichier

import React, { useState, useEffect } from "react";
import "../globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, MenuItem, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Snackbar } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';  // Icône pour l'œil
import { SelectChangeEvent } from '@mui/material/Select';

// Définir un type explicite pour un dépendant sans id
interface Dependent {
  firstname: string;
  lastname: string;
  relation: string;  // Relation devient une string qui correspond à l'enum
}

// Définir un type explicite pour les données du formulaire sans id
interface FormData {
  firstname: string;
  lastname: string;
  identityNumber: string;
  email: string;
  phoneNumber: string;
  dependentRequests: Dependent[]; // Liste des dépendants
}

// Enum des relations
enum RELATION {
  SPOUSE = "SPOUSE",
  CHILD = "CHILD",
  FAMILY_MEMBER = "FAMILY_MEMBER",
}

function Tenant() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    identityNumber: "",
    email: "",
    phoneNumber: "",
    dependentRequests: [{ firstname: "", lastname: "", relation: "" }],
  });
  const [message, setMessage] = useState<string>(""); // Message pour success/error
  const [openSnackbar, setOpenSnackbar] = useState(false); // Pour afficher la Snackbar
  const [tenants, setTenants] = useState<FormData[]>([]); // État pour stocker les tenants récupérés
  const [openDependentDialog, setOpenDependentDialog] = useState(false); // Pour gérer le popup des dépendants
  const [selectedDependents, setSelectedDependents] = useState<Dependent[]>([]); // Dépendants sélectionnés
  const [searchTerm, setSearchTerm] = useState<string>(""); // État pour la recherche par email

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Récupérer les tenants déjà enregistrés au chargement du composant
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await fetch("https://tenant-home-production.up.railway.app/tenants");
        const data = await response.json();

        if (response.ok && Array.isArray(data.content)) {
          setTenants(data.content); // Mettre à jour l'état avec les tenants récupérés
        } else {
          setMessage("Erreur lors de la récupération des tenants");
          setOpenSnackbar(true);
        }
      } catch {
        setMessage("Erreur lors de la récupération des tenants");
        setOpenSnackbar(true);
      }
    };

    fetchTenants();
  }, []); // L'effet s'exécute une seule fois au montage du composant

  // Filtrer les tenants selon l'email
  const filteredTenants = tenants.filter(tenant => tenant.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleAddDependentChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    const updatedDependents = [...formData.dependentRequests];
    updatedDependents[index] = {
      ...updatedDependents[index],
      [name]: value
    };
    setFormData((prevData) => ({
      ...prevData,
      dependentRequests: updatedDependents
    }));
  };

  const handleAddDependent = () => {
    setFormData((prevData) => ({
      ...prevData,
      dependentRequests: [...prevData.dependentRequests, { firstname: "", lastname: "", relation: "" }],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch("https://tenant-home-production.up.railway.app/tenants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Élément ajouté avec succès!");
        setOpenSnackbar(true);
        handleClose();
        setTenants((prevTenants) => [...prevTenants, formData]);
      } else {
        setMessage(data.message || "Erreur lors de l'ajout de l'élément");
        setOpenSnackbar(true);
      }
    } catch {
      setMessage("Erreur lors de l'ajout de l'élément");
      setOpenSnackbar(true);
    }

    setLoading(false);
  };

  const handleViewDependents = (dependents: Dependent[]) => {
    setSelectedDependents(dependents);  // Mettre à jour les dépendants sélectionnés
    setOpenDependentDialog(true);  // Ouvrir le popup des dépendants
  };

  const handleCloseDependentDialog = () => {
    setOpenDependentDialog(false);
  };

  return (
    <div className="container1">
      <div className="header1">
        <Header />
      </div>

      <div className="main-content1">
        <Sidebar />
        <div className="home1">
          <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <TextField
                label="Recherche par email"
                variant="outlined"
                size="small"
                fullWidth
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </Box>

            <Box flex={1} />

            <Button variant="contained" color="primary" onClick={handleClickOpen}>
              Ajouter
            </Button>
          </Box>

          {/* Tableau des tenants */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Prénom</TableCell>
                  <TableCell>Nom</TableCell>
                  <TableCell>Numéro identité</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Téléphone</TableCell>
                  <TableCell>Dépendants</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTenants.map((tenant, index) => (
                  <TableRow key={index}>
                    <TableCell>{tenant.firstname}</TableCell>
                    <TableCell>{tenant.lastname}</TableCell>
                    <TableCell>{tenant.identityNumber}</TableCell>
                    <TableCell>{tenant.email}</TableCell>
                    <TableCell>{tenant.phoneNumber}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleViewDependents(tenant.dependentRequests)}>
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Popup (Dialog) pour voir les dépendants */}
          <Dialog open={openDependentDialog} onClose={handleCloseDependentDialog} maxWidth="md">
            <DialogTitle>Dépendants</DialogTitle>
            <DialogContent>
              {selectedDependents.length > 0 ? (
                selectedDependents.map((dependent, index) => (
                  <Box key={index} display="flex" gap={2} flexDirection="column">
                    <div>{dependent.firstname} {dependent.lastname} - {dependent.relation}</div>
                  </Box>
                ))
              ) : (
                <div>Aucun dépendant disponible.</div>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDependentDialog} color="primary">
                Fermer
              </Button>
            </DialogActions>
          </Dialog>

          {/* Popup pour ajouter un tenant */}
          <Dialog open={open} onClose={handleClose} maxWidth="md">
            <DialogTitle>Ajouter</DialogTitle>
            <DialogContent>
              <TextField
                label="Prénom"
                variant="outlined"
                fullWidth
                value={formData.firstname}
                onChange={handleInputChange}
                name="firstname"
                margin="normal"
              />
              <TextField
                label="Nom"
                variant="outlined"
                fullWidth
                value={formData.lastname}
                onChange={handleInputChange}
                name="lastname"
                margin="normal"
              />
              <TextField
                label="Numéro d'identité"
                variant="outlined"
                fullWidth
                value={formData.identityNumber}
                onChange={handleInputChange}
                name="identityNumber"
                margin="normal"
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                value={formData.email}
                onChange={handleInputChange}
                name="email"
                margin="normal"
              />
              <TextField
                label="Numéro de téléphone"
                variant="outlined"
                fullWidth
                value={formData.phoneNumber}
                onChange={handleInputChange}
                name="phoneNumber"
                margin="normal"
              />

              {/* Dépendants */}
              <DialogTitle>Dépendants</DialogTitle>

              {formData.dependentRequests.map((dependent, index) => (
                <Box key={index} display="flex" gap={2} flexDirection="column">
                  <Box display="flex" gap={2} width="100%">
                    <TextField
                      label="Prénom du dépendant"
                      variant="outlined"
                      value={dependent.firstname}
                      onChange={(e) => handleAddDependentChange(index, e)}
                      name="firstname"
                      margin="normal"
                      fullWidth
                    />
                    <TextField
                      label="Nom du dépendant"
                      variant="outlined"
                      value={dependent.lastname}
                      onChange={(e) => handleAddDependentChange(index, e)}
                      name="lastname"
                      margin="normal"
                      fullWidth
                    />
                    <FormControl fullWidth>
                      <InputLabel>Relation</InputLabel>
                      <Select
                        label="Relation"
                        value={dependent.relation}
                        onChange={(e) => handleAddDependentChange(index, e)}
                        name="relation"
                        
                      >
                        <MenuItem value={RELATION.SPOUSE}>Conjoint</MenuItem>
                        <MenuItem value={RELATION.CHILD}>Enfant</MenuItem>
                        <MenuItem value={RELATION.FAMILY_MEMBER}>Membre de la famille</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              ))}

              <Button
                variant="outlined"
                color="primary"
                onClick={handleAddDependent}
                sx={{ marginTop: "16px" }}
              >
                Ajouter un dépendant
              </Button>
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                color="primary"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Ajouter"}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Snackbar pour afficher les messages */}
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={() => setOpenSnackbar(false)}
            message={message}
          />
        </div>
      </div>
    </div>
  );
}

export default Tenant;
