import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import {
    readUser,
    updateUser,
    deleteUser,
    readUserStatistics
} from "../controllers/commonControllers.js";
import verifyToken from "../middlewares/verifyToken.js";

const commonApp = Router();

commonApp.use(verifyToken("both"));

commonApp
    .route("")
    .get(expressAsyncHandler(readUser))
    .put(expressAsyncHandler(updateUser))
    .delete(expressAsyncHandler(deleteUser));

commonApp.get("/stats", expressAsyncHandler(readUserStatistics));

export default commonApp;
