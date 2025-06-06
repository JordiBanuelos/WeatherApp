// pages/index.tsx
import Image from 'next/image';
import Link from 'next/link'; 


export default function Home() {
  return (
    <div className="min-h-screen w-full">
      {/* 
        Container for the two-column layout:
        - Left column: Sticky image
        - Right column: Main content that scrolls
      */}
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row">
        
        {/* LEFT COLUMN: Sticky Profile Photo */}
        <div className="sm:w-1/3 p-6 sm:p-12">
          <div className="sticky top-6">
            <Image
              src="/assets/jordiMain.jpg"
              alt="Yair Banuelos"
              width={600}     // Adjust as needed
              height={600}    // Adjust as needed
              className="rounded-full shadow-xl"
              priority
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Main Content */}
        <div className="sm:w-2/3 p-12 sm:p-12 flex flex-col space-y-8 bg-white rounded-lg shadow-md border border-gray-200 mt-8 sm:mt-12">
          <section>
            <h1 className="text-4xl font-bold mb-4">
              Welcome to My Portfolio
            </h1>
            <p className="text-lg leading-relaxed">
              Hello! I'm <strong>Yair Jordi Banuelos</strong>, a Computer Science major with a passion for machine learning and climate-focused data. This website is my personal space to showcase projects, share insights, and document my journey.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              Why This Website?
            </h2>
            <p className="text-lg leading-relaxed">
              My primary goal is to learn how to collect and visualize real-time weather data from
              sensors deployed at my university. Through a project called Cronus,
              we’re able to gather temperature, humidity, and other environmental metrics, and I’m building
              this site to demonstrate how that data can be displayed in an intuitive, user-friendly way. 
            </p>
            <div className="flex justify-center mt-4 mb-2">
              <Link 
                href="/dashboard" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-sm transition duration-150 ease-in-out flex items-center"
                >
                  View Dashboard 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
            <p className="mt-4 text-lg leading-relaxed">
              Ultimately, I hope this project helps other students and researchers at my school see the
              value in real-time monitoring solutions and get inspired to build their own data-driven tools.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-2">
              Future Plans
            </h2>
            <p className="text-lg leading-relaxed">
              I plan on integrating interactive charts, mapping capabilities, and possibly some machine
              learning models to analyze environmental trends. Stay tuned!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
