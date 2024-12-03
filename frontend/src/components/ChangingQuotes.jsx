import React, { useState, useEffect } from 'react';
import { 
  Typography,
} from '@mui/material';

// Sample quotes array
const quotes = [
  "The best way to predict the future is to create it.",
  "Happiness is not something ready-made. It comes from your own actions.",
  "Believe you can and you're halfway there.",
  "You are never too old to set another goal or to dream a new dream.",
  "Act as if what you do makes a difference. It does.",
];

const ChangingQuotes = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Change quote every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Typography variant="subtitle1" align="center">
      {quotes[quoteIndex]}
    </Typography>
  );
};

export default ChangingQuotes;