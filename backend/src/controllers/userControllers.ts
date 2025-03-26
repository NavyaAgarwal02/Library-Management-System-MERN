import {
    PrismaClient,
    User,
    Request as PrisRequest,
    Feedback
} from "@prisma/client";
import bcryptjs from "bcryptjs";
import { Request, Response, NextFunction } from "express-serve-static-core";
import {
    userValidator,
    requestValidator,
    feedbackValidator
} from "../validators/index.js";

const prisma = new PrismaClient();

// POST http://localhost:4000/api/user
async function createUser(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
        return res.status(400).send({
            message:
                "Name, Username, Email and Password should be there in the request."
        });
    }

    const data: Partial<User> = {
        name,
        username,
        email,
        password
    };
    const validationResult = userValidator.safeParse(data);
    if (!validationResult.success) {
        return res
            .status(400)
            .send({ message: validationResult.error.errors[0].message });
    }

    let user = await prisma.user.findUnique({
        where: { username }
    });
    if (user) {
        return res.status(400).send({ message: "Username already exists." });
    }

    user = await prisma.user.findUnique({
        where: { email }
    });
    if (user) {
        return res.status(400).send({ message: "Email already exists." });
    }

    const hashedPass = await bcryptjs.hash(password, 10);
    await prisma.user.create({
        data: {
            name,
            username,
            email,
            password: hashedPass
        }
    });

    return res.status(200).send({
        message: `User ${name} registered successfully. Please login.`
    });
}

// POST http://localhost:4000/api/user/request/:bookSlug
async function createRequest(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const { days } = req.body;
    if (!days) {
        return res.status(400).send({
            message: "Days should be there in the request."
        });
    }

    const data: Partial<PrisRequest> = { days };
    const validationResult = requestValidator.safeParse(data);
    if (!validationResult.success) {
        return res
            .status(400)
            .send({ message: validationResult.error.errors[0].message });
    }

    const book = await prisma.book.findUnique({
        where: { slug: req.params.bookSlug }
    });
    if (!book) {
        return res
            .status(404)
            .send({ message: "There is no book with that title." });
    }

    const user = await prisma.user.findUnique({
        where: { username: req.username },
        include: { issuedBooks: true, requests: true }
    });

    if (!user) {
        return res.status(500).send({ message: "Internal Server Error." });
    }

    let cou1 = 0;
    for (const issuedBook of user.issuedBooks) {
        if (issuedBook.status === "current") {
            if (issuedBook.bookSlug == req.params.bookSlug) {
                return res
                    .status(400)
                    .send({ message: "The book has already been issued." });
            } else {
                cou1++;
            }
        }
    }
    let cou2 = 0;
    for (const request of user.requests) {
        if (request.status === "pending") {
            if (request.bookSlug == req.params.bookSlug) {
                return res
                    .status(400)
                    .send({ message: "The book has already been requested." });
            } else {
                cou2++;
            }
        }
    }
    if (cou1 + cou2 > 5) {
        return res
            .status(400)
            .send({ message: "You can only borrow a maximum of 5 books." });
    }

    await prisma.request.create({
        data: {
            slug: `${req.params.bookSlug}~${req.username}`,
            user: { connect: { username: req.username } },
            days,
            book: { connect: { slug: req.params.bookSlug } }
        }
    });

    return res.status(200).send({
        message: `Book ${book.title} has been requested successfully.`
    });
}

// DELETE http://localhost:4000/api/user/request/:requestSlug
async function deleteRequest(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const request = await prisma.request.findUnique({
        where: { slug: req.params.requestSlug }
    });
    if (!request) {
        return res.status(404).send({ message: "There is no such request." });
    }

    if (request.username !== req.username) {
        return res
            .status(403)
            .send({ message: "Forbidden. You can't delete other's requests." });
    }

    await prisma.request.delete({ where: { slug: req.params.requestSlug } });

    return res.status(200).send({ message: "Request has been deleted." });
}

