const express = require("express");
const router = express.Router();
const { supabase } = require("../supabaseClient");

router.post("/driver-login", async (req, res) => {
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
        console.log("Driver Login User:", user);

        if (user.role !== "driver") {
            return res.status(403).json({
                success: false,
                error: "Only Drivers can login here",
            });
        }

        const { data: driverData, error: driverError } = await supabase
            .from("drivers")
            .select("bus_id")
            .eq("user_id", user.id)
            .single();

        if (driverError) {
            return res.status(404).json({
                success: false,
                error: "Driver record not found",
            });
        }

        return res.json({
            success: true,
            user: {
                ...user,
                bus_id: driverData.bus_id,
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