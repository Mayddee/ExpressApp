import express from "express";
import usersRouter from "./routes/users.mjs";
import { resolveIndexByUserId, loggingMiddleware } from "./utils/middlewares.mjs";

import { mockUsers } from "./utils/constants.mjs";
const app = express() //reference

app.use(express.json())
app.use(usersRouter)




app.use(loggingMiddleware, (request, response, next) => {
    console.log("Finished Loading...")
    next()
}) //it must be before endpoints since order matters

const PORT = process.env.PORT || 3010 //referencing a global object process


app.listen(PORT, () => { //post-processing operation after server starts up
    console.log(`Running on Port ${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use.`);
    }
}); //for listening to a port for incoming request


app.get("/", (request, response, next) => {
    console.log("Base URL 1")
    next()
}, 
(request, response, next) => {
    console.log("Base URL 2")
    next()
}, 
(request, response) => {
    // response.send({msg: "Hello!"})
    response.status(201).send({msg: "Hello!"})
});

// app.get("/api/users", query("filter").isString().notEmpty().withMessage("Must not be empty").isLength({min: 3, max: 10}).withMessage("Must be 3-10 characters"), (request, response) => {
//     console.log(request["express-validator#contexts"])
// const result = validationResult(request) //error handling of query filter
//     console.log(result)
//     const { query: { filter, value } } = request;
    
//     if(filter && value) return response.send(
//         mockUsers.filter((user) => user[filter].includes(value))
//     )
//     return response.send(mockUsers)
    
// })

app.get("/api/products", (req, res) => {
    res.send([{id: 123, name: "Chicken breast", price: 323.32}])
})

// app.get("/api/users/:id", (req, res)=> {
//     console.log(req.params)
//     const parsedId = parseInt(req.params.id);
//     console.log(parsedId)
//     if(isNaN(parsedId)) return res.status(400).send({msq: "Bad request! Invalid ID."});
//     const findUser = mockUsers.find((user) => user.id === parsedId);
//     if(!findUser) return res.sendStatus(404);
//     return res.send(findUser)
// })




//localhost:3010
//routes
//route parameter



//updating entire object
// app.put("/api/users/:id", (request, response) => {
//     const {body, params: { id }} = request
//     const parsedId = parseInt(id)
//     if(!body) return response.status(400).send({msg: "Request body is null!"})
//     if(isNaN(parsedId)) return response.status(400).send({msg: "ID is not numeric!"})
//     const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId)
//     if(findUserIndex === -1) return response.sendStatus(404)
//     mockUsers[findUserIndex] = { id: parsedId, ...body}
//     return response.sendStatus(200)

    
// })



// app.patch("/api/users/:id", (request, response) => {
//     const {body, params: { id }} = request
//     const parsedId = parseInt(id)
//     if(!body) return response.status(400).send({msg: "Request body is null!"})
//     if(isNaN(parsedId)) return response.status(400).send({msg: "ID is not numeric!"})
//     const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId)
// console.log("User index:", findUserIndex)
//     if(findUserIndex === -1) return response.sendStatus(404)
        
//     mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body}
//     return response.sendStatus(200)
// })



// app.delete("/api/users/:id", (request, response) => {
//     const { params: { id }} = request
//     const parsedId = parseInt(id)
//     if(isNaN(parsedId)) return response.status(400).send({msg: "ID is not numeric!"})
//     const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId)
//     console.log("User index:", findUserIndex)
//     if(findUserIndex === -1) return response.sendStatus(404)
        
//     mockUsers.splice(findUserIndex, 1) // what splice does
//     return response.sendStatus(200)
// })

