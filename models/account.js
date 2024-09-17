const mysql = require("mysql2/promise");
const dbConfig = require("../dbConfig");

class Account {
    constructor(id, name, email, password, creationDate) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.creationDate = creationDate;
    }

    // Helper Function to get New ID -- Created by: Ethan Chew Ming Hong, Repurposed By Rafol Emmanuel Legaspi
    static async getNextAccountId(connection) {
        const query = `SELECT MAX(AccountId) AS maxId FROM Account`;
        const [rows] = await connection.query(query);

        const incrementString = (str) => str.replace(/\d+/, num => (Number(num) + 1).toString().padStart(4, "0"));
        return incrementString(rows[0].maxId);
    }

    static async createAccount(name, email, password) {
        const connection = await mysql.createConnection(dbConfig);
        const newAccountId = await Account.getNextAccountId(connection);
        const insertUnixTime = Math.floor(Date.now() / 1000);

        const query = `
            INSERT INTO Account (AccountId, AccountName, AccountEmail, AccountPassword, AccountCreationDate) 
            VALUES (?, ?, ?, ?, ?);
        `;

        await connection.execute(query, [newAccountId, name, email, password, insertUnixTime]);

        await connection.end();

        return new Account(newAccountId, name, email, password, insertUnixTime);
    }

    static async getAccountWithEmail(email) {
        const connection = await mysql.createConnection(dbConfig);

        const query = `
            SELECT *
            FROM Account 
            WHERE AccountEmail = ?;
        `;

        const [rows] = await connection.query(query, [email]);
        await connection.end();

        return rows.length > 0 ? rows[0] : null;
    }
}

module.exports = Account;
