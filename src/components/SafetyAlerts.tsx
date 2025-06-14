
import React from 'react';
import { AlertTriangle, Shield, Clock } from 'lucide-react';

const SafetyAlerts = ({ alerts }) => {
  const sampleAlerts = [
    {
      id: 1,
      type: 'weather',
      severity: 'high',
      title: 'Severe Weather Warning',
      message: 'Heavy rain and strong winds expected. Seek indoor shelter.',
      location: 'Campus-wide',
      time: '2 minutes ago',
      active: true
    },
    {
      id: 2,
      type: 'security',
      severity: 'medium',
      title: 'Construction Zone',
      message: 'North entrance blocked due to maintenance work.',
      location: 'North Campus',
      time: '15 minutes ago',
      active: true
    },
    {
      id: 3,
      type: 'emergency',
      severity: 'low',
      title: 'Emergency Drill Completed',
      message: 'Fire drill successfully completed. Normal operations resumed.',
      location: 'Science Building',
      time: '1 hour ago',
      active: false
    }
  ];

  const allAlerts = [...(alerts || []), ...sampleAlerts];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low':
        return 'bg-green-100 border-green-500 text-green-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Shield className="h-5 w-5 text-green-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Safety Center</h2>
            <p className="text-gray-600">Real-time campus safety information</p>
          </div>
        </div>

        {/* Active Alerts */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
          <div className="space-y-4">
            {allAlerts.filter(alert => alert.active).map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 p-4 rounded-lg ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start space-x-3">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{alert.title}</h4>
                      <div className="flex items-center space-x-1 text-sm opacity-75">
                        <Clock className="h-4 w-4" />
                        <span>{alert.time}</span>
                      </div>
                    </div>
                    <p className="mb-2">{alert.message}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">📍 {alert.location}</span>
                      <span className="uppercase tracking-wide font-bold">
                        {alert.severity} priority
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Tips */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Safety Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-200 rounded-full p-2">
                <Shield className="h-4 w-4 text-blue-800" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Stay Alert</h4>
                <p className="text-sm text-blue-700">Always be aware of your surroundings while walking on campus.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-200 rounded-full p-2">
                <AlertTriangle className="h-4 w-4 text-blue-800" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Report Issues</h4>
                <p className="text-sm text-blue-700">Use the report feature to notify others of safety concerns.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Alerts History */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h3>
          <div className="space-y-3">
            {allAlerts.filter(alert => !alert.active).map((alert) => (
              <div
                key={alert.id}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg opacity-75"
              >
                <Shield className="h-4 w-4 text-gray-500" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">{alert.title}</span>
                    <span className="text-sm text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-600">{alert.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyAlerts;
