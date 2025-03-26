import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { verifyToken } from "../middlewares/index.js";
import {
    createSection,
    updateSection,
    deleteSection,
    createBook,
    updateBook,
    deleteBook,
    readRequests,
    updateRequest,
    updateIssuedBook
} from "../controllers/librarianControllers.js";

const librarianApp = Router();

librarianApp.use(verifyToken("librarian"));

librarianApp.post("/section", expressAsyncHandler(createSection));

librarianApp
    .route("/section/:sectionSlug")
    .put(expressAsyncHandler(updateSection))
    .delete(expressAsyncHandler(deleteSection));

librarianApp.post("/book/:sectionSlug", expressAsyncHandler(createBook));

librarianApp
    .route("/book/:bookSlug")
    .put(expressAsyncHandler(updateBook))
    .delete(expressAsyncHandler(deleteBook));

librarianApp.get("/requests", expressAsyncHandler(readRequests));

librarianApp.put("/request/:requestSlug", expressAsyncHandler(updateRequest));

librarianApp.put(
    "/issued-book/:issuedBookSlug",
    expressAsyncHandler(updateIssuedBook)
);

export default librarianApp;
