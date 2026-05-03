import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/admin/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Portal</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <p className="text-red-500 text-center text-sm bg-red-50 p-2 rounded">{error}</p>}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-lg" />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-lg" />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Login</button>
        </form>
      </div>
    </div>
  );
}