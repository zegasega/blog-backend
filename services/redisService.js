const Redis = require('ioredis');

class RedisService {
    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST,  
            port: process.env.REDIS_PORT,         
            password: process.env.REDIS_PASSWORD, 
        });

        this.maxAttempts = process.env.MAX_ATTEMPTS || 3; 
        this.ttlSeconds = process.env.TTL_SECONDS || 15 * 60;  
    }

    getKey(key) {
        return `wrong_pw:${key}`;
    }

    async incrementWrongPassword(key) {
        const redisKey = this.getKey(key);
        const current = await this.redis.incr(redisKey);

        if (current === 1) {
            await this.redis.expire(redisKey, this.ttlSeconds);
        }

        return current;
    }

    async getWrongPasswordCount(key) {
        const redisKey = this.getKey(key);
        const count = await this.redis.get(redisKey);
        return parseInt(count || '0', 10);
    }

    async clearWrongPasswordAttempts(key) {
        const redisKey = this.getKey(key);
        await this.redis.del(redisKey);
    }

    async isBlocked(key) {
        const count = await this.getWrongPasswordCount(key);
        return count >= this.maxAttempts;
    }
}

module.exports = new RedisService();
