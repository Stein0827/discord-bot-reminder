import pg from 'pg';
import 'dotenv/config';


// TODO add enviroment var later
export class db {
    constructor() {
        this.client = new Client({
            user: '',
            host: 'localhost',
            port: 5432,
            database: 'discord_bot',
            password: '',
        });
    }

    async insertData(userID, productName, url, price, channelID) {
        try {
            await this.client.connect();

            const query = `
                INSERT INTO productRecords (userid, productname, link, price, channelID)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (userid, productname, link) DO NOTHING;
            `;

            const values = [userID, productName, url, price, channelID];
            console.log(await this.client.query(query, values));

        } catch (error) {
            console.error('Error inserting data:', error);
        } finally {
            await this.client.end();
        }
    }
}
const { Client } = pg;
const client = new Client({
    user: '',
    host: 'localhost',
    port: 5432,
    database: 'discord_bot',
    password: '',
});
await client.connect();

