const mysql = require("mysql2/promise");
const dbConfig = require("../dbConfig");

class Booking {
    constructor(bookingId, sessionId, clientId, status) {
        this.bookingId = bookingId;
        this.sessionId = sessionId;
        this.clientId = clientId;
        this.status = status;
    }

    // Helper Function to get New ID -- Referenced From: Ethan Chew Ming Hong, Repurposed By Rafol Emmanuel Legaspi
    static async getNextBookingId(connection) {
        const query = `SELECT MAX(BookingId) AS maxId FROM Booking`;
        const [rows] = await connection.query(query);

        const incrementString = (str) => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(5, "0"));
        return incrementString(rows[0].maxId);
    }

    static async createBooking(sessionId, clientId) {
        const connection = await mysql.createConnection(dbConfig);
        const newBookingId = await Booking.getNextBookingId(connection);
        const status = "Confirmed";

        const query = `
            INSERT INTO Booking (BookingId, SessionId, ClientId, BookingStatus) 
            VALUES (?, ?, ?, ?);
        `;

        await connection.execute(query, [newBookingId, sessionId, clientId, status]);

        await connection.end();

        return new Booking(newBookingId, sessionId, clientId, status);
    }

    static async viewBookingsByClientId(clientId) {
        const connection = await mysql.createConnection(dbConfig);

        const query = `
            SELECT b.*, s.SessionDate, s.SessionTime, s.SessionLocation, s.SessionDescription
            FROM Booking b
            INNER JOIN Session s ON b.SessionId = s.SessionId
            WHERE b.ClientId = ?;
        `;

        const [rows] = await connection.query(query, [clientId]);

        await connection.end();

        return rows;
    }

    static async getBookingBySessionAndClientIds(sessionId, clientId) {
        const connection = await mysql.createConnection(dbConfig);

        const query = `
            SELECT *
            FROM Booking
            WHERE ClientId = ? AND SessionId = ?
            LIMIT 1;
        `;

        const [rows] = await connection.query(query, [clientId, sessionId]);

        await connection.end();

        return rows.length > 0 ? rows[0] : null;
    }

    static async cancelBookingByBookingId(bookingId) {
        const connection = await mysql.createConnection(dbConfig);
        const status = 'Cancelled';

        const query = `
            UPDATE Booking
            SET BookingStatus = ?
            WHERE BookingId = ?;
        `;

        const [result] = await connection.query(query, [status, bookingId]);

        await connection.end();

        return result.affectedRows === 1;
    }

    static async reconfirmBookingStatusByBookingId(bookingId) {
        const connection = await mysql.createConnection(dbConfig);
        const status = 'Confirmed';

        const query = `
            UPDATE Booking
            SET BookingStatus = ?
            WHERE BookingId = ?;
        `;

        const [result] = await connection.query(query, [status, bookingId]);

        await connection.end();

        return result.affectedRows === 1;
    }
}

module.exports = Booking;
