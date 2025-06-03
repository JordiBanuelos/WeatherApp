

import TemperatureDisplay from '@/components/TemperatureDisplay';


export default function DashboardPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">W08D Sensor Dashboard</h1>
      <TemperatureDisplay />
    </main>
  );
}
