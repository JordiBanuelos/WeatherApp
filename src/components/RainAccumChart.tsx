'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define the data structure based on the API response
interface RainData {
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

export default function RainAccumChart() {
  const [data, setData] = useState<RainData[]>([]);
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [{ 
      label: 'Rain Accumulation (mm)',
      data: [] as number[],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1,
    }]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching rain accumulation data...');
        const res = await fetch('/api/getData/RainData');
        
        if (!res.ok) {
          console.error(`API request failed with status: ${res.status}`);
          setError(`Failed to fetch data: ${res.statusText}`);
          setIsLoading(false);
          return;
        }
        
        const json = await res.json();
        console.log('Received rain data:', json);
        
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
        console.error('Error fetching rain data:', error);
        setError('Failed to load data');
        setIsLoading(false);
      }
    };
    
    const processChartData = (jsonData: any[]) => {
      // Make sure data matches our expected format
      const validData = jsonData.filter(item => 
        item && typeof item === 'object' && 'timestamp' in item && 'value' in item
      ) as RainData[];
      
      if (validData.length === 0) {
        console.error('No valid rain data found in response');
        setError('No valid data points found');
        return;
      }
      
      // Sort data by timestamp
      const sortedData = [...validData].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      setData(sortedData);
      
      // Get current time and 30 minutes ago
      const now = new Date();
      const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
      
      // Filter data to last 30 minutes
      const recentData = sortedData.filter(item => 
        new Date(item.timestamp) >= thirtyMinutesAgo && new Date(item.timestamp) <= now
      );
      
      // Create 2-minute interval buckets for the past 30 minutes (15 buckets)
      const intervals: Record<string, {time: string, value: number}> = {};
      
      // Create empty buckets for every 2 minutes
      for (let i = 0; i < 15; i++) {
        const minuteOffset = i * 2;
        const bucketTime = new Date(thirtyMinutesAgo.getTime() + minuteOffset * 60 * 1000);
        const timeKey = bucketTime.toISOString();
        const displayTime = bucketTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        intervals[timeKey] = {
          time: displayTime,
          value: 0
        };
      }
      
      // Place data points into closest 2-minute bucket
      recentData.forEach(item => {
        const timestamp = new Date(item.timestamp);
        
        // Find the closest 2-minute interval
        const minutesSince = 
          (timestamp.getTime() - thirtyMinutesAgo.getTime()) / (60 * 1000);
        const closestInterval = Math.floor(minutesSince / 2) * 2;
        
        const bucketTime = new Date(thirtyMinutesAgo.getTime() + closestInterval * 60 * 1000);
        const timeKey = bucketTime.toISOString();
        
        if (intervals[timeKey]) {
          // Update the bucket with the rain value if it's higher
          if (item.value > intervals[timeKey].value) {
            intervals[timeKey].value = item.value;
          }
        }
      });
      
      // Convert to arrays for charting
      const timeLabels = Object.values(intervals).map(interval => interval.time);
      const values = Object.values(intervals).map(interval => interval.value);
      
      // Get units safely
      const getUnits = (): string => {
        try {
          const firstEntry = validData[0];
          return firstEntry?.meta?.units || 'mm';
        } catch {
          return 'mm';
        }
      };
      
      setChartData({
        labels: timeLabels,
        datasets: [
          {
            label: `Rain Accumulation (${getUnits()})`,
            data: values,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
          },
        ],
      });
    };

    fetchData();
    
    // Set up polling to update data more frequently for near real-time view
    const intervalId = setInterval(fetchData, 20000); // update every 20 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  // Chart options
  const chartOptions: ChartOptions<'bar'> = {
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
            const units = data[0]?.meta?.units || 'mm';
            return `Rain: ${value} ${units}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: data[0]?.meta?.units ? `Rain (${data[0].meta.units})` : 'Rain (mm)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time (2-minute intervals)'
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          autoSkipPadding: 10
        }
      }
    }
  };

  return (
    <div className="h-64">
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500">Loading rain data...</p>
        </div>
      ) : error ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : chartData.labels.length > 0 ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-amber-500">No rain data available</p>
        </div>
      )}
    </div>
  );
}