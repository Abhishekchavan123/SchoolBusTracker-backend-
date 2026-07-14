const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');


// DRIVER UPDATES LOCATION
router.post('/update', async (req, res) => {
  try {

    const {
      bus_id,
      latitude,
      longitude,
      speed
    } = req.body;

    const { data, error } = await supabase
      .from('live_locations')
      .upsert(
        {
          bus_id,
          latitude,
          longitude,
          speed,
          updated_at: new Date()
        },
        {
          onConflict: 'bus_id'
        }
      )
      .select();

    if (error) {
      return res.status(400).json(error);
    }

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});


// PARENT GETS LIVE LOCATION
router.get('/bus/:busId', async (req, res) => {

  try {

    const { data, error } = await supabase
      .from('live_locations')
      .select('*')
      .eq('bus_id', req.params.busId)
      .single();

    if (error) {
      return res.status(404).json(error);
    }

    res.json(data);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });

  }

});

module.exports = router;