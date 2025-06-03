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
interface HumidityData {
  timestamp: string;
  name: string;
  value: number;
  meta?: {
    units?: string;
    sensor?: string;
    vsn?: string;
    [key: string]: any; // For other metadata fields
  };
}

export default function HumidityChart() {
  const [data, setData] = useState<HumidityData[]>([]);
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [{ 
      label: 'Humidity (%)',
      data: [] as number[],
      fill: false,
      backgroundColor: 'rgb(75, 192, 192)',
      borderColor: 'rgba(75, 192, 192, 0.8)',
      tension: 0.3,
    }]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/getData/humidy');
        const json = await res.json();
        
        // Ensure the data is an array and has the expected structure
        if (!Array.isArray(json)) {
          console.error('Expected array data from API, received:', typeof json);
          return;
        }
        
        // Make sure data matches our expected format
        const validData = json.filter(item => 
          item && typeof item === 'object' && 'timestamp' in item && 'value' in item
        ) as HumidityData[];
        
        if (validData.length === 0) {
          console.error('No valid humidity data found in response');
          return;
        }
        
        // Sort data by timestamp to ensure chronological order
        const sortedData = [...validData].sort((a, b) => 
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
        
        // Get units safely
        const getUnits = (): string => {
          try {
            return sortedData[0]?.meta?.units || '%';
          } catch {
            return '%';
          }
        };
        
        setChartData({
          labels,
          datasets: [
            {
              label: `Humidity (${getUnits()})`,
              data: values,
              fill: false,
              backgroundColor: 'rgb(75, 192, 192)',
              borderColor: 'rgba(75, 192, 192, 0.8)',
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching humidity data:', error);
      }
    };

    fetchData();
    
    // Set up polling to update data
    const intervalId = setInterval(fetchData, 60000); // update every minute
    
    return () => clearInterval(intervalId);
  }, []);

  // Safely calculate min/max for chart axes
  const calculateMin = (): number | undefined => {
    try {
      const values = chartData.datasets[0].data;
      if (!values.length) return undefined;
      return Math.floor(Math.min(...values) - 5);
    } catch {
      return 0; // Humidity typically starts at 0%
    }
  };

  const calculateMax = (): number | undefined => {
    try {
      const values = chartData.datasets[0].data;
      if (!values.length) return undefined;
      return Math.min(100, Math.ceil(Math.max(...values) + 5)); // Cap at 100% for humidity
    } catch {
      return 100; // Humidity typically maxes at 100%
    }
  };

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
            try {
              const dataIndex = context.dataIndex;
              const dataPoint = data[dataIndex];
              if (dataPoint) {
                return `${context.dataset.label}: ${context.parsed.y} ${dataPoint.meta?.units || '%'}`;
              }
            } catch (e) {
              console.error('Error in tooltip callback:', e);
            }
            return `${context.dataset.label}: ${context.parsed.y}%`;
          }
        }
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Humidity (%)'
        },
        min: calculateMin(),
        max: calculateMax(),
        suggestedMin: 0,
        suggestedMax: 100,
      },
      x: {
        title: {
          display: true,
          text: 'Time'
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
          <p className="text-gray-500">Loading humidity data...</p>
        </div>
      )}
    </div>
  );
}