import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, MapPin, Phone } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/flint.png" alt="Logo" className="h-8 w-8" />
              <div className="text-2xl font-bold tracking-tight text-gray-900">
                F L I N T <span style={{ color: '#ff5252' }}>.</span>
              </div>
            </Link>
            <p className="text-gray-500 leading-relaxed">
              Your one-stop destination for premium fashion, electronics, and lifestyle essentials. Curated for quality and style.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-[#ff5252] transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ff5252] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[#ff5252] transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shopping Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-6">Shop</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/products" className="text-gray-500 hover:text-[#ff5252] transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="text-gray-500 hover:text-[#ff5252] transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/trending" className="text-gray-500 hover:text-[#ff5252] transition-colors">
                  Trending
                </Link>
              </li>
              <li>
                <Link to="/brands" className="text-gray-500 hover:text-[#ff5252] transition-colors">
                  Brands
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-gray-500 hover:text-[#ff5252] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-500 hover:text-[#ff5252] transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-500 hover:text-[#ff5252] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-500 hover:text-[#ff5252] transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-500">
                <MapPin className="w-5 h-5 text-[#ff5252] flex-shrink-0 mt-0.5" />
                <span>123 Market Street, Suite 456<br />San Francisco, CA 94105</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Phone className="w-5 h-5 text-[#ff5252] flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Mail className="w-5 h-5 text-[#ff5252] flex-shrink-0" />
                <span>support@flint.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Flint Marketplace. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <Link to="/terms" className="text-gray-400 hover:text-gray-600 transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-gray-400 hover:text-gray-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-gray-600 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer