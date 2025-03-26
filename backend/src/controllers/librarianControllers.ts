import { PrismaClient, Section, Book } from "@prisma/client";
import { NextFunction, Request, Response } from "express-serve-static-core";
import { sectionValidator, bookValidator } from "../validators/index.js";
import { customSlugify } from "../utils/index.js";

const prisma = new PrismaClient();

// POST http://localhost:4000/api/librarian/section
async function createSection(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const { title, description } = req.body;
    if (!title || !description) {
        res.status(400).send({
            message: "Title and Description are required."
        });
    }

    const data: Partial<Section> = { title, description };
    const validationResult = sectionValidator.safeParse(data);
    if (!validationResult.success) {
        return res
            .status(400)
            .send({ message: validationResult.error.errors[0].message });
    }

    if (title === "Add Section") {
        return res
            .status(400)
            .send({ message: "You can't create a section with this title." });
    }

    const section = await prisma.section.findUnique({
        where: { slug: customSlugify(title) }
    });
    if (section) {
        return res
            .status(400)
            .send({ message: "Section Title already exists." });
    }

    await prisma.section.create({
        data: {
            title,
            description,
            slug: customSlugify(title)
        }
    });

    return res
        .status(200)
        .send({ message: `Section ${title} created successfully.` });
}

// PUT http://localhost:4000/api/librarian/section/:sectionSlug
async function updateSection(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const section = await prisma.section.findUnique({
        where: { slug: req.params.sectionSlug }
    });
    if (!section) {
        return res
            .status(404)
            .send({ message: "There is no section with that title." });
    }

    const { title, description } = req.body;
    if (!title && !description) {
        return res
            .status(400)
            .send({ message: "Title or Description is required." });
    }

    let cou = 0;
    const data: Partial<Section> = {};
    if (title && section.slug !== customSlugify(title)) {
        cou++;
        if (title === "Add Section") {
            return res.status(400).send({
                message: "You can't create a section with this title."
            });
        }
        const sectionExists = await prisma.section.findUnique({
            where: { slug: customSlugify(title) }
        });
        if (sectionExists) {
            return res
                .status(400)
                .send({ message: "Section Title already exists." });
        }
        data.title = title;
        data.slug = customSlugify(title);
    }
    if (description && section.description !== description) {
        cou++;
        data.description = description;
    }
    if (!cou) {
        return res.status(400).send({
            message: "Given fields are same as original."
        });
    }

    const validationResult = sectionValidator.safeParse(data);
    if (!validationResult.success) {
        return res
            .status(400)
            .send({ message: validationResult.error.errors[0].message });
    }

    await prisma.section.update({
        where: { slug: req.params.sectionSlug },
        data
    });

    return res.status(200).send({
        message: `Section ${section.title} has been updated.`
    });
}

// DELETE http://localhost:4000/api/librarian/section/:sectionSlug
async function deleteSection(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const section = await prisma.section.findUnique({
        where: { slug: req.params.sectionSlug },
        include: { books: true }
    });
    if (!section) {
        return res
            .status(404)
            .send({ message: "There is no section with that title." });
    }

    if (req.params.sectionSlug === "miscellaneous") {
        return res.status(403).send({
            message: "Forbidden. You can't delete miscellaneous section."
        });
    }

    const miscellaneousSection = await prisma.section.findUnique({
        where: { slug: "miscellaneous" }
    });
    for (const book of section.books) {
        await prisma.book.update({
            where: { slug: book.slug },
            data: {
                section: { connect: { slug: miscellaneousSection?.slug } }
            }
        });
    }

    await prisma.section.delete({ where: { slug: req.params.sectionSlug } });

    return res.status(200).send({
        message: `Section ${section.title} has been deleted.`
    });
}

// POST http://localhost:4000/api/librarian/book/:sectionSlug
async function createBook(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const section = await prisma.section.findUnique({
        where: { slug: req.params.sectionSlug }
    });
    if (!section) {
        return res
            .status(404)
            .send({ message: "There is no section with that title." });
    }

    const { title, author, description } = req.body;
    if (!title || !author || !description) {
        return res
            .status(400)
            .send({ message: "Title, Author and Description are required." });
    }

    const data: Partial<Book> = { title, author, description };
    const validationResult = bookValidator.safeParse(data);
    if (!validationResult.success) {
        return res
            .status(400)
            .send({ message: validationResult.error.errors[0].message });
    }

    if (title === "Add Book") {
        return res
            .status(400)
            .send({ message: "You can't create a book with this title." });
    }

    const book = await prisma.book.findUnique({
        where: { slug: customSlugify(title) }
    });
    if (book) {
        return res.status(400).send({ message: "Book Title already exists." });
    }

    await prisma.book.create({
        data: {
            title,
            slug: customSlugify(title),
            author,
            description,
            section: {
                connect: { slug: req.params.sectionSlug }
            }
        }
    });

    return res
        .status(200)
        .send({ message: `Book ${title} created successfully.` });
}

