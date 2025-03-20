"use client"
import React, { useEffect, useState } from 'react'
import "../globals.css";
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ModeEditOutlinedIcon from '@mui/icons-material/ModeEditOutlined';
interface Home {
  id: number;
  code: string;
  name: string;
  adresse: string;
}

function Urupangu() {
  const [homes,setHomes] = useState<Home[]>([]);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    adresse: '',
  });
  const fetchHomes = async () => {
    try {
      const response = await fetch("https://tenant-home-production.up.railway.app/homes");
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

  //=============================================create method===============================
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [severity, setSeverity] = useState<'success' | 'error'>('success');
  const handleCreate = async () => {
    try {
      const response = await fetch('https://tenant-home-production.up.railway.app/homes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Envoie les données du formulaire sous forme de JSON
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout des données.');
      }

      setStatusMessage('Données ajoutées avec succès.');
      setSeverity('success'); 
      // Réinitialiser le formulaire après l'envoi
      setFormData({
        code: '',
        name: '',
        adresse: '',
      });
      await fetchHomes();
    } catch {
      setStatusMessage('Une erreur est survenue.');
      setSeverity('error'); // Message d'erreur
    }
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  //=================================== delete ================================

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`https://tenant-home-production.up.railway.app/homes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression.');
      }

      const result = await response.json();
      console.log(result);
      setStatusMessage('Maison supprimée avec succès');
      setSeverity('success');

      // Mettre à jour l'état local pour enlever l'élément supprimé
      setHomes(homes.filter((home) => home.id !== id));
    } catch {
      setStatusMessage('Une erreur est survenue');
      setSeverity('error');
    }

    setOpenSnackbar(true);
  };

  //===================================update ==================================
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

    const handleCloseDialog = () => {
      setOpenDialog(false);
    };

    const handleSaveChanges = async () => {
      if (selectedHome) {
        try {
          const response = await fetch(`https://tenant-home-production.up.railway.app/homes/${selectedHome.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Envoie les données mises à jour
          });
  
          if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour des données.');
          }
  
          setStatusMessage('Donnée mise à jour avec succès.');
          setSeverity('success');
          setOpenSnackbar(true);
  
          // Actualiser la liste des maisons après la mise à jour
          await fetchHomes();
          setOpenDialog(false); // Fermer le Dialog
  
        } catch  {
          setStatusMessage('Une erreur est survenue.');
          setSeverity('error');
          setOpenSnackbar(true);
        }
      }
    };


    //================================== reset inputs=============================
  return (
    
    <div className="container1">
      <div className="header1">
        <Header />
      </div>
  
      <div className="main-content1">
        <Sidebar />
        <div className="home1">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
      {/* Input */}
      
      {/* <TextField 
        label="Search" 
        variant="outlined" 
        size="small" 
        sx={{ flex: 1 }} 
      /> */}

      {/* Search button */}
      {/* <Button variant="outlined" color="primary">
        Search
      </Button> */}

      {/* Spacer (can be adjusted to your needs) */}
      {/* <div style={{ flexGrow: 1 }}></div> */}

      {/* Add button */}
      {/* <Button variant="contained" color="primary">
        + New Home
      </Button> */}
    </div>
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={2}>
          <TextField
            label="Code"
            variant="outlined"
            fullWidth
            name="code"
            value={formData.code}
            onChange={handleChange}
            size='small'
            autoComplete='off'
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Nom"
            variant="outlined"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleChange}
            size='small'
            autoComplete='off'
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="Adresse"
            variant="outlined"
            fullWidth
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            size='small'
            autoComplete='off'
          />
        </Grid>
        <Grid item xs={3}>
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
        autoHideDuration={3000} // Ferme automatiquement après 5 secondes
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: 'top',  // Position verticale en haut
          horizontal: 'right', // Position horizontale à droite
        }}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%', backgroundColor: severity === 'success' ? 'green' : 'red' }}>
          {statusMessage}
        </Alert>
      </Snackbar>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Modifier la maison</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Code"
            type="text"
            fullWidth
            variant="outlined"
            name="code"
            value={formData.code}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Nom"
            type="text"
            fullWidth
            variant="outlined"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Adresse"
            type="text"
            fullWidth
            variant="outlined"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Annuler
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Sauvegarder
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
        <TableContainer>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Numero</TableCell>
            <TableCell align="right">code</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Adresse</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {homes.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.code}</TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.adresse}</TableCell>
              <TableCell align="right">
                <Button sx={{fontSize: '16px'}} onClick={() => handleDelete(row.id)}>  <DeleteOutlineOutlinedIcon sx={{
    fontSize: '16px',
    '&:hover': {
      fontSize: '20px',  
      color: 'red',     
    },
  }} /></Button>
                <Button sx={{fontSize: '16px'}} onClick={() => handleEditClick(row)}> <ModeEditOutlinedIcon sx={{
    fontSize: '16px',
    '&:hover': {
      fontSize: '20px',  
      color: 'blue',     
    },
  }} /></Button>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </div>
      </div>
</div>
  )
}

export default Urupangu