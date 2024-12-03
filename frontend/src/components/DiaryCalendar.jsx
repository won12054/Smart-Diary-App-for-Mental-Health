import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { 
  Box, 
  Badge,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';

// Import services
import diaryEntryService from "../services/diary-entry-service";

const DiaryCalendar = () => {
  const [calendarValue, setCalendarValue] = useState(dayjs());
  const [markedDates, setMarkedDates] = useState([]);

  useEffect(() => {
    diaryEntryService.getDates().then((response) => {
      const dates = response.data["dates"];
      setMarkedDates(dates.map(date => dayjs(date)));
    }).catch((e) => {
      console.log(e);
    });
  }, []);

  function CustomPickersDay(props) {
    const { day, outsideCurrentMonth, ...other } = props;
    const isMarked = markedDates.some((markedDate) => markedDate.isSame(day, 'day'));
  
    return (
      <Badge
        overlap="circular"
        badgeContent={isMarked ? '😊' : undefined}
      >
        <PickersDay {...other} day={day} outsideCurrentMonth={outsideCurrentMonth} />
      </Badge>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar 
        value={calendarValue}
        onChange={(newValue) => setCalendarValue(newValue)}
        views={['year', 'month', 'day']}
        fixedWeekNumber={6}
        slots={{
          day: CustomPickersDay,
        }}
        sx={{
          width: '100%',
          height: '100%',
        }}
        showDaysOutsideCurrentMonth
       />
    </LocalizationProvider>
  );
}
export default DiaryCalendar;