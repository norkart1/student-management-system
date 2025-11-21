"use client"

import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github, Heart } from "lucide-react"
import Link from "next/link"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SMS</span>
              </div>
              Student Management
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Comprehensive platform for managing students, teachers, and academic resources efficiently.
            </p>
            <div className="flex gap-4">
              <Link 
                href="https://facebook.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all"
              >
                <Facebook className="w-5 h-5" />
              </Link>
              <Link 
                href="https://twitter.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-sky-500 rounded-full flex items-center justify-center transition-all"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-pink-600 rounded-full flex items-center justify-center transition-all"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link 
                href="https://github.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-700 hover:bg-purple-600 rounded-full flex items-center justify-center transition-all"
              >
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/students" className="text-gray-400 hover:text-white transition-colors">
                  Students
                </Link>
              </li>
              <li>
                <Link href="/dashboard/teachers" className="text-gray-400 hover:text-white transition-colors">
                  Teachers
                </Link>
              </li>
              <li>
                <Link href="/dashboard/books" className="text-gray-400 hover:text-white transition-colors">
                  Library
                </Link>
              </li>
              <li>
                <Link href="/dashboard/calendar" className="text-gray-400 hover:text-white transition-colors">
                  Calendar
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-gray-400">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span>info@sms.edu</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>123 Education St, Learning City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} Student Management System. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> for education
          </p>
        </div>
      </div>
    </footer>
  )
}
