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
                ON CONFLICT (userid, productname) DO NOTHING;
            `;

            const values = [userID, productName, url, price, channel_id];
            console.log(await client.query(query, values));

        } catch (error) {
            console.error('Error inserting data:', error);
        } finally {
            client.release(); // Release the client back to the pool
        }
    }

    // Function to fetch products for one user
    async getDataByUser(userID) {
        const client = await this.pool.connect();

        try {
            const query = `
                SELECT * FROM productRecords
                WHERE userid = $1;
            `;
            console.log("it's running right");
            const values = [userID];
            const res = await client.query(query, values);
            console.log(res);
            return res.rows;

        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        } finally {
            client.release(); // Release the client back to the pool
        }
    }

    // Function to delete a product record
    async deleteData(userID, productName) {
        const client = await this.pool.connect();

        try {
            const query = `
                DELETE FROM productRecords
                WHERE userid = $1 AND productname = $2;
            `;

            const values = [userID, productName, url];
            await client.query(query, values);

        } catch (error) {
            console.error('Error deleting data:', error);
        } finally {
            client.release(); // Release the client back to the pool
        }
    }

    async end() {
        await this.pool.end();
    }
}