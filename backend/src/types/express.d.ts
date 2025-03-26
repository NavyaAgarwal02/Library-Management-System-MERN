import 'express-serve-static-core';

declare module 'express-serve-static-core' {
    export interface Request {
        ip: string;
        username: string;
        role: "librarian" | "user";
    }
}