const Account = require("./account");
const mysql = require("mysql2/promise");
const dbConfig = require("../dbConfig");

class Client extends Account {
    constructor(id, name, email, password, creationDate, phoneNumber) {
        super(id, name, email, password, creationDate);
        this.phoneNumber = phoneNumber;
    }

    static async createClient(id, name, email, password, insertUnixTime, phoneNumber) {
        const connection = await mysql.createConnection(dbConfig);

        const insertClientQuery = `
            INSERT INTO Client (ClientId, PhoneNumber) 
            VALUES (?, ?);
        `;

        // Execute the insert query
        await connection.execute(insertClientQuery, [id, phoneNumber]);

        await connection.end();

        return new Client(id, name, email, password, insertUnixTime, phoneNumber);
    }

    static async getClientById(id) {
        const connection = await mysql.createConnection(dbConfig);

        const getClientQuery = `
            SELECT *
            FROM Client
            WHERE ClientId = ?;
        `;

        const [rows] = await connection.query(getClientQuery, [id]);

        await connection.end();

        return rows.length > 0 ? rows[0] : null;
    }

    static async getClientByEmail(email) {
        const connection = await mysql.createConnection(dbConfig);

        const getClientQuery = `
            SELECT c.*, a.AccountName, a.AccountEmail, a.AccountCreationDate
            FROM Client c
            JOIN Account a ON c.ClientId = a.AccountId
            WHERE a.AccountEmail = ?;
        `;

        const [rows] = await connection.query(getClientQuery, [email]);

        await connection.end();

        return rows.length > 0 ? rows[0] : null;
    }
}

module.exports = Client;
