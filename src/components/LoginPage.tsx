"use client";

import { Box, Button, Container, Link, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/navigation'; // Utilisation de 'next/navigation' au lieu de 'next/router'
import React, { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const fakeUser = {
    email: 'eric@gmail.com',
    password: 'eric3742',
  };

  const router = useRouter(); // Utiliser useRouter de 'next/navigation'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');

    if (email === '' || password === '') {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (email === fakeUser.email && password === fakeUser.password) {
      router.push('/home'); // Redirection
    } else {
      setError('Email ou mot de passe incorrect.');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 8,
          padding: 2,
          borderRadius: 1,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5">Se connecter</Typography>

        <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
          {error && (
            <Typography variant="body2" color="error" sx={{ textAlign: 'center', marginBottom: 2 }}>
              {error}
            </Typography>
          )}

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Adresse e-mail"
            type="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" fullWidth variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Se connecter
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Link href="#" variant="body2">
              Mot de passe oublié ?
            </Link>
            <Link href="#" variant="body2">
              Créer un compte
            </Link>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default LoginPage;
