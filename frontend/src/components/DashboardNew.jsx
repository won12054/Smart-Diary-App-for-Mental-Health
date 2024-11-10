import React, { useState, useEffect } from 'react';
import MoodTrend from './MoodTrend';
import { 
  Box, 
  Typography, 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  Grid2, 
  CircularProgress  
} from '@mui/material';
import { styled } from '@mui/system';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Import services
import diaryEntryService from "../services/diary-entry-service";

// Import components
import DiaryCalendar from './DiaryCalendar';

const DashboardNew = () => {
  const [streak, setStreak] = useState(-1);
  const [maxStreak, setMaxStreak] = useState(-1);
  const [frequency, setFrequency] = useState('weekly');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    diaryEntryService.getStreak().then((response) => {
      setStreak(response.data["streak"]);
      console.log(response.data);
    }).catch((e) => {
      console.log(e);
    });

    diaryEntryService.getMaxStreak().then((response) => {
      setMaxStreak(response.data["max_streak"]);
      console.log(response.data);
    }).catch((e) => {
      console.log(e);
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
  });

  const BigCard = styled(Card)({
    height: '100%',
    border: "2px solid",
    boxShadow: "3px 3px"
  });

  const SmallCard = styled(Card)({
    height: '100%',
    border: "2px solid",
    boxShadow: "3px 3px"
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

  const moodTrendCard = (
    <>
      <BigCard variant='outlined'>
        <CardContent>
          <Button
            variant="outlined"
            onClick={toggleFrequency}
            sx={{ padding: '8px 16px', minWidth: '100px' }}
          >
            {frequency === 'monthly' ? 'Monthly' : 'Weekly'}
          </Button>
          <MoodTrend frequency={frequency} selectedDate={selectedDate} />
        </CardContent>
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
  )

  return (
    <Box sx={{ padding: '20px', width: '100%'}}>
      <Grid2 container spacing={3}>
        <Grid2 size={6}>
          {streakCard}
        </Grid2>
        <Grid2 size={6}>
          {longestStreakCard}
        </Grid2>
        <Grid2 size={6}>
          {moodTrendCard}
        </Grid2>
        <Grid2 size={6}>
          {calendarCard}
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default DashboardNew;
