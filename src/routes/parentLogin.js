const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient");

router.post("/parent-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single();

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    if (user.role !== "parent") {
      return res.status(403).json({
        success: false,
        error: "Only Parents can login here",
      });
    }

    const { data: parentData, error: parentError } = await supabase
      .from("students")
      .select("bus_id")
      .eq("parent_user_id", user.id)
      .single();

    if (parentError || !parentData) {
      return res.status(404).json({
        success: false,
        error: "Parent record not found",
      });
    }

    return res.json({
      success: true,
      user: {
        ...user,
        bus_id: parentData.bus_id,
      },
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