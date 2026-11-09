import express from 'express';
import mongoose from 'mongoose';
import Lead from '../models/Lead.js';

const router = express.Router();

let memoryLeads = [];

// GET /api/leads - Fetch all seller requests (Admin only)
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        count: memoryLeads.length,
        data: memoryLeads,
        source: 'memory'
      });
    }

    let leads = await Lead.find().sort({ createdAt: -1 });

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

    if (mongoose.connection.readyState !== 1) {
      const memoryLead = {
        _id: new mongoose.Types.ObjectId().toString(),
        id: String(Date.now()),
        ticketId: `TKT-${Math.floor(100 + Math.random() * 900)}`,
        ownerName,
        phone,
        location,
        assetType: assetType || 'Villa',
        expectedPrice: expectedPrice || 'Price on Request',
        details: details || '',
        status: 'Pending Inspection',
        createdAt: new Date().toISOString()
      };
      memoryLeads.unshift(memoryLead);
      return res.status(201).json({
        success: true,
        message: 'Property onboarding request submitted successfully',
        data: memoryLead
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

    if (mongoose.connection.readyState !== 1) {
      const idx = memoryLeads.findIndex(l => String(l._id) === String(req.params.id) || String(l.id) === String(req.params.id));
      if (idx !== -1) {
        memoryLeads[idx].status = status;
        return res.json({
          success: true,
          message: 'Lead status updated',
          data: memoryLeads[idx]
        });
      }
      return res.status(404).json({
        success: false,
        message: 'Lead ticket not found in memory'
      });
    }

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
    if (mongoose.connection.readyState !== 1) {
      memoryLeads = memoryLeads.filter(l => String(l._id) !== String(req.params.id) && String(l.id) !== String(req.params.id));
      return res.json({
        success: true,
        message: 'Lead removed successfully',
        data: { id: req.params.id }
      });
    }

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