// GET http://localhost:4000/api/user/my-books
async function readMyBooks(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);
    await prisma.request.updateMany({
        where: {
            username: req.username,
            dateCreated: {
                lt: sevenDaysAgo
            },
            status: "pending"
        },
        data: {
            status: "rejected"
        }
    });

    const requests = await prisma.request.findMany({
        where: { username: req.username, status: "pending" }
    });

    const today = new Date();
    await prisma.issuedBook.updateMany({
        where: {
            username: req.username,
            toDate: {
                lt: today
            },
            status: "current"
        },
        data: {
            status: "returned",
            toDate: today
        }
    });

    const issuedBooks = await prisma.issuedBook.findMany({
        where: { username: req.username, status: "current" }
    });

    return res.status(200).send({ requests, issuedBooks });
}

// PUT http://localhost:4000/api/user/issued-book/:issuedBookSlug
async function updateIssuedBook(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const issuedBook = await prisma.issuedBook.findUnique({
        where: { slug: req.params.issuedBookSlug }
    });
    if (!issuedBook) {
        return res
            .status(400)
            .send({ message: "There is no such issued book." });
    }

    if (issuedBook.username !== req.username) {
        return res
            .status(403)
            .send({ message: "Forbidden. You can't return other's books." });
    }
    if (issuedBook.status === "returned") {
        return res
            .status(400)
            .send({ message: "The book has already been returned." });
    }

    await prisma.issuedBook.update({
        where: { slug: req.params.issuedBookSlug },
        data: { status: "returned", toDate: new Date() }
    });

    return res.status(200).send({ message: "The book has been returned." });
}

// POST http://localhost:4000/api/user/feedback/:bookSlug
async function createFeedback(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const book = await prisma.book.findUnique({
        where: { slug: req.params.bookSlug }
    });
    if (!book) {
        return res
            .status(404)
            .send({ message: "There is no book with that title." });
    }

    const { rating, content } = req.body;
    if (!rating || !content) {
        return res.status(400).send({
            message: "Rating and Content should be there in the request."
        });
    }

    const data: Partial<Feedback> = { rating, content };
    const validationResult = feedbackValidator.safeParse(data);
    if (!validationResult.success) {
        return res
            .status(400)
            .send({ message: validationResult.error.errors[0].message });
    }

    const issuedBook = await prisma.issuedBook.findUnique({
        where: {
            bookSlug_username: {
                bookSlug: req.params.bookSlug,
                username: req.username
            }
        }
    });
    if (!issuedBook) {
        return res
            .status(403)
            .send({ message: "You have not issued this book." });
    }

    let feedback = await prisma.feedback.findUnique({
        where: {
            bookSlug_username: {
                bookSlug: req.params.bookSlug,
                username: req.username
            }
        }
    });
    if (feedback) {
        return res.status(400).send({
            message:
                "You have already given feedback. Please edit the existing feedback."
        });
    }

    await prisma.feedback.create({
        data: {
            slug: `${req.params.bookSlug}~${req.username}`,
            user: { connect: { username: req.username } },
            book: { connect: { slug: req.params.bookSlug } },
            rating,
            content
        }
    });

    return res.status(200).send({ message: "Feedback created successfully." });
}

// PUT http://localhost:4000/api/user/feedback/:feedbackSlug
async function updateFeedback(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const feedback = await prisma.feedback.findUnique({
        where: { slug: req.params.feedbackSlug }
    });
    if (!feedback) {
        return res.status(400).send({
            message: "There is no such feedback."
        });
    }

    const { rating, content } = req.body;
    if (!rating && !content) {
        return res.status(400).send({
            message: "Rating or Content should be there in the request."
        });
    }

    let cou = 0;
    const data: Partial<Feedback> = {};
    if (rating && feedback.rating !== rating) {
        cou++;
        data.rating = rating;
    }
    if (content && feedback.content !== content) {
        cou++;
        data.content = content;
    }
    if (!cou) {
        return res.status(400).send({
            message: "Given fields are same as original."
        });
    }

    const validationResult = feedbackValidator.safeParse(data);
    if (!validationResult.success) {
        return res
            .status(400)
            .send({ message: validationResult.error.errors[0].message });
    }

    await prisma.feedback.update({
        where: { slug: req.params.feedbackSlug },
        data
    });

    return res.status(200).send({ message: "Feedback updated successfully." });
}

export {
    createUser,
    createRequest,
    deleteRequest,
    readMyBooks,
    updateIssuedBook,
    createFeedback,
    updateFeedback
};
