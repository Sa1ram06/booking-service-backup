const Account = require("./account");
const mysql = require("mysql2/promise");
const dbConfig = require("../dbConfig");

class Staff extends Account {
    constructor(id, name, email, password, creationDate) {
        super(id, name, email, password, creationDate);
    }

    // Here, you could add any specific Staff-related functionality
}

module.exports = Staff;
