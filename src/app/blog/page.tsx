import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Top colored banner */}
        <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        <div className="p-6 md:p-8">
          {/* Construction icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-50 p-4 rounded-full">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-14 w-14 text-blue-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" 
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-4">
            Blog Coming Soon
          </h1>
          
          <p className="text-gray-600 text-center mb-6">
            We're working hard to create an amazing blog experience for you. Check back soon for interesting articles, updates, and insights.
          </p>
          
          {/* Progress bar */}
          <div className="w-full bg-gray-100 h-2 rounded-full mb-6">
            <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
          </div>
          
          {/* Feature preview */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <span className="block text-blue-500 font-medium mb-1">Coming Soon</span>
              <span className="text-sm text-gray-500">Expert Articles</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <span className="block text-blue-500 font-medium mb-1">Coming Soon</span>
              <span className="text-sm text-gray-500">Project Updates</span>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-2">
            <Link 
              href="/" 
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors"
            >
              Return to Home
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 text-center mt-6">
            Want to be notified when we launch? Follow us on social media.
          </p>
        </div>
      </div>
    </div>
  );
}