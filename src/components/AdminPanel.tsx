
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface RegisteredUser {
  uid: string;
  email: string;
  role: string;
  createdAt: string;
  points: number;
}

const AdminPanel: React.FC = () => {
  const { registerUserAsAdmin } = useAuth();
  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'student' | 'staff'>('student');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(usersQuery);
      const usersData = snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as RegisteredUser[];
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await registerUserAsAdmin(newUserEmail, newUserPassword, newUserRole);
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('student');
      await fetchUsers();
      alert('User registered successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Failed to register user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Register New User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegisterUser} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              required
            />
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value as 'student' | 'staff')}
              className="w-full p-2 border rounded-md"
            >
              <option value="student">Student</option>
              <option value="staff">Staff</option>
            </select>
            <Button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register User'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.map((user) => (
              <div key={user.uid} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-gray-600">
                    {user.role} • {user.points} points
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
