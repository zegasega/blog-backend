const Redis = require('ioredis');

class RedisService {
    constructor() {
        this.redis = new Redis({
            host: 'redis.railway.internal',  
            port: 6379,         
            password: 'cCWTxxNlNBIplqDrKmCXFxwdVEwFLRBV' 
        });

        this.maxAttempts = 3; // max 3 attempt
        this.ttlSeconds = 900;  // 15 min block
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
