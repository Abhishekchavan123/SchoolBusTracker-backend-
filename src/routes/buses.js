const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');


// CREATE BUS
router.post('/', async (req, res) => {
  try {

    const {
      bus_number,
      bus_name,
      vehicle_registration_number,
      vehicle_model,
      capacity,
      route_number,
      route_name,
      school_id,
      driver_id
    } = req.body;

    const { data, error } = await supabase
      .from('buses')
      .insert([
        {
          bus_number,
          bus_name,
          vehicle_registration_number,
          vehicle_model,
          capacity,
          route_number,
          route_name,
          school_id,
          driver_id
        }
      ])
      .select();

    if (error) {
      return res.status(400).json(error);
    }

    res.status(201).json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message
    });
  }
});


// GET ALL BUSES
router.get('/', async (req, res) => {
  try {

    const { data, error } = await supabase
      .from('buses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json(error);
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

module.exports = router;