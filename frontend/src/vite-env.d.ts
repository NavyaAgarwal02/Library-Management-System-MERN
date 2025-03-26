/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_TIMEOUT: number;
    readonly VITE_IMAGE_MAX_SIZE: number;
    readonly VITE_PDF_MAX_SIZE: number;
    readonly VITE_NODE_ENV: string;
}

interface ImportMeta
{
    readonly env: ImportMetaEnv;
}

declare global {
    interface User {
        id: string;
        name: string;
        username: string;
        email: string;
        password: string;
        profilePicture: string;
        role: "user" | "librarian";
        requests: Request[];
        feedbacks: Feedback[];
        issuedBooks: IssuedBook[];
        issuedByBooks: IssuedBook[];
    }

    interface Section {
        id: string;
        title: string;
        slug: string;
        dateModified: Date;
        picture: string;
        description: string;
        books: Book[];
    }

    interface Book {
        id: string;
        title: string;
        slug: string;
        author: string;
        dateModified: Date;
        picture: string;
        description: string;
        pdfFile: string;
        sectionSlug: string;
        section: Section;
        issuedBooks: IssuedBook[];
        feedbacks: Feedback[];
        requests: Request[];
    }

    interface Request {
        id: string;
        slug: string;
        dateCreated: Date;
        days: number;
        status: "pending" | "accepted" | "rejected";
        bookSlug: string;
        book: Book;
        username: string;
        user: User;
    }

    interface IssuedBook {
        id: string;
        slug: string;
        fromDate: Date;
        toDate: Date;
        status: "current" | "returned";
        bookSlug: string;
        book: Book;
        issuedByUsername: string;
        issuer: User;
        username: string;
        user: User;
    }

    interface Feedback {
        id: string;
        slug: string;
        dateModified: Date;
        rating: number;
        content: string;
        bookSlug: string;
        book: Book;
        username: string;
        user: User;
    }

    interface Props {
        to: "" | "librarian" | "user";
    }

    interface RootState {
        user: UserState;
    }
}

export {};