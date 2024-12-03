import React, { useEffect, useState } from 'react';

import { 
  Typography, 
} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

// Import services
import diaryEntryService from "../services/diary-entry-service";

const HealthTrend = () => {
  const [dates, setDates] = useState([]);
  const [scores, setScores] = useState([]);

  const getLast30DaysDates = () => {
    const dates = [];
    const today = new Date();
  
    // Loop through the last 30 days
    for (let i = 31; i > 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
  
      // Format the date to YYYY-MM-DD
      const formattedDate = date.toISOString().split('T')[0];
      dates.push(formattedDate);
    }
  
    return dates;
  };

  useEffect(() => {
    diaryEntryService.getSummary().then((response) => {
      const summary = response.data["summary"];
      
      const last30dates = getLast30DaysDates();

      const newDates = [];
      const newScores = [];

      for (const [key, value] of Object.entries(summary)) {
        if (last30dates.includes(key)) {
          newDates.push(key);
          newScores.push(value);
        }
      }

      setDates(newDates.reverse());
      setScores(newScores.reverse());

    }).catch((e) => {
      console.log(e);
    });
  }, []);

  return (
    <>
      {scores.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align='center' sx={{flexGrow: '1'}}>
          No mood trend data available. Please add some diary entries.
        </Typography> 
      ) : (
        <LineChart
          series={[
            {data: scores, label: 'Wellness'}
          ]}
          xAxis={[{
            scaleType: 'band',
            data: dates
          }]}
          yAxis={[
            {
              min: 0,
              max: 100
            },
          ]}
          width={500}
          height={350}
        />
      )
    
      }
      
    </>
  )
};

export default HealthTrend;