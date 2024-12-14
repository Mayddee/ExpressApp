import { Router } from "express";

const router = Router();
router.get("/api/products", (req, res) => {
    res.send([{id: 123, name: "Chicken breast", price: 323.32}])
})

export default Router;