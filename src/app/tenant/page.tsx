"use client"
import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, List, ListItem, ListItemText } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/system";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

type Dependent = {
  name: string;
  code: string;
};

const FormPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
  });
  const [dependents, setDependents] = useState<Dependent[]>([]);
  const [dependentName, setDependentName] = useState("");
  const [dependentCode, setDependentCode] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddDependent = () => {
    if (dependentName && dependentCode) {
      setDependents([
        ...dependents,
        { name: dependentName, code: dependentCode },
      ]);
      setDependentName("");
      setDependentCode("");
    }
  };

  const handleSave = () => {
    const body = {
      name: formData.name,
      address: formData.address,
      contact: formData.contact,
      dependents: dependents,
    };
    console.log(body);
    handleClose(); // Close dialog after saving
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="container1">
      <div className="header1">
              <Header />
            </div>
            <div className="main-content1">
                    <Sidebar />
                    <div className="home1"></div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Open Form
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Register Information</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Address"
            name="address"
            fullWidth
            value={formData.address}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            label="Contact"
            name="contact"
            fullWidth
            value={formData.contact}
            onChange={handleInputChange}
            margin="normal"
          />
          
          <Box mt={3}>
            <TextField
              label="Dependent Name"
              value={dependentName}
              onChange={(e) => setDependentName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Dependent Code"
              value={dependentCode}
              onChange={(e) => setDependentCode(e.target.value)}
              fullWidth
              margin="normal"
            />
            <IconButton
              color="primary"
              onClick={handleAddDependent}
              aria-label="add dependent"
              style={{ marginTop: 10 }}
            >
              <AddIcon />
            </IconButton>
          </Box>

          <List>
            {dependents.map((dependent, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={dependent.name}
                  secondary={dependent.code}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
    </div>
  );
};

export default FormPopup;