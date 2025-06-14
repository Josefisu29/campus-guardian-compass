
import React, { useState } from 'react';
import { User, Award, Star, Trophy } from 'lucide-react';

const UserProfile = ({ points }) => {
  const [showProfile, setShowProfile] = useState(false);

  const achievements = [
    { id: 1, name: 'Explorer', description: 'Visited 5 locations', earned: true, icon: '🗺️' },
    { id: 2, name: 'Reporter', description: 'Submitted first report', earned: true, icon: '📝' },
    { id: 3, name: 'Guardian', description: 'Helped improve campus safety', earned: false, icon: '🛡️' },
    { id: 4, name: 'Navigator', description: 'Used directions 10 times', earned: false, icon: '🧭' }
  ];

  const getLevel = (points) => {
    if (points >= 500) return { level: 5, name: 'Campus Expert', next: 1000 };
    if (points >= 200) return { level: 4, name: 'Advanced Navigator', next: 500 };
    if (points >= 100) return { level: 3, name: 'Campus Explorer', next: 200 };
    if (points >= 50) return { level: 2, name: 'Active User', next: 100 };
    return { level: 1, name: 'New Navigator', next: 50 };
  };

  const userLevel = getLevel(points);
  const progress = ((points % userLevel.next) / userLevel.next) * 100;

  return (
    <div className="relative">
      <button
        onClick={() => setShowProfile(!showProfile)}
        className="flex items-center space-x-2 p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
      >
        <div className="bg-blue-600 rounded-full p-2">
          <User className="h-4 w-4 text-white" />
        </div>
      </button>

      {showProfile && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
          <div className="p-6">
            {/* Profile Header */}
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Campus Navigator</h3>
              <p className="text-blue-600 font-medium">{userLevel.name}</p>
            </div>

            {/* Points and Level */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress to Level {userLevel.level + 1}</span>
                <span className="text-sm text-gray-500">{points}/{userLevel.next}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Achievements */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                Achievements
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border-2 ${
                      achievement.earned
                        ? 'border-yellow-300 bg-yellow-50'
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="text-xs font-medium text-gray-900">{achievement.name}</div>
                    <div className="text-xs text-gray-600">{achievement.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{points}</div>
                <div className="text-xs text-gray-600">Total Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {achievements.filter(a => a.earned).length}
                </div>
                <div className="text-xs text-gray-600">Achievements</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{userLevel.level}</div>
                <div className="text-xs text-gray-600">Level</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
