import Link from "next/link";

export default function Project() {
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Projects</h1>
      <ul className="space-y-2">
        <li>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Environmental Sensor Dashboard
          </Link>
        </li>
        {/* Future projects */}
        <li>
          <Link href="/magnetometer" className="text-blue-600 hover:underline">
            Magnetometer Visualization
          </Link>
        </li>
      </ul>
    </main>
  );
}
