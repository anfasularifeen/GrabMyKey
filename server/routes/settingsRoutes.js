import express from 'express';
import mongoose from 'mongoose';
import SiteSettings from '../models/SiteSettings.js';

const router = express.Router();

// In-memory fallback if MongoDB is not connected
let memorySettings = {
  heroFeaturedPropertyId: null,
  heroCustomYoutubeId: "",
  heroBadgeTag: "FEATURED PROPERTY",
  heroOverlayTitle: "",
  heroOverlayLocation: ""
};

// GET /api/settings - Retrieve current site settings
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let settings = await SiteSettings.findOne().populate('heroFeaturedPropertyId');
      if (!settings) {
        settings = await SiteSettings.create(memorySettings);
      }
      return res.json({
        success: true,
        data: settings
      });
    }

    return res.json({
      success: true,
      data: memorySettings,
      note: 'Serving from memory store (MongoDB disconnected)'
    });
  } catch (err) {
    console.error('Error fetching site settings:', err);
    return res.json({
      success: true,
      data: memorySettings,
      error: err.message
    });
  }
});

// PUT /api/settings - Update site settings
router.put('/', async (req, res) => {
  try {
    const { 
      heroFeaturedPropertyId, 
      heroCustomYoutubeId, 
      heroBadgeTag, 
      heroOverlayTitle, 
      heroOverlayLocation 
    } = req.body;

    const updateData = {};
    if (heroFeaturedPropertyId !== undefined) {
      updateData.heroFeaturedPropertyId = heroFeaturedPropertyId && mongoose.Types.ObjectId.isValid(heroFeaturedPropertyId) 
        ? heroFeaturedPropertyId 
        : null;
    }
    if (heroCustomYoutubeId !== undefined) updateData.heroCustomYoutubeId = heroCustomYoutubeId;
    if (heroBadgeTag !== undefined) updateData.heroBadgeTag = heroBadgeTag;
    if (heroOverlayTitle !== undefined) updateData.heroOverlayTitle = heroOverlayTitle;
    if (heroOverlayLocation !== undefined) updateData.heroOverlayLocation = heroOverlayLocation;

    // Update in-memory fallback
    memorySettings = { ...memorySettings, ...updateData };

    if (mongoose.connection.readyState === 1) {
      let settings = await SiteSettings.findOne();
      if (!settings) {
        settings = new SiteSettings(updateData);
      } else {
        Object.assign(settings, updateData);
      }
      await settings.save();
      const populated = await SiteSettings.findById(settings._id).populate('heroFeaturedPropertyId');
      
      return res.json({
        success: true,
        message: 'Site settings updated successfully in MongoDB',
        data: populated
      });
    }

    return res.json({
      success: true,
      message: 'Site settings updated in memory store',
      data: memorySettings
    });
  } catch (err) {
    console.error('Error updating site settings:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update site settings',
      error: err.message
    });
  }
});

export default router;
