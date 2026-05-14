import React from 'react'
import { Send } from 'lucide-react'

const Newsletter = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gray-900 shadow-2xl">
          {/* Background Decor */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#ff5252] opacity-20 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-500 opacity-20 blur-3xl pointer-events-none"></div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0">
            {/* Content Section */}
            <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Stay in the loop.
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Join 50,000+ shoppers getting our best deals, style tips, and new arrival alerts delivered straight to their inbox.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-1 px-5 py-4 rounded-xl bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#ff5252] focus:border-transparent transition-all backdrop-blur-sm"
                  required
                />
                <button 
                  type="submit" 
                  className="px-8 py-4 bg-[#ff5252] text-white font-bold rounded-xl hover:bg-[#ff5252]/90 transition-all shadow-lg hover:shadow-[#ff5252]/25 flex items-center justify-center gap-2 group"
                >
                  <span>Subscribe</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                No spam, unsubscribe anytime.
              </p>
            </div>

            {/* Image Section */}
            <div className="relative h-64 lg:h-auto min-h-100">
              <img 
                src="https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=2070&auto=format&fit=crop" 
                alt="Shopping Lifestyle" 
                className="absolute inset-0 w-full h-full object-cover lg:rounded-l-none"
              />
              {/* Gradient Overlay for seamless blending on mobile if needed, or just aesthetic */}
              <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent lg:bg-linear-to-r lg:from-gray-900 lg:to-transparent opacity-80 lg:opacity-100"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter