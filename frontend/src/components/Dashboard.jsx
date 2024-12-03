import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  Grid2, 
  CircularProgress,
  Fade
} from '@mui/material';
import { styled } from '@mui/system';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Import services
import diaryEntryService from "../services/diary-entry-service";

// Import components
import DiaryCalendar from './DiaryCalendar';
import ChangingQuotes from './ChangingQuotes';
import WellnessTrend from './WellnessTrend';

// Import images
import quote_bg from '../images/quote_bg5.jpg';


const Dashboard = ({ onLogout }) => {
  const UNAUTHORIZED_LOGOUT_MESSAGE = "Token expired. Please log in again!";

  const [streak, setStreak] = useState(-1);
  const [maxStreak, setMaxStreak] = useState(-1);
  const [frequency, setFrequency] = useState('weekly');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    diaryEntryService.getStreak().then((response) => {
      setStreak(response.data["streak"]);
    }).catch((e) => {
      console.log(e);
      if (e.response && e.response.status === 401) {
        onLogout(UNAUTHORIZED_LOGOUT_MESSAGE);
      }
    });

    diaryEntryService.getMaxStreak().then((response) => {
      setMaxStreak(response.data["max_streak"]);
    }).catch((e) => {
      console.log(e);
      if (e.response && e.response.status === 401) {
        onLogout(UNAUTHORIZED_LOGOUT_MESSAGE);
      }
    });

  }, []);

  // Toggle frequency between 'weekly' and 'monthly'
  const toggleFrequency = () => {
    setFrequency((prev) => (prev === 'monthly' ? 'weekly' : 'monthly'));
  };
  
  const CenteredCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  });

  const BigCard = styled(Card)({
    height: '100%',
    border: "2px solid",
    boxShadow: "3px 3px rgba(0, 0, 0, 0.4)"
  });

  const SmallCard = styled(Card)({
    height: '100%',
    border: "2px solid",
    boxShadow: "3px 3px rgba(0, 0, 0, 0.4)"
  });

  const FixedCard = styled(Card)({
    height: '100px',
    border: "2px solid",
    boxShadow: "3px 3px rgba(0, 0, 0, 0.4)",
    backgroundImage: `url(${quote_bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  });

  const streakCard = (
    <>
      <SmallCard variant='outlined'>
        <CenteredCardContent>
          <Typography variant='h5' gutterBottom>
            Streak
          </Typography>
          {
            streak == -1 ? (
              <CircularProgress size="20px"/>
            ) : (
              <Typography variant='h6'>
                {streak}
              </Typography> 
            )
          }
        </CenteredCardContent>
      </SmallCard>
    </>
  );

  const longestStreakCard = (
    <>
      <SmallCard variant='outlined'>
        <CenteredCardContent>
          <Typography variant='h5' gutterBottom align='center'>
            Longest Streak
          </Typography>
          {
            maxStreak == -1 ? (
              <CircularProgress size="20px"/>
            ) : (
              <Typography variant='h6'>
                {maxStreak}
              </Typography> 
            )
          }
        </CenteredCardContent>
      </SmallCard>
    </>
  );

  const healthTrendCard = (
    <>
      <BigCard variant='outlined'>
        <CenteredCardContent>
          <Typography variant='h5' gutterBottom align='center' sx={{flexGrow: '1'}}>
            Last 30 Days
          </Typography>
          <WellnessTrend />
        </CenteredCardContent>
      </BigCard>
    </>
  );

  const calendarCard = (
    <>
      <BigCard variant='outlined'>
        <CardContent>
          <DiaryCalendar />
        </CardContent>
      </BigCard>
    </>
  );

  const quotesCard = (
    <>
      <FixedCard variant='outlined'>
        <CenteredCardContent>
          <ChangingQuotes />
        </CenteredCardContent>
      </FixedCard>
    </>
  )

  return (
    <Box sx={{ width: '100%'}}>
      <Grid2 container spacing={3}>
        <Grid2 size={12}>
          {quotesCard}
        </Grid2>
        <Grid2 size={6}>
          {streakCard}
        </Grid2>
        <Grid2 size={6}>
          {longestStreakCard}
        </Grid2>
        <Grid2 size={6}>
          {healthTrendCard}
        </Grid2>
        <Grid2 size={6}>
          {calendarCard}
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default Dashboard;
