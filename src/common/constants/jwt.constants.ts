export const JWT_CONSTANTS = {
    SECRET: process.env.JWT_SECRET || 'secretKey',
    EXPIRATION: '60m',
};
