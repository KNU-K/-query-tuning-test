const { faker } = require("@faker-js/faker");
const mysql = require("mysql2/promise");

// MySQL 연결 설정
const connectionConfig = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "query_tuning",
};

async function generateUniqueEmails(numUsers, existingEmails) {
    let emails = new Set(existingEmails);
    let users = [];

    while (users.length < numUsers) {
        const email = faker.internet.email();
        if (!emails.has(email)) {
            emails.add(email);
            const username = faker.internet.userName().substring(0, 15);
            const password = faker.internet.password();
            users.push([email, username, password]);
        }
    }

    return users;
}

async function getExistingEmails() {
    const connection = await mysql.createConnection(connectionConfig);
    try {
        const [rows] = await connection.query("SELECT email FROM users");
        return rows.map((row) => row.email);
    } finally {
        await connection.end();
    }
}

async function insertUsers(users) {
    const sql = "INSERT INTO users (email, username, password) VALUES ?";
    const connection = await mysql.createConnection(connectionConfig);
    try {
        const [results] = await connection.query(sql, [users]);
        console.log("Inserted data:", results);
    } catch (err) {
        console.error("Error inserting data:", err.stack);
    } finally {
        await connection.end();
    }
}

async function main() {
    const numUsers = 1000000; // 생성할 더미 데이터 수
    const existingEmails = await getExistingEmails();
    const users = await generateUniqueEmails(numUsers, existingEmails);
    await insertUsers(users);
}

main().catch((err) => console.error(err));
