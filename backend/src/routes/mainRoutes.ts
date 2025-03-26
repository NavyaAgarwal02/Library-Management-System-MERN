import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import {
    loginUser,
    readSections,
    readSection,
    readBooks,
    readBook,
    search
} from "../controllers/mainControllers.js";

const mainApp = Router();

mainApp.post("/login", expressAsyncHandler(loginUser));

mainApp.get("/sections", expressAsyncHandler(readSections));

mainApp.get("/section/:sectionSlug", expressAsyncHandler(readSection));

mainApp.get("/books", expressAsyncHandler(readBooks));

mainApp.get("/book/:bookSlug", expressAsyncHandler(readBook));

mainApp.post("/search", expressAsyncHandler(search));

export default mainApp;
