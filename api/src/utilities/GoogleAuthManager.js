const { JWT } = require('google-auth-library');
const { isEqual } = require('lodash');
const config = require('../config');
class AuthManager {
    constructor() {
        this.auth = null;
        this.expiryTime = null;
        this.previous_token_services = ['MEET_READ', 'CALENDAR_READ'];
    }

    async getAuthToken(services = ["MEET_READ"]) {
        // If we have a valid token, return it
        if (this.auth && isEqual(services.sort(), this.previous_token_services.sort()) && this.expiryTime && this.expiryTime > Date.now()) {
            return { data: this.auth, status: true };
        }

        console.log("RUNNING GOOLGE AUTH API")
        // Otherwise, create a new token
        const SCOPES = {
            MEET_READ: 'https://www.googleapis.com/auth/meetings.space.readonly',
            MEET_WRITE: 'https://www.googleapis.com/auth/meetings.space.created',
            CALENDAR_READ: 'https://www.googleapis.com/auth/calendar.readonly',
            CALENDAR_WRITE: 'https://www.googleapis.com/auth/calendar.events'
        };

        let selectedScopes = services.map(service => SCOPES[service]);

        try {
            this.auth = new JWT({
                email: "mentblue@mentblue.iam.gserviceaccount.com",
                key: require(config.googleCreds.serviceAccountCreds).private_key,
                scopes: selectedScopes,
                subject: 'asad@arramton.com',
            });

            this.expiryTime = Date.now() + (3600000 - 6000); // 1 hour (approx) in milliseconds
            this.previous_token_services = services;
            return { data: this.auth, status: true };
        } catch (error) {
            throw new Error(error);
        }
    }
}

// Create a single instance of AuthManager
const authManager = new AuthManager();

module.exports = authManager;