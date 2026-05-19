import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function ComplaintDetails() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    fetchComplaint();
  }, []);

  const fetchComplaint = async () => {
    const { data } = await api.get(`/complaints/${id}`);
    setComplaint(data);
  };

  if (!complaint) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>{complaint.title}</h2>
        <p>{complaint.description}</p>
        <p><strong>Status:</strong> {complaint.status}</p>
        <p><strong>Location:</strong> {complaint.location}</p>

        {complaint.aiAnalysis && (
          <div className="ai-box">
            <h3>AI Analysis</h3>
            <p><strong>Priority:</strong> {complaint.aiAnalysis.priority}</p>
            <p><strong>Department:</strong> {complaint.aiAnalysis.department}</p>
            <p><strong>Summary:</strong> {complaint.aiAnalysis.summary}</p>
            <p><strong>Response:</strong> {complaint.aiAnalysis.response}</p>
          </div>
        )}
      </div>
    </>
  );
}