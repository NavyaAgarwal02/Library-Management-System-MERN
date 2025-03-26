import { PrismaClient, User } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { Request, Response, NextFunction } from "express-serve-static-core";
import { userValidator } from "../validators/index.js";

const prisma = new PrismaClient();

// GET http://localhost:4000/api/common
async function readUser(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const user: Partial<User> | null = await prisma.user.findUnique({
        where: { username: req.username }
    });

    if (!user) {
        return res
            .status(500)
            .send({ message: "Internal Server Error. Please try again." });
    }

    delete user.id;
    delete user.password;

    return res.status(200).send(user);
}

// PUT http://localhost:4000/api/common
async function updateUser(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    const { name, username, email, password, oldPassword, newPassword } =
        req.body;
    if ((newPassword && !oldPassword) || (!newPassword && oldPassword)) {
        return res.status(400).send({
            message: "Old Password should be there in the request."
        });
    }

    const validationResult1 = userValidator.safeParse({
        password: oldPassword
    });
    const validationResult2 = userValidator.safeParse({
        password: newPassword
    });
    if (newPassword && oldPassword) {
        if (!validationResult1.success || !validationResult2.success) {
            return res.status(400).send({
                message: `${validationResult1.error?.errors[0].message} ${validationResult2.error?.errors[0].message}`
            });
        }
        const user: Partial<User> | null = await prisma.user.findUnique({
            where: { username: req.username }
        });
        if (!user) {
            res.status(500).send({
                message: "Internal Server Error. Please try again."
            });
        }
        if (user) {
            const flag = await bcryptjs.compare(
                oldPassword,
                user.password || ""
            );
            if (!flag) {
                return res
                    .status(400)
                    .send({ message: "Old Password is incorrect." });
            }
        }

        if (oldPassword === newPassword) {
            return res
                .status(400)
                .send({ message: "New Password is same as Old Password." });
        }
        const hashedPass = await bcryptjs.hash(newPassword, 10);
        await prisma.user.update({
            where: { username: req.username },
            data: {
                password: hashedPass
            }
        });
        return res
            .status(200)
            .send({ message: "Password updated successfully." });
    }

    if ((!name && !username && !email) || !password) {
        return res.status(400).send({
            message:
                "Name or Username or Email and Password should be there in the request."
        });
    }

    const data: Partial<User> = {};
    if (name) {
        data.name = name;
    }
    if (username) {
        data.username = username;
    }
    if (email) {
        data.email = email;
    }
    data.password = password;
    const validationResult = userValidator.safeParse(data);
    if (!validationResult.success) {
        return res
            .status(400)
            .send({ message: validationResult.error.errors[0].message });
    }

    const user: Partial<User> | null = await prisma.user.findUnique({
        where: { username: req.username }
    });
    if (!user) {
        res.status(500).send({
            message: "Internal Server Error. Please try again."
        });
    }
    if (user) {
        const flag = await bcryptjs.compare(oldPassword, user.password || "");
        if (!flag) {
            return res.status(400).send({ message: "Password is incorrect." });
        }
    } else {
        res.status(500).send({ message: "Internal Server Error." });
    }

    let cou = 0;

    if (name && user && name !== user.name) {
        cou++;
    }

    if (username && user && user.username !== username) {
        cou++;
        let userExists = await prisma.user.findUnique({
            where: { username }
        });
        if (userExists) {
            return res
                .status(400)
                .send({ message: "Username already exists." });
        }
    }
    if (email && user && user.email !== email) {
        cou++;
        let userExists = await prisma.user.findUnique({
            where: { email }
        });
        if (userExists) {
            return res.status(400).send({ message: "Email already exists." });
        }
    }

    if (!cou) {
        return res
            .status(400)
            .send({ message: "Given fields are same as original." });
    }

    delete data.password;

    await prisma.user.update({
        where: { username: req.username },
        data
    });

    return res.status(200).send({ message: "User updated successfully" });
}

// DELETE http://localhost:4000/api/common
async function deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    await prisma.user.delete({
        where: {
            username: req.username
        }
    });

    return res.status(200).send({ message: "The user has been deleted" });
}

// GET http://localhost:4000/api/common/stats
async function readUserStatistics(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<any> {
    let issuedBooks: any;
    if (req.role === "librarian") {
        issuedBooks = await prisma.issuedBook.findMany({
            where: { issuedByUsername: req.username },
            include: { book: { include: { section: true } } }
        });
    } else {
        issuedBooks = await prisma.issuedBook.findMany({
            where: { username: req.username },
            include: { book: { include: { section: true } } }
        });
    }

    const dict = new Map<string, number>();
    for (const issuedBook of issuedBooks) {
        dict.set(
            issuedBook.book.section.title,
            (dict.get(issuedBook.book.section.title) || 0) + 1
        );
    }

    const sectionsArray: { title: string; count: number }[] = Object.entries(
        dict
    ).map(([title, count]) => ({
        title,
        count
    }));
    sectionsArray.sort((a, b) => b.count - a.count);

    let combinedSections;
    if (sectionsArray.length > 5) {
        const topFourSections = sectionsArray.slice(0, 4);
        const restSections = sectionsArray.slice(4);
        const restCombined = restSections.reduce(
            (acc, cur) => {
                acc.count += cur.count;
                return acc;
            },
            { title: "Others", count: 0 }
        );
        combinedSections = [...topFourSections, restCombined];
    } else {
        combinedSections = sectionsArray;
    }

    return res.status(200).send(combinedSections);
}

export { readUser, updateUser, deleteUser, readUserStatistics };
