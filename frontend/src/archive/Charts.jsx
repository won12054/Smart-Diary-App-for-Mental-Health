import React, { useRef, useEffect } from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Charts = () => {
  const lineChartRef = useRef();
  const doughnutChartRef = useRef();

  useEffect(() => {
    // Cleanup function to destroy charts when component unmounts
    return () => {
      if (lineChartRef.current) {
        lineChartRef.current.destroy();
      }
      if (doughnutChartRef.current) {
        doughnutChartRef.current.destroy();
      }
    };
  }, []);

  



  return (
    <div className="charts-container">
      
    </div>
  );
};

export default Charts;
