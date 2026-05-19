import express from 'express';
import {
  createComplaint,
  deleteComplaint,
  getComplaintById,
  getComplaints,
  updateComplaintStatus
} from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createComplaint)
  .get(protect, getComplaints);

router.route('/:id')
  .get(protect, getComplaintById)
  .put(protect, updateComplaintStatus)
  .delete(protect, deleteComplaint);

export default router;