import { PrismaClient, User } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express-serve-static-core";
import { userValidator, searchValidator } from "../validators/index.js";

const prisma = new PrismaClient();

dotenv.config();

// POST http://localhost:4000/api/login
async function loginUser(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send({
            message: "Username and Password should be present in the request."
        });
    }

    const data: Partial<User> = { username, password };
    const validationResult = userValidator.safeParse(data);
    if (!validationResult.success) {
        return res
            .status(400)
            .send({ message: validationResult.error.errors[0].message });
    }

    const user: Partial<User> | null = await prisma.user.findUnique({
        where: { username }
    });
    const flag = await bcryptjs.compare(
        password,
        (user && user.password) || ""
    );
    if (!user || (user && !flag)) {
        return res
            .status(400)
            .send({ message: "Invalid Username or Password." });
    }

    const token = jwt.sign({ username }, process.env.SECRET_KEY as string, {
        expiresIn: process.env.JWT_EXPIRY
    });

    delete user.id;
    delete user.password;

    return res.status(200).send({
        message: "Login Successful.",
        token,
        user
    });
}

// GET http://localhost:4000/api/sections
async function readSections(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const sections = await prisma.section.findMany({
        orderBy: { dateModified: "desc" }
    });

    return res.status(200).send(sections);
}

// GET http://localhost:4000/api/section/:sectionSlug
async function readSection(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const section = await prisma.section.findUnique({
        where: { slug: req.params.sectionSlug },
        include: {
            books: {
                orderBy: { dateModified: "desc" }
            }
        }
    });

    if (!section) {
        return res
            .status(404)
            .send({ message: "There is no section with that title." });
    }

    return res.status(200).send(section);
}

// GET http://localhost:4000/api/books
async function readBooks(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const sections = await prisma.section.findMany({
        orderBy: { dateModified: "desc" },
        include: {
            books: {
                orderBy: { dateModified: "desc" }
            }
        }
    });
    return res.status(200).send(sections);
}

// GET http://localhost:4000/api/book/:bookSlug
async function readBook(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const book = await prisma.book.findUnique({
        where: { slug: req.params.bookSlug },
        include: { section: true, feedbacks: true, issuedBooks: true }
    });

    if (!book) {
        return res
            .status(404)
            .send({ message: "There is no book with that id" });
    }

    return res.send(book);
}

// POST http://localhost:4000/api/search
async function search(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const { query } = req.body;
    if (!query) {
        return res.status(400).send({ message: "Search Term is required" });
    }

    const data = { query };
    if (!searchValidator.safeParse(data).success) {
        return res
            .status(400)
            .send({ message: "Data should follow proper format" });
    }

    const sections = await prisma.section.findMany({
        where: { title: { contains: query, mode: "insensitive" } }
    });
    const books = await prisma.book.findMany({
        where: { title: { contains: query, mode: "insensitive" } }
    });
    const authors = await prisma.book.findMany({
        where: { author: { contains: query, mode: "insensitive" } }
    });

    return res.status(200).send({ sections, books, authors });
}

export { loginUser, readSections, readSection, readBooks, readBook, search };
