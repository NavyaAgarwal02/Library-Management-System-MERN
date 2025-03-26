import exp, { Request } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import morgan, { TokenIndexer } from "morgan";
import chalk from "chalk";
import dateFormat from "dateformat";
import {
    mainApp,
    commonApp,
    userApp,
    librarianApp
} from "./routes/index.js";
import { IncomingMessage, ServerResponse } from "http";

dotenv.config();

const app = exp();
const prisma = new PrismaClient();

app.use(exp.json());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        optionsSuccessStatus: 200
    })
);

const requestIds = new Set<string>();

const logFormat = (
    tokens: TokenIndexer,
    req: IncomingMessage,
    res: ServerResponse
) => {
    const typedReq = req as Request;
    if (
        process.env.MAX_REQUEST_IDS &&
        requestIds.size > Number(process.env.MAX_REQUEST_IDS)
    ) {
        requestIds.clear();
    }
    const requestId = typedReq.headers["x-request-id"];
    if (typeof requestId === "string" && requestIds.has(requestId)) {
        requestIds.delete(requestId);
        return null;
    }
    if (typeof requestId === "string") {
        requestIds.add(requestId);
    }
    const remoteAddr = typedReq.ip;
    const date = dateFormat(new Date(), "dd/mmmm/yyyy HH:MM:ss");
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const httpVersion = tokens["http-version"](req, res);
    const status: number = Number(tokens.status(req, res));
    const statusColor = (status: number) => {
        return status >= 500
            ? chalk.red
            : status >= 400
            ? chalk.yellow
            : status >= 300
            ? chalk.cyan
            : chalk.green;
    };
    return `${remoteAddr} - - ${chalk.blue("[" + date + "]")} "${statusColor(
        status
    )(method + " " + url + " HTTP/" + httpVersion)}" ${status} -`;
};

app.use(morgan(logFormat));

app.use("/api", mainApp);
app.use("/api/common", commonApp);
app.use("/api/user", userApp);
app.use("/api/librarian", librarianApp);

app.use((req, res, next) => {
    res.status(404).send({ msg: "404 route not found" });
});

async function createDefaultSection(): Promise<void> {
    try {
        let section = await prisma.section.findUnique({
            where: {
                slug: "miscellaneous"
            }
        });
        if (!section) {
            section = await prisma.section.create({
                data: {
                    title: "Miscellaneous",
                    slug: "miscellaneous",
                    description:
                        "This section contains books which don't belong to any section."
                }
            });
            console.log(
                "Miscellaneous section created for uncategorized books.\n"
            );
        } else {
            console.log("Miscellaneous section already exists.\n");
        }
    } catch (err) {
        console.log("Error creating miscellaneous section:", err, "\n");
    }
}

createDefaultSection();

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`\nHTTP Server on Port ${port}`);
});
