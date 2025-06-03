'use client';

import { useEffect, useState, useMemo } from 'react';
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
interface COData {
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

export default function COChart() {
  const [data, setData] = useState<COData[]>([]);
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [{ 
      label: 'CO Levels (ppm)',
      data: [] as number[],
      fill: false,
      backgroundColor: 'rgba(220, 53, 69, 0.7)',
      borderColor: 'rgb(220, 53, 69)',
      borderWidth: 2,
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
        
        console.log('Fetching CO level data...');
        const res = await fetch('/api/getData/Co_Levels');
        
        if (!res.ok) {
          console.error(`API request failed with status: ${res.status}`);
          setError(`Failed to fetch data: ${res.statusText}`);
          setIsLoading(false);
          return;
        }
        
        const json = await res.json();
        console.log('Received CO data:', json);
        
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
        console.error('Error fetching CO data:', error);
        setError('Failed to load data');
        setIsLoading(false);
      }
    };
    
    const processChartData = (jsonData: any[]) => {
      // Make sure data matches our expected format
      const validData = jsonData.filter(item => 
        item && typeof item === 'object' && 'timestamp' in item && 'value' in item
      ) as COData[];
      
      if (validData.length === 0) {
        console.error('No valid CO data found in response');
        setError('No valid data points found');
        return;
      }
      
      // Sort data by timestamp
      const sortedData = [...validData].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      setData(sortedData);
      
      // Get current time and 10 minutes ago
      const now = new Date();
      const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
      
      // Filter data to last 10 minutes
      const recentData = sortedData.filter(item => 
        new Date(item.timestamp) >= tenMinutesAgo && new Date(item.timestamp) <= now
      );
      
      // Create 1-minute interval buckets for the past 10 minutes
      const intervals: Record<string, {time: string, value: number, count: number}> = {};
      
      // Create empty buckets for every minute
      for (let i = 0; i < 10; i++) {
        const minuteOffset = i;
        const bucketTime = new Date(tenMinutesAgo.getTime() + minuteOffset * 60 * 1000);
        const timeKey = bucketTime.toISOString();
        const displayTime = bucketTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        intervals[timeKey] = {
          time: displayTime,
          value: 0,
          count: 0
        };
      }
      
      // Place data points into closest 1-minute bucket
      recentData.forEach(item => {
        const timestamp = new Date(item.timestamp);
        
        // Find the closest 1-minute interval
        const minutesSince = 
          (timestamp.getTime() - tenMinutesAgo.getTime()) / (60 * 1000);
        const closestInterval = Math.floor(minutesSince);
        
        const bucketTime = new Date(tenMinutesAgo.getTime() + closestInterval * 60 * 1000);
        const timeKey = bucketTime.toISOString();
        
        if (intervals[timeKey]) {
          // For CO levels, we average the values in each bucket
          intervals[timeKey].value += item.value;
          intervals[timeKey].count += 1;
        }
      });
      
      // Calculate the average for each bucket
      Object.keys(intervals).forEach(key => {
        if (intervals[key].count > 0) {
          intervals[key].value = +(intervals[key].value / intervals[key].count).toFixed(2);
        }
      });
      
      // Convert to arrays for charting
      const timeLabels = Object.values(intervals).map(interval => interval.time);
      const values = Object.values(intervals).map(interval => interval.value);
      
      // Get units safely
      const getUnits = (): string => {
        try {
          const firstEntry = validData[0];
          return firstEntry?.meta?.units || 'ppm';
        } catch {
          return 'ppm';
        }
      };
      
      setChartData({
        labels: timeLabels,
        datasets: [
          {
            label: `CO Levels (${getUnits()})`,
            data: values,
            fill: false,
            backgroundColor: 'rgba(220, 53, 69, 0.7)',
            borderColor: 'rgb(220, 53, 69)',
            borderWidth: 2,
            tension: 0.2,
            pointRadius: 3,
          },
        ],
      });
    };

    fetchData();
    
    // Set up polling to update data more frequently due to critical nature of CO
    const intervalId = setInterval(fetchData, 15000); // update every 15 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  // Memoize chart options for better performance
  const chartOptions = useMemo<ChartOptions<'line'>>(() => {
    return {
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
              const units = data[0]?.meta?.units || 'ppm';
              return `CO: ${value} ${units}`;
            }
          }
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: data[0]?.meta?.units ? `CO Levels (${data[0].meta.units})` : 'CO Levels (ppm)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Time (past 10 minutes)'
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45
          }
        }
      },
      animation: {
        duration: 250 // Faster animations for better performance
      }
    };
  }, [data]);

  return (
    <div className="h-64">
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-gray-500">Loading CO level data...</p>
        </div>
      ) : error ? (
        <div className="flex h-full items-center justify-center">
          <p className="text-red-500">{error}</p>
        </div>
      ) : chartData.labels.length > 0 ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-amber-500">No CO level data available</p>
        </div>
      )}
    </div>
  );
}