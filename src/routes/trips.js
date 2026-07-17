const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient");

// Start Trip
router.post("/start", async (req, res) => {
  try {
    const { bus_id, driver_id } = req.body;

    const { data, error } = await supabase
      .from("trips")
      .insert({
        bus_id,
        driver_id,
        trip_status: "active",
      })
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      trip: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

// Stop Trip
router.post("/stop", async (req, res) => {
  try {
    const { trip_id } = req.body;

    const { data, error } = await supabase
      .from("trips")
      .update({
        trip_status: "completed",
        end_time: new Date(),
      })
      .eq("id", trip_id)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      trip: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

module.exports = router;