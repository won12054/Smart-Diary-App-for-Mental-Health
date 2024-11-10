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

const MoodTrend = ({frequency, selectedDate}) =>{
  const lineChartRef = useRef();
useEffect(()=>{
  return () =>
  {
    if (lineChartRef.current){
      lineChartRef.current.destroy();
    }
  };
}, []);

const getLineChartData = () => {
  if (frequency === 'weekly') {
    return {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          label: 'Happiness',
          data: [65, 59, 70, 85, 60, 75, 68], // Example weekly data
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
        },
      ],
    };
  } else {
    return {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          label: 'Happiness',
          data: [55, 60, 62, 68, 72, 70], // Example monthly data
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
        },
      ],
    };
  }
};


const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: `Happiness Level - ${frequency.charAt(0).toUpperCase() + frequency.slice(1)}`,
      font: {
        size: 18,
        weight: 'bold',
      },
      color: '#000000',
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: frequency === 'weekly' ? 'Days of the Week' : 'Months',
      },
    },
    y: {
      beginAtZero: true,
      min: 0,
      max: 100,
    },
  },
};


// const Charts = () => {
//   const lineChartRef = useRef();

//   useEffect(() => {
//     // Cleanup function to destroy charts when component unmounts
//     return () => {
//       if (lineChartRef.current) {
//         lineChartRef.current.destroy();
//       }
//     };
//   }, []);

//   const lineChartData = {
//     labels: ['January', 'February', 'March', 'April', 'May', 'June'],
//     datasets: [
//       {
//         label: 'Happiness',
//         data: [30, 50, 40, 60, 70, 50],
//         borderColor: 'rgba(75, 192, 192, 1)',
//         fill: false,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     plugins: {
//       legend: {
//         display: false,
//       },
//       title: {
//         display: true,
//         text: 'Happiness Level',
//         font: {
//           size: 18, // Increases the font size
//           weight: 'bold', // Makes the title bold
//         },
//         color: '#000000'
//       },
//     },
//     scales: {
//       x: {
//           title: {
//               display: true,
//               text: 'Months',
//           },
//       },
//       y: {
//           title: {
//               display: false,
//               text: 'Sales ($)',
//           },
//           beginAtZero: true,
//           min: 0,
//           max: 100
//       },
//     },
//   };

  return (
    <div className="charts-container">
      <div className="line-chart">
        <Line data={getLineChartData()} ref={lineChartRef} options={options} />
      </div>
    </div>
  );
  //   <div className="charts-container">
  //     <div className="line-chart">
  //       <Line data={lineChartData} ref={lineChartRef} options={options} />
  //     </div>
  //   </div>
  // );
};

export default MoodTrend;
