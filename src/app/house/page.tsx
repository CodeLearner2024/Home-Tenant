"use client"
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  IconButton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

interface Home {
  id: number;
  code: string;
  name: string;
  adresse: string;
}

interface House {
  id: number;
  code: string;
  numberOfRooms: number;
  rent: number;
  homeId: number;
  occupied: boolean;
}

function House() {
  const [homes, setHomes] = useState<Home[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [searchCode, setSearchCode] = useState<string>(""); 
  const [filteredHouses, setFilteredHouses] = useState<House[]>([]);

  const [statusMessage, setStatusMessage] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [severity, setSeverity] = useState<"success" | "error">("success");

  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const [openUpdateDialog, setOpenUpdateDialog] = useState<boolean>(false);

  const [newHouseData, setNewHouseData] = useState({
    code: "",
    numberOfRooms: "",
    rent: "",
    homeId: "",
  });

  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [houseToDelete, setHouseToDelete] = useState<House | null>(null);

  const fetchHomes = async () => {
    try {
      const response = await fetch(
        "https://tenant-home-production.up.railway.app/homes"
      );
      const data = await response.json();
      setHomes(data);
      console.log("========================>homes:", data);
    } catch (error) {
      console.error("Erreur lors de la récupération des maisons :", error);
    }
  };

  const fetchHouses = async () => {
    try {
      const response = await fetch(
        "https://tenant-home-production.up.railway.app/houses"
      );
      const data = await response.json();
      setHouses(data);
      console.log("========================>houses:", data);
      setFilteredHouses(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des maisons :", error);
    }
  };

  useEffect(() => {
    fetchHomes();
    fetchHouses();
  }, []);

  useEffect(() => {
    if (searchCode.trim() === "") {
      setFilteredHouses(houses);
    } else {
      const filtered = houses.filter((house) =>
        house.code.toLowerCase().includes(searchCode.toLowerCase())
      );
      setFilteredHouses(filtered);
    }
  }, [searchCode, houses]);

  const handleCreateClick = () => {
    setNewHouseData({
      code: "",
      numberOfRooms: "",
      rent: "",
      homeId: "",
    });
    setOpenFormDialog(true);
  };

  const handleUpdateClick = (house: House) => {
    const homeId = house.homeId ? house.homeId.toString() : "";
    setNewHouseData({
      code: house.code,
      numberOfRooms: house.numberOfRooms.toString(),
      rent: house.rent.toString(),
      homeId: homeId,
    });
    setOpenUpdateDialog(true);
  };

  const handleDeleteClick = (house: House) => {
    setHouseToDelete(house);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (houseToDelete) {
      try {
        const response = await fetch(
          `https://tenant-home-production.up.railway.app/houses/${houseToDelete.id}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Erreur lors de la suppression.");
        setStatusMessage("Maison supprimée avec succès.");
        setSeverity("success");
        await fetchHouses();
        setOpenDeleteDialog(false);
      } catch {
        setStatusMessage("Erreur lors de la suppression.");
        setSeverity("error");
      }
      setOpenSnackbar(true);
    }
  };

  const handleFormSubmit = async () => {
    const numberOfRooms = parseInt(newHouseData.numberOfRooms as string);
    const rent = parseFloat(newHouseData.rent as string);

    if (
      !newHouseData.code ||
      isNaN(numberOfRooms) ||
      isNaN(rent) ||
      numberOfRooms <= 0 ||
      rent <= 0 ||
      !newHouseData.homeId
    ) {
      setStatusMessage("Tous les champs sont obligatoires, y compris la maison.");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    const selectedHome = homes.find((home) => home.id === parseInt(newHouseData.homeId as string));

    if (!selectedHome) {
      setStatusMessage("Maison sélectionnée invalide.");
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
          body: JSON.stringify({
            code: newHouseData.code,
            numberOfRooms,
            rent,
            homeId: parseInt(newHouseData.homeId as string),
            occupied: false,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout.");
      }

      setStatusMessage("Maison ajoutée avec succès.");
      setSeverity("success");
      await fetchHouses();
      setOpenFormDialog(false);
    } catch {
      setStatusMessage("Erreur lors de l'ajout.");
      setSeverity("error");
    }
    setOpenSnackbar(true);
  };

  const handleUpdateSubmit = async () => {
    const numberOfRooms = parseInt(newHouseData.numberOfRooms as string);
    const rent = parseFloat(newHouseData.rent as string);

    if (
      !newHouseData.code ||
      isNaN(numberOfRooms) ||
      isNaN(rent) ||
      numberOfRooms <= 0 ||
      rent <= 0 ||
      !newHouseData.homeId
    ) {
      setStatusMessage("Tous les champs sont obligatoires, y compris la maison.");
      setSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await fetch(
        `https://tenant-home-production.up.railway.app/houses/${newHouseData.homeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: newHouseData.code,
            numberOfRooms,
            rent,
            homeId: parseInt(newHouseData.homeId as string),
            occupied: false,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour.");
      }

      setStatusMessage("Maison mise à jour avec succès.");
      setSeverity("success");
      await fetchHouses();
      setOpenUpdateDialog(false);
    } catch {
      setStatusMessage("Erreur lors de la mise à jour.");
      setSeverity("error");
    }
    setOpenSnackbar(true);
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
              <Grid item xs={12} sm={8}>
                <TextField
                  label="Rechercher par code"
                  variant="outlined"
                  fullWidth
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  size="small"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleCreateClick}
                >
                  Ajouter
                </Button>
              </Grid>
            </Grid>

            <Snackbar
              open={openSnackbar}
              autoHideDuration={3000}
              onClose={() => setOpenSnackbar(false)}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Alert
                onClose={() => setOpenSnackbar(false)}
                severity={severity}
                sx={{ width: "100%" }}
              >
                {statusMessage}
              </Alert>
            </Snackbar>

            <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)}>
              <DialogTitle>Ajouter une maison</DialogTitle>
              <DialogContent>
                <TextField
                  label="Code"
                  fullWidth
                  margin="dense"
                  value={newHouseData.code}
                  onChange={(e) =>
                    setNewHouseData({ ...newHouseData, code: e.target.value })
                  }
                />
                <TextField
                  label="Nombre de pièces"
                  type="number"
                  fullWidth
                  margin="dense"
                  value={newHouseData.numberOfRooms}
                  onChange={(e) =>
                    setNewHouseData({
                      ...newHouseData,
                      numberOfRooms: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Loyer"
                  type="number"
                  fullWidth
                  margin="dense"
                  value={newHouseData.rent}
                  onChange={(e) =>
                    setNewHouseData({
                      ...newHouseData,
                      rent: e.target.value,
                    })
                  }
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel>Choisir une maison</InputLabel>
                  <Select
                    value={newHouseData.homeId}
                    onChange={(e) =>
                      setNewHouseData({ ...newHouseData, homeId: e.target.value })
                    }
                  >
                    {homes.map((home) => (
                      <MenuItem key={home.id} value={home.id}>
                        {home.code} - {home.name} ({home.adresse})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenFormDialog(false)}>Annuler</Button>
                <Button onClick={handleFormSubmit} color="primary">
                  Ajouter
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
              <DialogTitle>Mettre à jour une maison</DialogTitle>
              <DialogContent>
                <TextField
                  label="Code"
                  fullWidth
                  margin="dense"
                  value={newHouseData.code}
                  onChange={(e) =>
                    setNewHouseData({ ...newHouseData, code: e.target.value })
                  }
                />
                <TextField
                  label="Number of rooms"
                  type="number"
                  fullWidth
                  margin="dense"
                  value={newHouseData.numberOfRooms}
                  onChange={(e) =>
                    setNewHouseData({
                      ...newHouseData,
                      numberOfRooms: e.target.value,
                    })
                  }
                />
                <TextField
                  label="Loyer"
                  type="number"
                  fullWidth
                  margin="dense"
                  value={newHouseData.rent}
                  onChange={(e) =>
                    setNewHouseData({
                      ...newHouseData,
                      rent: e.target.value,
                    })
                  }
                />
                <FormControl fullWidth margin="dense">
                  <InputLabel>Choisir une maison</InputLabel>
                  <Select
                    value={newHouseData.homeId}
                    onChange={(e) =>
                      setNewHouseData({ ...newHouseData, homeId: e.target.value })
                    }
                  >
                    {homes.map((home) => (
                      <MenuItem key={home.id} value={home.id}>
                        {home.code} - {home.name} ({home.adresse})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenUpdateDialog(false)}>Annuler</Button>
                <Button onClick={handleUpdateSubmit} color="primary">
                  Mettre à jour
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={openDeleteDialog}
              onClose={() => setOpenDeleteDialog(false)}
            >
              <DialogTitle>Confirmer la suppression</DialogTitle>
              <DialogContent>
                <p>Êtes-vous sûr de vouloir supprimer cette maison ?</p>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenDeleteDialog(false)}>
                  Annuler
                </Button>
                <Button onClick={confirmDelete} color="primary">
                  Supprimer
                </Button>
              </DialogActions>
            </Dialog>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Nombre de chambres</TableCell>
                    <TableCell>Loyer</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHouses.map((house) => (
                    <TableRow key={house.id}>
                      <TableCell>{house.code}</TableCell>
                      <TableCell>{house.numberOfRooms}</TableCell>
                      <TableCell>{house.rent}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => handleUpdateClick(house)}>
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(house)}
                        >
                          <Delete />
                        </IconButton>
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
