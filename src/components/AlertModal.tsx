
import React from 'react';
import { AlertTriangle, Shield, Info, X, Clock, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';

interface Alert {
  id: string;
  message: string;
  coords: [number, number];
  timestamp: string;
  type?: string;
  severity?: 'low' | 'medium' | 'high';
  title?: string;
  location?: string;
  active?: boolean;
}

interface AlertModalProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge?: (alertId: string) => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ 
  alert, 
  isOpen, 
  onClose, 
  onAcknowledge 
}) => {
  if (!alert) return null;

  const getSeverityColor = (severity: string = 'medium') => {
    switch (severity) {
      case 'high':
        return 'bg-red-50 border-red-200 text-red-900';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900';
      case 'low':
        return 'bg-green-50 border-green-200 text-green-900';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900';
    }
  };

  const getSeverityIcon = (severity: string = 'medium') => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-6 w-6 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case 'low':
        return <Shield className="h-6 w-6 text-green-600" />;
      default:
        return <Info className="h-6 w-6 text-blue-600" />;
    }
  };

  const getPriorityLabel = (severity: string = 'medium') => {
    switch (severity) {
      case 'high':
        return { label: 'HIGH PRIORITY', color: 'bg-red-600 text-white' };
      case 'medium':
        return { label: 'MEDIUM PRIORITY', color: 'bg-yellow-600 text-white' };
      case 'low':
        return { label: 'LOW PRIORITY', color: 'bg-green-600 text-white' };
      default:
        return { label: 'NOTICE', color: 'bg-blue-600 text-white' };
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return timestamp;
    }
  };

  const priorityInfo = getPriorityLabel(alert.severity);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getSeverityIcon(alert.severity)}
              <DialogTitle className="text-lg font-semibold">
                {alert.title || 'Safety Alert'}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${priorityInfo.color}`}>
            {priorityInfo.label}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Alert Content */}
          <div className={`p-4 rounded-lg border-2 ${getSeverityColor(alert.severity)}`}>
            <p className="text-sm font-medium leading-relaxed">
              {alert.message}
            </p>
          </div>

          {/* Alert Details */}
          <div className="space-y-3 text-sm">
            {alert.location && (
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Location: {alert.location}</span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Time: {formatTime(alert.timestamp)}</span>
            </div>

            {alert.coords && (
              <div className="flex items-center space-x-2 text-gray-500 text-xs">
                <span>Coordinates: {alert.coords[0].toFixed(4)}, {alert.coords[1].toFixed(4)}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Close
            </Button>
            {onAcknowledge && (
              <Button
                onClick={() => {
                  onAcknowledge(alert.id);
                  onClose();
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Acknowledge
              </Button>
            )}
          </div>

          {/* Safety Tips */}
          {alert.severity === 'high' && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Safety Reminder:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Stay calm and follow instructions</li>
                <li>• Move to a safe location if needed</li>
                <li>• Contact emergency services if required</li>
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlertModal;
