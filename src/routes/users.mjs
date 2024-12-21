import { Router } from "express";
import { query, validationResult, body, matchedData, checkSchema, check } from "express-validator"
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId, loggingMiddleware } from "../utils/middlewares.mjs";
const router = Router();


router.get("/api/users", query("filter").isString().notEmpty().withMessage("Must not be empty").isLength({min: 3, max: 10}).withMessage("Must be 3-10 characters"), (request, response) => {
    console.log("user session: ", request.session)
    console.log(request.session.id)
    request.sessionStore.get(request.session.id, (error, sessionData) => {
        if(error) {
            console.log(error);
            throw error;
        }
        console.log(sessionData)
    }) //pass in callback function, session`id

    console.log(request["express-validator#contexts"])
    const result = validationResult(request) //error handling of query filter
    console.log(result)
    const { query: { filter, value } } = request;
    
    if(filter && value) return response.send(
        mockUsers.filter((user) => user[filter].includes(value))
    )
    return response.send(mockUsers)
    
}) 

router.get("/api/users/:id", resolveIndexByUserId, (request, response)=> {
    const {findUserIndex} = request;
    const findUser = mockUsers[findUserIndex]
    if(!findUser) return response.sendStatus(404);
    return response.send(findUser)
})

router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const {body, findUserIndex} = request
    
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body}
    return response.sendStatus(200)

    
})

router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request
    
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body}
    return response.sendStatus(200)
})

router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { findUserIndex} = request
  
    mockUsers.splice(findUserIndex, 1) // what splice does
    return response.sendStatus(200)
})

router.post("/api/users", 
    // body("username")
    // .notEmpty()
    // .withMessage("Username can not be empty!")
    // .isLength({ min: 5, max: 32})
    // .withMessage("Username must be 5-32 characters length!")
    // .isString()
    // .withMessage("Username must be a string!"),
    // body("displayname")
    // .notEmpty(),

    checkSchema(createUserValidationSchema),
    
    (request, response) => {
        const result = validationResult(request)
        console.log(result);

        if(!result.isEmpty()){
            return response.status(400).send({ errors: result.array() })
        }

        const data = matchedData(request)
        console.log(data) // preferable to use matchedData instaed of request.body, so we exchange body with data
        // console.log(request.body);
    //    const { body } = request;

    const newUser = {
        id: mockUsers[mockUsers.length - 1].id + 1,
        ...data
    }
    if(!data) return response.status(400).send({msg: "Request body is null!"})

    mockUsers.push(newUser)
    return response.status(201).send(newUser)
})

export default router;