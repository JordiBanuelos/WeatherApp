'use client';

import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define the data structure based on the API response
interface SensorData {
  timestamp: string;
  name: string;
  value: number;
  meta: {
    description: string;
    units: string;
    vsn: string;
    [key: string]: any; // For other metadata fields
  };
}

export default function TemperatureChart() {
  const [data, setData] = useState<SensorData[]>([]);
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [{ 
      label: 'Temperature (°C)',
      data: [] as number[],
      fill: false,
      backgroundColor: 'rgb(53, 162, 235)',
      borderColor: 'rgba(53, 162, 235, 0.8)',
      tension: 0.3,
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/getData/sensors');
        const json = await res.json();
        
        // Ensure the data is an array and has the expected structure
        if (!Array.isArray(json)) {
          console.error('Expected array data from API, received:', typeof json);
          return;
        }
        
        // Sort data by timestamp to ensure chronological order
        const sortedData = [...json].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        
        setData(sortedData);
        
        // Process the data for the chart
        const labels = sortedData.map(entry => {
          try {
            const date = new Date(entry.timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          } catch (e) {
            console.error('Error parsing date:', entry.timestamp);
            return 'Invalid';
          }
        });
        
        const values = sortedData.map(entry => 
          typeof entry.value === 'number' ? entry.value : 0
        );
        
        setChartData({
          labels,
          datasets: [
            {
              label: `Temperature (${sortedData[0]?.meta?.units || '°C'})`,
              data: values,
              fill: false,
              backgroundColor: 'rgb(53, 162, 235)',
              borderColor: 'rgba(53, 162, 235, 0.8)',
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    fetchData();
    
    // Set up polling to update data
    const intervalId = setInterval(fetchData, 60000); // update every minute
    
    return () => clearInterval(intervalId);
  }, []);

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            const dataIndex = context.dataIndex;
            const dataPoint = data[dataIndex];
            if (dataPoint) {
              return `${context.dataset.label}: ${context.parsed.y} ${dataPoint.meta?.units || '°C'}`;
            }
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: data[0]?.meta?.units || 'Temperature (°C)'
        },
        min: (chartData.datasets[0]?.data.length > 0)
          ? Math.floor(Math.min(...(chartData.datasets[0].data as number[])) - 1)
          : undefined,
        max: (chartData.datasets[0]?.data.length > 0)
          ? Math.ceil(Math.max(...(chartData.datasets[0].data as number[])) + 1)
          : undefined,
      },
      x: {
        title: {
          display: true,
          text: 'Time (past 10 minutes)'
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="h-64">
      {chartData.labels.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500">Loading chart data...</p>
        </div>
      )}
    </div>
  );
}