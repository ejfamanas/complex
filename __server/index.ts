import * as dotenv from "dotenv";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import {Pool} from "pg";
import * as redis from "redis";
import {default as keys} from "./keys";

dotenv.config();
console.log("starting server...")

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgPassword,
    password: keys.pgPassword,
    port: parseInt(keys.pgPort),
});

pgClient
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((error) => console.log("Failed to create table", error));

// Redis Client setup
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: parseInt(keys.redisPort),
    retry_strategy: () => 1000,
});

// redis duplicate must be made because if one instance is used for subscription
// it is a stream and cannot be used for anything else
const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get("/", (req, res) => {
    res.send("Hi");
});

app.get("/values/all", async (req, res) => {
    const values = await pgClient.query("SELECT * from VALUES");
    // only send the rows back from the database
    res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
    // need to do it this way because there is no promise support in redis
    redisClient.hgetall("values", (err, values) => {
        res.send(values);
    });
});

app.post("/values", async (req, res) => {
    const index = req.body.value;
    if (parseInt(index) > 40) {
        return res.status(422).send("Index too high");
    }
    redisClient.hset("values", index, "Nothing yet!");
    redisPublisher.publish("insert", index);
    pgClient.query("INSERT INTO values(number) VALUES ($1)", [index]);

    res.send({working: true});
});

app.listen(5000, (err) => {
    console.log("listening");
});
