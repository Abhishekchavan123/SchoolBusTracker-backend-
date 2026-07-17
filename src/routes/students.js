const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');

// CREATE STUDENT + PARENT LOGIN
router.post('/', async (req, res) => {
  try {
    const {
      student_name,
      parent_name,
      parent_phone,
      parent_email,
      parent_password,
      school_id,
      bus_id,
      pickup_point,
      drop_point
    } = req.body;

    // Create Parent User
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        name: parent_name,
        email: parent_email,
        password: parent_password,
        role: 'parent'
      })
      .select()
      .single();

    if (userError) {
      return res.status(400).json({
        success: false,
        error: userError.message
      });
    }

    // Create Student
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .insert({
        student_name,
        parent_name,
        parent_phone,
        pickup_point,
        drop_point,
        school_id,
        bus_id,
        parent_user_id: userData.id
      })
      .select()
      .single();

    if (studentError) {
      return res.status(400).json({
        success: false,
        error: studentError.message
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Student Added Successfully',
      student: studentData,
      parent: userData
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// GET ALL STUDENTS
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    return res.json({
      success: true,
      students: data
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
// GET STUDENT BY PARENT USER ID
router.get('/parent/:parentId', async (req, res) => {
  try {
    const { parentId } = req.params;

    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('parent_user_id', parentId)
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    return res.json({
      success: true,
      student: data
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
});
module.exports = router;