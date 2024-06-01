import pg from 'pg';

const { Client } = pg;
const client = new Client({
    user: '',
    host: 'localhost',
    port: 5432,
    database: 'discord_bot',
    password: '',
});
await client.connect();