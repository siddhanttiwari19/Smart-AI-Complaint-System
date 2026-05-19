// client/src/pages/Dashboard.jsx

import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import ComplaintCard from '../components/ComplaintCard';

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/complaints');
      setComplaints(data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load complaints'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/complaints/${id}`, {
        status
      });
      fetchComplaints();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to update status'
      );
    }
  };

  // Analyze ALL complaints only when button is clicked
  const handleAnalyzeAll = async () => {
    try {
      setAnalyzing(true);
      setError('');

      for (const complaint of complaints) {
        // Skip complaints already analyzed
        if (complaint.aiAnalysis?.summary) continue;

        // Generate AI analysis
        const { data } = await api.post('/ai/analyze', {
          title: complaint.title,
          description: complaint.description,
          category: complaint.category
        });

        // Save analysis to database
        await api.put(`/complaints/${complaint._id}`, {
          status: complaint.status,
          aiAnalysis: data
        });
      }

      // Reload updated complaints
      await fetchComplaints();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'AI analysis failed'
      );
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <p>Loading complaints...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <h2>Complaint Dashboard</h2>

        {error && <div className="alert">{error}</div>}

        {/* Analyze All Complaints Button */}
        {complaints.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={handleAnalyzeAll}
              disabled={analyzing}
            >
              {analyzing
                ? '🤖 Generating AI Analysis...'
                : '🤖 Analyze All Complaints'}
            </button>
          </div>
        )}

        {/* Loading Message */}
        {analyzing && (
          <div className="ai-box" style={{ marginBottom: '20px' }}>
            <p>
              🤖 AI is analyzing all complaints and generating smart
              responses...
            </p>
          </div>
        )}

        {/* Complaint List */}
        {complaints.length === 0 ? (
          <p>No complaints found.</p>
        ) : (
          complaints.map((complaint) => (
            <ComplaintCard
              key={complaint._id}
              complaint={complaint}
              onStatusChange={updateStatus}
            />
          ))
        )}
      </div>
    </>
  );
}