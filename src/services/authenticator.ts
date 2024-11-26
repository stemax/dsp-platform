import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

/**
 * Retrieves the JWT secret from the environment configuration.
 * If the secret is not defined in the environment, it defaults to "secret".
 *
 * @returns {string} The JWT secret.
 */
export function getSecret(): string {
    const configuration = dotenv.config({path: '.env'})?.parsed;
    return configuration?.JWT_SECRET || "secret"
}


/**
 * Retrieves the JWT expiration time from the environment configuration.
 * If the expiration time is not defined in the environment, it defaults to "1h".
 *
 * @returns {string} The JWT expiration time.
 */
function getExpiresIn(): string {
    const configuration = dotenv.config({path: '.env'})?.parsed;
    return configuration?.JWT_EXPIRES_IN || "1h"
}

/**
 * Middleware for authenticating JWT tokens.
 *
 * @param req The request object.
 * @param res The response object.
 * @param next The next middleware in the stack.
 *
 * This middleware checks for a JWT token in the `Authorization` header, and verifies
 * it using the `getSecret` function. If the token is invalid or missing, it sends a
 * 401 Unauthorized response. If the token is valid, it sets `req.user` to the decoded
 * user object and calls `next` to continue the middleware stack.
 */
export function authenticateToken(req: { headers: { [x: string]: any; }; user: any; }, res: {
    sendStatus: (arg0: number) => any;
}, next: () => void) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, getSecret(), (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}


/**
 * Generates a JWT token for the given user ID and role.
 *
 * @param userId The user ID to include in the token.
 * @param role The user role to include in the token.
 * @returns {string} The generated JWT token.
 *
 * This function uses the `getSecret` function to retrieve the JWT secret from the
 * environment, and the `getExpiresIn` function to retrieve the JWT expiration time.
 * It then signs the token with the secret and sets the expiration time.
 */
export function generateToken(userId: string): string {
    return jwt.sign({ id: userId }, getSecret(), { expiresIn: getExpiresIn() });
}