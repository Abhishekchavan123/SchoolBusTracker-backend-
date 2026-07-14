const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');


// CREATE DRIVER
router.post('/', async (req, res) => {
  try {

    const {
      driver_name,
      email,
      password,
      phone,
      license_number,
      school_id,
      bus_id
    } = req.body;

    // Create login user
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          name: driver_name,
          email,
          password,
          role: 'driver'
        }
      ])
      .select()
      .single();

    if (userError) {
      return res.status(400).json(userError);
    }

    // Create driver profile
    const { data, error } = await supabase
      .from('drivers')
      .insert([
        {
          driver_name,
          phone,
          license_number,
          school_id,
          bus_id,
          user_id: userData.id
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


// GET ALL DRIVERS
router.get('/', async (req, res) => {

  try {

    const { data, error } = await supabase
      .from('drivers')
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