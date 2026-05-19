import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import ComplaintCard from '../components/ComplaintCard';

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    const { data } = await api.get('/complaints');
    setComplaints(data);
  };

  const updateStatus = async (id, status) => {
    await api.put(`/complaints/${id}`, { status });
    fetchComplaints();
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Complaint Dashboard</h2>
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