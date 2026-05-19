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

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Step 1: Analyze complaint using AI
  const handleAnalyze = async () => {
    if (!form.title || !form.description || !form.category) {
      setError(
        'Please fill Complaint Title, Description, and Category before AI analysis.'
      );
      return;
    }

    try {
      setError('');
      setAiLoading(true);
      setAiAnalysis(null);

      const { data } = await api.post('/ai/analyze', {
        title: form.title,
        description: form.description,
        category: form.category
      });

      setAiAnalysis(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'AI analysis failed'
      );
    } finally {
      setAiLoading(false);
    }
  };

  // Step 2: Save complaint
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!aiAnalysis) {
      setError('Please analyze the complaint first.');
      return;
    }

    try {
      setError('');
      setSubmitLoading(true);

      await api.post('/complaints', {
        ...form,
        aiAnalysis
      });

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to submit complaint'
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Register Complaint</h2>

        {error && <div className="alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
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
            placeholder="Describe your complaint..."
            rows="5"
            value={form.description}
            onChange={handleChange}
            required
          />

          <input
            name="category"
            placeholder="Category (e.g. Road Maintenance)"
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

          {/* AI Analyzer Section */}
          <div className="card" style={{ marginTop: '20px' }}>
            <h3>🤖 AI Complaint Analyzer</h3>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={aiLoading}
            >
              {aiLoading
                ? 'Generating AI Analysis...'
                : 'Analyze Complaint'}
            </button>

            {aiLoading && (
              <div className="ai-box" style={{ marginTop: '15px' }}>
                <p>
                  🤖 AI is analyzing the complaint and generating a smart
                  response...
                </p>
              </div>
            )}

            {aiAnalysis && (
              <div className="ai-box" style={{ marginTop: '15px' }}>
                <h4>AI Generated Response</h4>

                <p>
                  <strong>Priority:</strong> {aiAnalysis.priority}
                </p>

                <p>
                  <strong>Department:</strong> {aiAnalysis.department}
                </p>

                <p>
                  <strong>Summary:</strong> {aiAnalysis.summary}
                </p>

                <p>
                  <strong>Suggested Response:</strong>{' '}
                  {aiAnalysis.response}
                </p>
              </div>
            )}
          </div>

          {/* Final Submit */}
          <button
            type="submit"
            disabled={submitLoading || !aiAnalysis}
            style={{ marginTop: '20px' }}
          >
            {submitLoading
              ? 'Submitting Complaint...'
              : 'Submit Complaint'}
          </button>
        </form>
      </div>
    </>
  );
}