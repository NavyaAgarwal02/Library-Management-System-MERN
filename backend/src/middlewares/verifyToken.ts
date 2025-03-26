import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import {
    Request,
    Response,
    NextFunction,
    RequestHandler
} from "express-serve-static-core";

dotenv.config();
const prisma = new PrismaClient();

interface DecodedToken {
    username: string;
}

function verifyToken(role: "librarian" | "user" | "both"): RequestHandler {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<any> => {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res
                .status(401)
                .json({ message: "Unauthorized Access. Please Login." });
        }

        const token = authorizationHeader.split(" ")[1];

        console.log(authorizationHeader);
        console.log(token);
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized Access. Please Login." });
        }

        try {
            const decodedToken = jwt.verify(
                token,
                process.env.SECRET_KEY as string
            ) as DecodedToken;
            const { username } = decodedToken;

            const user = await prisma.user.findUnique({
                where: { username }
            });

            if (!user) {
                return res.status(400).json({ error: "Bad Request" });
            }

            if (role !== "both" && user.role !== role) {
                return res.status(403).json({ error: "Forbidden" });
            }

            req.username = user.username;
            req.role = user.role;
            next();
        } catch (err) {
            if (err instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({ message: "Invalid Token" });
            }
            next(err);
        }
    };
}

export default verifyToken;
