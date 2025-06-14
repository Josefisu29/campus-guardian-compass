
import React, { useState } from 'react';
import { AlertTriangle, Clock, MapPin, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AlertModal from './AlertModal';

interface Alert {
  id: string;
  message: string;
  coords: [number, number];
  timestamp: string;
  type?: string;
}

interface SafetyAlertsProps {
  alerts: Alert[];
  isAdmin?: boolean;
}

const SafetyAlerts = ({ alerts, isAdmin = false }: SafetyAlertsProps) => {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewAlert = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const getAlertTypeColor = (type?: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-orange-500';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Safety Alerts</span>
            {isAdmin && (
              <Badge variant="secondary" className="ml-auto">
                Admin View
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            {alerts.length > 0 
              ? `${alerts.length} active safety alerts on campus`
              : 'No active safety alerts'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No safety alerts at this time</p>
              <p className="text-sm text-gray-400">Campus is all clear!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 border rounded-lg bg-gradient-to-r from-red-50 to-orange-50 border-red-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${getAlertTypeColor(alert.type)} animate-pulse`}></div>
                        <Badge variant={alert.type === 'emergency' ? 'destructive' : 'secondary'}>
                          {alert.type || 'Alert'}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimestamp(alert.timestamp)}
                        </div>
                      </div>
                      
                      <p className="text-gray-800 font-medium mb-2">{alert.message}</p>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>Coordinates: {alert.coords[0]}, {alert.coords[1]}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewAlert(alert)}
                      >
                        View Details
                      </Button>
                      {isAdmin && (
                        <Button variant="outline" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertModal
        alert={selectedAlert}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAlert(null);
        }}
      />
    </div>
  );
};

export default SafetyAlerts;
