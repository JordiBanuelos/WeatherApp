
//import TemperatureDisplay from '@/components/TemperatureDisplay';
import TemperatureChart from '@/components/TemperatureChart';
import HumidityChart from '@/components/HumidityChart';
import RainAccumChart from '@/components/COChart';
import WindspeedChart from '@/components/WindspeedChart';
import COChart from '@/components/COChart';


export default function DashboardPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">W08D Sensor Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-md p-5 mb-6 border border-gray-200">
        <h2 className="text-xl font-medium mb-2 text-gray-700">About This Project</h2>
        <p className="text-gray-600 leading-relaxed">
          The W08D Sensor Dashboard visualizes real-time temperature data collected from IoT sensors at Northeastern Illinois University.
          This platform enables monitoring of environmental conditions with intuitive displays and
          interactive charts, helping users make informed decisions based on temperature trends.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <h2 className="text-lg font-medium mb-3">Humidity Levels</h2>
          <HumidityChart />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <h2 className="text-lg font-medium mb-3">Temperature Trends</h2>
          <TemperatureChart />
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <h2 className="text-lg font-medium mb-3">Carbon Monoxide Levels</h2>
            <COChart />
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <h2 className="text-lg font-medium mb-3">Wind Speed</h2>
            <WindspeedChart />
        </div>
      </div>
    </main>
  );
}