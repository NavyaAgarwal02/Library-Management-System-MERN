import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { verifyToken } from "../middlewares/index.js";
import {
    createUser,
    createRequest,
    deleteRequest,
    readMyBooks,
    updateIssuedBook,
    createFeedback,
    updateFeedback
} from "../controllers/userControllers.js";

const userApp = Router();

userApp.use(verifyToken("user"));

userApp.post("", expressAsyncHandler(createUser));

userApp.post("/request/:bookSlug", expressAsyncHandler(createRequest));

userApp.delete("/request/:requestSlug", expressAsyncHandler(deleteRequest));

userApp.get("/my-books", expressAsyncHandler(readMyBooks));

userApp.put("/issued-book/:issueSlug", expressAsyncHandler(updateIssuedBook));

userApp.post("/feedback/:bookSlug", expressAsyncHandler(createFeedback));

userApp.put("/feedback/:feedbackSlug", expressAsyncHandler(updateFeedback));

export default userApp;
