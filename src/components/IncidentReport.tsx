
import React, { useState } from 'react';
import { AlertTriangle, Camera, MapPin, Send } from 'lucide-react';

const IncidentReport = ({ onReport, userLocation }) => {
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportTypes = [
    { id: 'safety', label: 'Safety Hazard', icon: '⚠️' },
    { id: 'maintenance', label: 'Maintenance Issue', icon: '🔧' },
    { id: 'security', label: 'Security Concern', icon: '🚨' },
    { id: 'accessibility', label: 'Accessibility Issue', icon: '♿' },
    { id: 'other', label: 'Other', icon: '📝' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportType || !description) return;

    setIsSubmitting(true);
    
    const report = {
      type: reportType,
      description,
      location: location || 'Current Location',
      severity,
      timestamp: new Date().toISOString(),
      coordinates: userLocation
    };

    // Simulate API call
    setTimeout(() => {
      onReport(report);
      setIsSubmitting(false);
      
      // Reset form
      setReportType('');
      setDescription('');
      setLocation('');
      setSeverity('medium');
      
      // Show success message
      alert('Thank you! Your report has been submitted and you earned 20 points!');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <AlertTriangle className="h-8 w-8 text-orange-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Report an Issue</h2>
            <p className="text-gray-600">Help keep our campus safe and accessible</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What type of issue are you reporting?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setReportType(type.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    reportType === type.id
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{type.icon}</div>
                  <div className="font-medium text-sm">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please provide details about the issue..."
              rows={4}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Specific Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Near main library entrance, Building A Room 101..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Leave blank to use your current location
            </p>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How urgent is this issue?
            </label>
            <div className="flex space-x-4">
              {[
                { value: 'low', label: 'Low', color: 'green' },
                { value: 'medium', label: 'Medium', color: 'yellow' },
                { value: 'high', label: 'High', color: 'red' }
              ].map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="severity"
                    value={option.value}
                    checked={severity === option.value}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border-2 mr-2 ${
                    severity === option.value
                      ? `bg-${option.color}-500 border-${option.color}-500`
                      : 'border-gray-300'
                  }`} />
                  <span className="text-sm font-medium text-gray-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Camera className="h-4 w-4" />
                <span>Add Photo</span>
              </button>
            </div>
            
            <button
              type="submit"
              disabled={!reportType || !description || isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>{isSubmitting ? 'Submitting...' : 'Submit Report'}</span>
            </button>
          </div>
        </form>

        {/* Reward Info */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="bg-green-500 rounded-full p-1">
              <span className="text-white text-xs">+20</span>
            </div>
            <span className="text-green-800 font-medium text-sm">
              Earn 20 points for each verified report to help improve campus safety!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReport;
