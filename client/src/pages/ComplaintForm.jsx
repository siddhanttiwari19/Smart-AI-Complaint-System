import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function ComplaintForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    title: '',
    description: '',
    category: '',
    location: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Step 1: Generate AI analysis
      const aiRes = await api.post('/ai/analyze', {
        title: form.title,
        description: form.description,
        category: form.category
      });

      // Step 2: Save complaint with AI analysis
      await api.post('/complaints', {
        ...form,
        aiAnalysis: aiRes.data
      });

      // Step 3: Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to submit complaint'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Register Complaint</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="title"
            placeholder="Complaint Title"
            value={form.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Complaint Description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />

          {loading && (
            <div className="ai-box">
              <p>
                🤖 AI is analyzing your complaint and generating a smart
                response...
              </p>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? '🤖 Generating AI analysis and response...'
              : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </>
  );
}