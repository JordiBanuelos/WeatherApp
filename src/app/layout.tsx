import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link'; 
import Image from "next/image";

export const metadata: Metadata = {
  title: "Jordi_Banuelos",
  description: "Jordi's Profile Website",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-grey-100 dark:bg-white text-gray-800 dark:text-gray-900 min-h-screen flex flex-col">  
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 py-4 lg:px-8 bg-white rounded-2xl shadow-lg max-w-screen-xl w-full mx-auto">
          <div className="flex items-center gap-x-3 lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <Image 
                className="h-16 w-16 rounded-full object-cover" 
                src="/assets/jordi_logo.jpg" 
                alt="Logo"
                width={64} 
                height={64} 
                priority 
              />
            </Link>
            {/* Name Display */}
            <span className="text-xl font-semibold text-gray-900 dark:text-white ml-3">
              Yair Jordi Banuelos
            </span>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button 
              type="button" 
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden lg:flex lg:gap-x-8">
            <li><Link href="/" className="hover:underline text-base font-semibold text-gray-900">Home</Link></li>
            <li><Link href="/about" className="hover:underline text-base font-semibold text-gray-900">About</Link></li>
            <li><Link href="/Projects" className="hover:underline text-base font-semibold text-gray-900">Projects</Link></li>
            <li><Link href="/contact" className="hover:underline text-base font-semibold text-gray-900">Contact</Link></li>
            <li><Link href="/blog" className="hover:underline text-base font-semibold text-gray-900">Blog</Link></li>
          </ul>

          {/* Login Button */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link href="/login" className="text-base font-semibold text-gray-900">
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-screen-xl mx-auto px-6 flex-grow">{children}</main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-8 shadow-inner">
          <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
            {/* Left Side - Your Name */}
            <span className="text-lg font-semibold text-center md:text-left">
              © {new Date().getFullYear()} Yair Jordi Banuelos
            </span>

            {/* Center - Navigation Links */}
            <nav className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/" className="hover:text-gray-900 dark:hover:text-white">Home</Link>
              <Link href="/about" className="hover:text-gray-900 dark:hover:text-white">About</Link>
              <Link href="/projects" className="hover:text-gray-900 dark:hover:text-white">Projects</Link>
              <Link href="/contact" className="hover:text-gray-900 dark:hover:text-white">Contact</Link>
            </nav>

            {/* Right Side - Social Links */}
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="https://github.com/JordiBanuelos/" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/assets/Git.jpg" 
                  alt="GitHub"
                  width={32}
                  height={32}
                  className="hover:opacity-80"
                />
              </a>
              <a href="https://www.linkedin.com/in/jordi-banuelos-733aa7264/?trk=public-profile-join-page" target="_blank" rel="noopener noreferrer">
                <Image
                  src="/assets/linkedin.jpg"
                  alt="LinkedIn"
                  width={32}
                  height={32}
                  className="hover:opacity-80"
                />
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
