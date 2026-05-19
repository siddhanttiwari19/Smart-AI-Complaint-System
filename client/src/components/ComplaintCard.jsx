export default function ComplaintCard({ complaint, onStatusChange }) {
  return (
    <div className="card">
      <h3>{complaint.title}</h3>
      <p><strong>Category:</strong> {complaint.category}</p>
      <p><strong>Location:</strong> {complaint.location}</p>
      <p><strong>Status:</strong> {complaint.status}</p>
      <p><strong>Description:</strong> {complaint.description}</p>

      {complaint.aiAnalysis && (
        <div className="ai-box">
          <p><strong>Priority:</strong> {complaint.aiAnalysis.priority}</p>
          <p><strong>Department:</strong> {complaint.aiAnalysis.department}</p>
          <p><strong>Summary:</strong> {complaint.aiAnalysis.summary}</p>
          <p><strong>Response:</strong> {complaint.aiAnalysis.response}</p>
        </div>
      )}

      {onStatusChange && (
        <select
          value={complaint.status}
          onChange={(e) => onStatusChange(complaint._id, e.target.value)}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>
      )}
    </div>
  );
}