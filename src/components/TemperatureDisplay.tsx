//test 

'use client';

import { useEffect, useState } from 'react';

export default function TemperatureDisplay() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/getData/sensors');
      const json = await res.json();
      setData(json);
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Temperature Readings</h2>
      <ul className="list-disc ml-5">
        {data.map((entry, idx) => (
          <li key={idx}>
            <strong>{new Date(entry.timestamp).toLocaleString()}</strong>: {entry.value}°C
          </li>
        ))}
      </ul>
    </div>
  );
}
