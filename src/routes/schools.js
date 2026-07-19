const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
// Get all schools
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('school_name');

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    res.json(data);

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
router.post('/', async (req, res) => {
  try {
    const {
      school_name,
      school_code,
      email,
      phone,
      address,

      admin_name,
      user_id,
      password,
    } = req.body;

    // Create School
    const { data: school, error } = await supabase
      .from('schools')
      .insert({
        school_name,
        school_code,
        email,
        phone,
        address,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    // Create School Admin User
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        name: admin_name,
        // remove this line if users table doesn't have user_id column
        email: email,
        password: password,
        role: 'school_admin',
      })
      .select()
      .single();

    if (userError) {
      return res.status(400).json({
        success: false,
        error: userError.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'School Added Successfully',
      school,
      user,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;