// PUT http://localhost:4000/api/librarian/book/:bookSlug
async function updateBook(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    let book = await prisma.book.findUnique({
        where: { slug: req.params.bookSlug },
        include: { section: true }
    });
    if (!book) {
        return res
            .status(404)
            .send({ message: "There is no book with that title." });
    }

    const { title, author, description, sectionSlug } = req.body;
    if (!title && !author && !description && !sectionSlug) {
        return res
            .status(400)
            .send({ message: "At least one field is required to update." });
    }

    let cou = 0;
    const data: Partial<Book> = {};
    if (title && book.title !== title) {
        cou++;
        if (title === "Add Book") {
            return res
                .status(400)
                .send({ message: "You can't create a book with this title." });
        }
        const bookExists = await prisma.book.findUnique({
            where: { slug: customSlugify(title) }
        });
        if (bookExists) {
            res.status(400).send({
                message: "Book Title already exists."
            });
        }
        data.title = title;
        data.slug = customSlugify(title);
    }
    if (author && book.author !== author) {
        cou++;
        data.author = author;
    }
    if (description && book.description !== description) {
        cou++;
        data.description = description;
    }
    if (!cou) {
        return res.status(400).send({
            message: "Given fields are same as original."
        });
    }

    const validationResult = bookValidator.safeParse(data);
    if (!validationResult.success) {
        return res
            .status(400)
            .send({ message: validationResult.error.errors[0].message });
    }

    if (sectionSlug && sectionSlug !== book.sectionSlug) {
        const section = await prisma.section.findUnique({
            where: { id: sectionSlug }
        });
        if (!section) {
            return res
                .status(404)
                .send({ message: "There is no section with that title." });
        }
        await prisma.book.update({
            where: { slug: req.params.bookSlug },
            data: {
                section: { connect: { slug: sectionSlug } }
            }
        });
    }

    await prisma.book.update({
        where: { slug: req.params.bookSlug },
        data
    });

    return res.status(200).send({
        message: `Book ${book.title} has been updated.`
    });
}

// DELETE http://localhost:4000/api/librarian/book/:bookSlug
async function deleteBook(
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
            .send({ message: "There is no book with that id" });
    }

    await prisma.book.delete({ where: { slug: req.params.bookSlug } });

    return res.status(200).send({
        message: `Book ${book.title} has been deleted.`
    });
}

// GET http://localhost:4000/api/librarian/requests
async function readRequests(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);
    await prisma.request.updateMany({
        where: {
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
        where: { status: "pending" }
    });
    const today = new Date();
    await prisma.issuedBook.updateMany({
        where: {
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
        where: { status: "current" }
    });
    return res.status(200).send({ requests, issuedBooks });
}

// PUT http://localhost:4000/api/librarian/request/:requestSlug
async function updateRequest(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const { status } = req.body;
    if (!status) {
        return res.status(400).send({
            message: "Status should be there in the request."
        });
    }

    if (status !== "accepted" && status !== "rejected") {
        return res
            .status(400)
            .send({ message: "Status can only be rejected or accepted." });
    }

    const request = await prisma.request.findUnique({
        where: {
            slug: req.params.requestSlug
        }
    });
    if (!request) {
        return res.status(404).send({ message: "Request not found." });
    }

    if (request.status !== "pending") {
        return res
            .status(400)
            .send({ message: "Only pending request's status can be updated." });
    }

    await prisma.request.update({
        where: { slug: req.params.requestSlug },
        data: {
            status
        }
    });

    if (status === "accepted") {
        const currentDate = new Date();
        const sevenDaysLater = new Date(currentDate);
        sevenDaysLater.setDate(currentDate.getDate() + request.days);
        await prisma.issuedBook.create({
            data: {
                slug: `${request.bookSlug}~${request.username}`,
                book: { connect: { slug: request.bookSlug } },
                issuer: { connect: { username: req.username } },
                user: { connect: { username: request.username } },
                toDate: sevenDaysLater
            }
        });
    }

    return res
        .status(200)
        .send({ message: "Request status updated successfully." });
}

// PUT http://localhost:4000/api/librarian/issued-book/:issuedBookSlug
async function updateIssuedBook(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const issuedBook = await prisma.issuedBook.findUnique({
        where: { slug: req.params.issuedBookSlug }
    });
    if (!issuedBook) {
        return res.status(404).send({ message: "Issued Book not found." });
    }

    if (issuedBook.status !== "current") {
        return res.status(400).send({
            message: "Only current issued book's status can be updated."
        });
    }

    await prisma.issuedBook.update({
        where: { slug: req.params.issuedBookSlug },
        data: {
            status: "returned",
            toDate: new Date()
        }
    });

    return res
        .status(200)
        .send({ message: "Issued Book status updated successfully" });
}

export {
    createSection,
    updateSection,
    deleteSection,
    createBook,
    updateBook,
    deleteBook,
    readRequests,
    updateRequest,
    updateIssuedBook
};
