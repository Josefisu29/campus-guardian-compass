
import React from 'react';
import { MapPin, Bell, Users, Shield, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to <span className="text-yellow-400">AFIT</span>
              <br />Campus Navigator
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Your complete guide to the Air Force Institute of Technology campus. 
              Discover buildings, get event notifications, and navigate with ease.
            </p>
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold px-8 py-4 text-lg"
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Campus Life
            </h2>
            <p className="text-xl text-gray-600">
              Designed specifically for AFIT cadets and staff
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Map</h3>
              <p className="text-gray-600">
                Explore every building with detailed information and high-quality images
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Event Alerts</h3>
              <p className="text-gray-600">
                Never miss important events with real-time notifications
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">
                Connect with fellow cadets and stay updated on campus activities
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Safety First</h3>
              <p className="text-gray-600">
                Access safety information and emergency contacts instantly
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Highlights */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Discover AFIT Campus
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Alfa Hall</h3>
                <p className="text-gray-600">
                  Home to 1,200 undergraduates with modern amenities and study spaces
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-green-400 to-green-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sports Stadium</h3>
                <p className="text-gray-600">
                  Multi-purpose stadium for football, athletics, and major sporting events
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="h-48 bg-gradient-to-r from-purple-400 to-purple-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Engineering Complex</h3>
                <p className="text-gray-600">
                  State-of-the-art laboratories and lecture halls for engineering programs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-900 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Explore AFIT?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of cadets already using the campus navigator
          </p>
          <Button 
            onClick={onGetStarted}
            size="lg"
            className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-semibold px-8 py-4 text-lg"
          >
            Sign Up Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Air Force Institute of Technology. Built for the AFIT community.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
