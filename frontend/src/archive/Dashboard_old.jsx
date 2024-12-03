import React, { useState, useEffect } from 'react';
import MoodTrend from './MoodTrend';
import { Box, Typography, Button, TextField, Card, Grid, Fade } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Sample quotes array
const quotes = [
  "The best way to predict the future is to create it.",
  "Happiness is not something ready-made. It comes from your own actions.",
  "Believe you can and you're halfway there.",
  "You are never too old to set another goal or to dream a new dream.",
  "Act as if what you do makes a difference. It does.",
];

const Dashboard = () => {
  const [frequency, setFrequency] = useState('weekly');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Toggle frequency between 'weekly' and 'monthly'
  const toggleFrequency = () => {
    setFrequency((prev) => (prev === 'monthly' ? 'weekly' : 'monthly'));
  };

  // Change quote every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ padding: '20px' }}>
      {/* Control Panel and Quote */}
      <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item xs={8} container spacing={2} alignItems="center">
          <Grid item>
            <Button
              variant="outlined"
              onClick={toggleFrequency}
              sx={{ padding: '8px 16px', minWidth: '100px' }}
            >
              {frequency === 'monthly' ? 'Monthly' : 'Weekly'}
            </Button>
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newDate) => setSelectedDate(newDate)}
                renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>

        {/* Quote of the Day */}
        <Grid item xs={4}>
          <Card sx={{ padding: '16px', backgroundColor: '#f5f5f5', boxShadow: 1 }}>
            <Fade in={true} timeout={1000}>
              <Typography variant="body1" align="center">
                {quotes[quoteIndex]}
              </Typography>
            </Fade>
          </Card>
        </Grid>
      </Grid>

      {/* Chart Card */}
      <Card sx={{ padding: '20px', boxShadow: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 2, fontSize: '18px' }}>
          Happiness Level - {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
        </Typography>
        <MoodTrend frequency={frequency} selectedDate={selectedDate} />
      </Card>
    </Box>
  );
};

export default Dashboard;
