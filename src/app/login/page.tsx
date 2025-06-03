import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-md w-full">
        {/* Lock icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-4 rounded-full">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
          Login Unavailable
        </h1>
        
        <p className="text-gray-600 text-center mb-8">
          The login functionality is currently under development and will be available soon.
        </p>
        
        <div className="border-t border-gray-200 pt-6 mt-6">
          <Link 
            href="/" 
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors"
          >
            Return to Home
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 text-center mt-6">
          we apologize of the the inconvenience
        </p>
      </div>
    </div>
  );
}