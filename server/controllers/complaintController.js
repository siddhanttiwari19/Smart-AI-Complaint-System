import Complaint from '../models/Complaint.js';

export const createComplaint = async (req, res) => {
  const complaint = await Complaint.create({
    ...req.body,
    user: req.user._id
  });

  res.status(201).json(complaint);
};

export const getComplaints = async (req, res) => {
  const { category, location } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (location) filter.location = new RegExp(location, 'i');

  const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
  res.json(complaints);
};

export const getComplaintById = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }

  res.json(complaint);
};

export const updateComplaintStatus = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }

  complaint.status = req.body.status;
  await complaint.save();

  res.json(complaint);
};

export const deleteComplaint = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);

  if (!complaint) {
    return res.status(404).json({ message: 'Complaint not found' });
  }

  await complaint.deleteOne();

  res.json({ message: 'Complaint removed' });
};