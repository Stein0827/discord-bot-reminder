import pg from 'pg';
import 'dotenv/config';
const { Pool } = pg;

// TODO add enviroment var later
export class DatabaseClient {
    constructor() {
        this.pool = new Pool({
            // Provide your database configuration here
            user: '',
            host: 'localhost',
            database: 'discord_bot',
            password: '',
            port: 5432,
            max: 20, // Maximum number of clients in the pool
            idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
            connectionTimeoutMillis: 2000, // How long to wait for a connection to be established before failing
        });
    }

    async insertData(userID, productName, url, price, channel_id) {
        const client = await this.pool.connect();

        try {
            const query = `
                INSERT INTO productRecords (userid, productname, link, price, channelID)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (userid, productname, link) DO NOTHING;
            `;

            const values = [userID, productName, url, price, channel_id];
            console.log(await client.query(query, values));

        } catch (error) {
            console.error('Error inserting data:', error);
        } finally {
            client.release(); // Release the client back to the pool
        }
    }

    async end() {
        await this.pool.end();
    }
}