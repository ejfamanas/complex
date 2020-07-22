import * as redis from "redis";

// stated this way because of initialization hack
const keys = require('./keys');

console.log("starting worker...")
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: parseInt(keys.redisPort),
    retry_strategy: () => 1000,
});

const sub = redisClient.duplicate();

function fib(index: number): number {
    return index < 2 ? 1 : fib(index - 1) + fib(index - 2);
}

sub.on("message", (channel: string, message: string) => {
    redisClient.hset("values", message, fib(parseInt(message)).toString());
})
// this will probably break
sub.subscribe("insert");

