const mysql = require("mysql2/promise");
const dbConfig = require("../dbConfig");

class Session {
    constructor(sessionId, staffId, date, time, location, slotsMax, description) {
        this.sessionId = sessionId;
        this.staffId = staffId;
        this.date = date;
        this.time = time;
        this.location = location;
        this.slotsMax = slotsMax;
        this.description = description;
    }

    // Helper Function to get New ID -- Referenced From: Ethan Chew Ming Hong, Repurposed By Rafol Emmanuel Legaspi
    static async getNextSessionId(connection) {
        const query = `SELECT MAX(SessionId) AS maxId FROM Session`;
        const [rows] = await connection.query(query);

        const incrementString = (str) => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(5, "0"));
        return incrementString(rows[0].maxId);
    }

    static async createSession(staffId, date, time, location, slots, description) {
        const connection = await mysql.createConnection(dbConfig);
        const newSessionId = await Session.getNextSessionId(connection);

        const query = `
            INSERT INTO Session 
            (SessionId, StaffId, SessionDate, SessionTime, SessionLocation, SessionSlotsMax, SessionDescription) 
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

        // Execute the insert query with placeholders
        await connection.execute(query, [
            newSessionId,
            staffId,
            date,
            time,
            location,
            slots,
            description
        ]);

        await connection.end();

        return new Session(newSessionId, staffId, date, time, location, slots, description);
    }
}

module.exports = Session;
