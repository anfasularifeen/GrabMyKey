import express from 'express';
import mongoose from 'mongoose';
import Lead from '../models/Lead.js';

const router = express.Router();

const memoryLeads = [
  {
    _id: "671e901",
    id: "901",
    ticketId: "TKT-901",
    ownerName: "Muhammed Rashid",
    phone: "+91 98470 12345",
    location: "Bejai, Mangaluru",
    assetType: "Apartment",
    expectedPrice: "₹1.10 Cr",
    details: "3BHK luxury apartment ready for title audit and walkthrough inspection.",
    status: "New Inquiry"
  },
  {
    _id: "671e902",
    id: "902",
    ticketId: "TKT-902",
    ownerName: "Capt. Arvind Hegde",
    phone: "+91 94481 67890",
    location: "Kadri Hills, Mangaluru",
    assetType: "Villa",
    expectedPrice: "₹3.40 Cr",
    details: "Colonial style 4BHK independent bungalow with private orchard and clear 40-year deed.",
    status: "Contacted"
  },
  {
    _id: "671e903",
    id: "903",
    ticketId: "TKT-903",
    ownerName: "Dr. Ronald Pinto",
    phone: "+91 98200 54321",
    location: "Surathkal Beach Road",
    assetType: "Plot",
    expectedPrice: "₹85 Lakhs",
    details: "Coastal residential plot with CRZ-II clearance certificate and compound wall.",
    status: "Archived / Resolved"
  }
];

// GET /api/leads - Fetch all seller requests (Admin only)
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        count: memoryLeads.length,
        data: memoryLeads,
        source: 'cache'
      });
    }

    let leads = await Lead.find().sort({ createdAt: -1 });

    // Seed sample request if empty
    if (leads.length === 0) {
      const sample = new Lead(memoryLeads[0]);
      await sample.save();
      leads = [sample];
    }

    res.json({
      success: true,
      count: leads.length,
      data: leads,
      source: 'mongodb'
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve seller leads',
      error: error.message
    });
  }
});

// POST /api/leads - Submit seller onboarding request (Public)
router.post('/', async (req, res) => {
  try {
    const { ownerName, phone, location, assetType, expectedPrice, details } = req.body;

    if (!ownerName || !phone || !location) {
      return res.status(400).json({
        success: false,
        message: 'Owner name, phone number, and location are required'
      });
    }

    const newLead = new Lead({
      ownerName,
      phone,
      location,
      assetType: assetType || 'Villa',
      expectedPrice: expectedPrice || 'Price on Request',
      details: details || '',
      status: 'Pending Inspection'
    });

    const saved = await newLead.save();

    res.status(201).json({
      success: true,
      message: 'Property onboarding request submitted successfully',
      data: saved
    });
  } catch (error) {
    console.error('Error submitting lead:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit onboarding request',
      error: error.message
    });
  }
});

// PATCH /api/leads/:id - Update lead status
router.patch('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Lead.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Lead ticket not found'
      });
    }

    res.json({
      success: true,
      message: 'Lead status updated',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating lead status',
      error: error.message
    });
  }
});

// DELETE /api/leads/:id - Delete lead (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Lead.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found to delete'
      });
    }

    res.json({
      success: true,
      message: 'Lead removed successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete lead',
      error: error.message
    });
  }
});

export default router;
