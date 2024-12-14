import { Router } from "express";
import usersRouter from "./users.mjs";
import productsRouter from "./products.mjs";
import { loggingMiddleware } from "../utils/middlewares.mjs";


const router = Router();

app.use(loggingMiddleware, (request, response, next) => {
    console.log("Finished Loading...")
    next();
}) //it must be before endpoints since order matters

router.use(usersRouter)
router.use(productsRouter)

export default router;