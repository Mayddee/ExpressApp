import { Router } from "express";

const router = Router();

router.get("/api/products", (request, response) => {
    // console.log(request.cookies)
    console.log(request.headers.cookie)
    console.log(request.cookies) //parsed cookies 
    console.log(request.signedCookies) //parsed scookies 

    if(request.signedCookies.hello && request.signedCookies.hello === "world"){
    // if(request.cookies.hello && request.cookies.hello === "world"){
        return response.send([{id: 1, name: "Chicken breast", price: 323.32}])
    }
    return response.status(403).send({msg: "Sorry! You must have correct cookie!"})

})

export default router;