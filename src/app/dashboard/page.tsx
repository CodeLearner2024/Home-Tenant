'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import axios from 'axios';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

interface DashboardData {
  numberOfHome: number;
  numberOfOccupiedHouse: number;
  numberOfUnoccupiedHouse: number;
  numberOfTenant: number;
  leaseAgrement: number;
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get<DashboardData>(
          'https://tenant-home-production.up.railway.app/dashboard'
        );
        setData(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement du tableau de bord', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const items = data
    ? [
        { title: 'Homes', value: data.numberOfHome },
        { title: 'Occupied houses', value: data.numberOfOccupiedHouse },
        { title: 'Vacant houses', value: data.numberOfUnoccupiedHouse },
        { title: 'Tenants', value: data.numberOfTenant },
        { title: 'Registered leases', value: data.leaseAgrement },
      ]
    : [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <Typography variant="h6" color="error">
          Aucune donnée à afficher.
        </Typography>
      </Box>
    );
  }

  return (
    <div className="container1">
      <div className="header1">
        <Header />
      </div>

      <div className="main-content1">
        <Sidebar />
        <div className="home1">
          <Box sx={{ padding: 1 }}>
            <Typography 
              variant="h4" 
              align="left" 
              sx={{ marginBottom: 3, fontWeight: 'bold' }}
            >
              Dashboard
            </Typography>
            <Grid container spacing={4}>
              {items.length === 0 ? (
                <Grid item xs={12}>
                  <Typography variant="h6" align="center">
                    Aucun élément à afficher.
                  </Typography>
                </Grid>
              ) : (
                items.map((item, index) => (
                  <Grid item key={index} xs={12} sm={4} md={4}>
                    <Card
                      sx={{
                        boxShadow: 3,
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        height: '80%',  // Ensure the cards take full height in their grid cell
                      }}
                    >
                      <CardHeader
                        title={item.title}
                        sx={{
                          textAlign: 'center',
                          backgroundColor: 'cadetblue',
                          width: '100%',
                          padding: 1,
                        }}
                      />
                      <CardContent>
                        <Typography variant="h5" align="center">
                          {item.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
