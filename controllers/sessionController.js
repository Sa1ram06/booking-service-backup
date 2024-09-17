const Session = require("../models/session");

const createSession = async (req, res) => {
    try {
        const { staffId, date, time, location, slots, description } = req.body;

        const createSession = await Session.createSession(staffId, date, time, location, slots, description);

        if (!createSession) {
            res.status(500).json({
                message: `Failed to create booking.`
            });
            return;
        }

        res.status(201).json({
            message: `Session with ID ${createSession.sessionId} has been created successfully`,
            session: createSession
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Scold Emmanuel",
            error: err
        });
    }

}

module.exports = {
    createSession
}
