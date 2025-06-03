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
interface WindData {
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

export default function WindspeedChart() {
  const [data, setData] = useState<WindData[]>([]);
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [{ 
      label: 'Wind Speed (m/s)',
      data: [] as number[],
      fill: false,
      backgroundColor: 'rgb(107, 114, 128)',
      borderColor: 'rgba(107, 114, 128, 0.8)',
      tension: 0.2,
      pointRadius: 3,
    }]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching wind speed data...');
        const res = await fetch('/api/getData/Windspeed');
        
        if (!res.ok) {
          console.error(`API request failed with status: ${res.status}`);
          setError(`Failed to fetch data: ${res.statusText}`);
          setIsLoading(false);
          return;
        }
        
        const json = await res.json();
        console.log('Received wind data:', json);
        
        // Ensure the data is an array and has the expected structure
        if (!Array.isArray(json)) {
          console.error('Expected array data from API, received:', typeof json);
          setError('Invalid data format received');
          setIsLoading(false);
          return;
        }
        
        // Process the data
        processChartData(json);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching wind data:', error);
        setError('Failed to load data');
        setIsLoading(false);
      }
    };
    
    const processChartData = (jsonData: any[]) => {
      // Make sure data matches our expected format
      const validData = jsonData.filter(item => 
        item && typeof item === 'object' && 'timestamp' in item && 'value' in item
      ) as WindData[];
      
      if (validData.length === 0) {
        console.error('No valid wind data found in response');
        setError('No valid data points found');
        return;
      }
      
      // Sort data by timestamp
      const sortedData = [...validData].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      setData(sortedData);
      
      // Get current time and 1 hour ago
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      // Filter data to last hour
      const recentData = sortedData.filter(item => 
        new Date(item.timestamp) >= oneHourAgo && new Date(item.timestamp) <= now
      );
      
      // Create time interval buckets for the past hour (12 buckets, every 5 minutes)
      const intervals: Record<string, {time: string, value: number, count: number}> = {};
      
      // Create empty buckets for every 5 minutes
      for (let i = 0; i < 12; i++) {
        const minuteOffset = i * 5;
        const bucketTime = new Date(oneHourAgo.getTime() + minuteOffset * 60 * 1000);
        const timeKey = bucketTime.toISOString();
        const displayTime = bucketTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        intervals[timeKey] = {
          time: displayTime,
          value: 0,
          count: 0
        };
      }
      
      // Place data points into closest 5-minute bucket
      recentData.forEach(item => {
        const timestamp = new Date(item.timestamp);
        
        // Find the closest 5-minute interval
        const minutesSinceHour = 
          (timestamp.getTime() - oneHourAgo.getTime()) / (60 * 1000);
        const closestInterval = Math.floor(minutesSinceHour / 5) * 5;
        
        const bucketTime = new Date(oneHourAgo.getTime() + closestInterval * 60 * 1000);
        const timeKey = bucketTime.toISOString();
        
        if (intervals[timeKey]) {
          // For wind speed, we should average the values in each bucket
          intervals[timeKey].value += item.value;
          intervals[timeKey].count += 1;
        }
      });
      
      // Calculate the average for each bucket
      Object.keys(intervals).forEach(key => {
        if (intervals[key].count > 0) {
          intervals[key].value = +(intervals[key].value / intervals[key].count).toFixed(1);
        }
      });
      
      // Convert to arrays for charting
      const timeLabels = Object.values(intervals).map(interval => interval.time);
      const values = Object.values(intervals).map(interval => interval.value);
      
      // Get units safely
      const getUnits = (): string => {
        try {
          const firstEntry = validData[0];
          return firstEntry?.meta?.units || 'm/s';
        } catch {
          return 'm/s';
        }
      };
      
      setChartData({
        labels: timeLabels,
        datasets: [
          {
            label: `Wind Speed (${getUnits()})`,
            data: values,
            fill: false,
            backgroundColor: 'rgb(107, 114, 128)',
            borderColor: 'rgba(107, 114, 128, 0.8)',
            tension: 0.2,
            pointRadius: 3,
          },
        ],
      });
    };

    fetchData();
    
    // Set up polling to update data
    const intervalId = setInterval(fetchData, 30000); // update every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  // Chart options
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw as number;
            const units = data[0]?.meta?.units || 'm/s';
            return `Wind Speed: ${value} ${units}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: data[0]?.meta?.units ? `Wind Speed (${data[0].meta.units})` : 'Wind Speed (m/s)'
        },
        ticks: {
          callback: function(value) {
            return value + ' ' + (data[0]?.meta?.units?.split(' ')[0] || 'm/s');
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time (5-minute intervals)'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  return (
    <div className="h-64">
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500">Loading wind speed data...</p>
        </div>
      ) : error ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : chartData.labels.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-amber-500">No wind data available</p>
        </div>
      )}
    </div>
  );
}