import express from "express";
import router from "./routes/index.mjs";
import { resolveIndexByUserId, loggingMiddleware } from "./utils/middlewares.mjs";
import cookieParser from "cookie-parser"
import session from "express-session"
import { query, validationResult, body, matchedData, checkSchema, check } from "express-validator";
import { createUserValidationSchema } from "./utils/validationSchemas.mjs";
import { mockUsers } from "./utils/constants.mjs";
import passport from "passport";
import "./strategies/local-strategy.mjs";

const app = express() //reference

app.use(express.json());

app.use(cookieParser("helloworld"));
app.use(session({
    secret: 'madina you are',
    saveUninitialized: false, //to not store if session object has nothing to save memory
    resave: false, //forcing not to save session to session store if not modified
    cookie: { //to configure how long cookie will live
        maxAge: 60000 * 60, // to set user be logged in for 1 hour
    }
})) // before regestering any endpoints as routes

app.use(passport.initialize()); // after sessions use, before routes
app.use(passport.session());
app.use(router);




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
    console.log(request.session)
    console.log(request.session.id)
    request.session.visited =true
    response.cookie("hello", "world", { maxAge: 15000 * 2, signed: true })
    response.status(201).send({msg: "Hello!"})
});

//1) we used it in Sessions part 
// app.post('/api/auth', checkSchema(createUserValidationSchema), (request, response) => {
//     const result = validationResult(request);
//     console.log("Validation result: ", result);
//     const data = matchedData(request);
//     const { username, password } = data ;
//     const findUser = mockUsers.find(user => username === user.username);
//     if(!findUser || findUser.password !== password) return response.status(401).send({msg: "Wrong credentials!"});

//     request.session.user = findUser;
//     return response.status(200).send(findUser);
// })

//2)
app.post("/api/auth", 
    passport.authenticate("local"), //since strategy for local we pass "local" other "google, "github" , "discord"
    (request, response) => {
        return response.sendStatus(200);

})

//1) with Sessions
// app.get('/api/auth/status', (request, response) => {
//     request.sessionStore.get(request.sessionID, (err, session) => {
//         console.log(session)
//     })
//     return request.session.user ? response.status(200).send(request.session.user) : response.status(401).send({msg: "Not Authenticated"}) ;
// })


//2) with Passport
app.get("/api/auth/status", (request, response) => {
    console.log("Inside /api/auth/status endpoint");
    console.log(request.user);
    console.log(request.session);

    return request.user ? response.send(request.user) : response.sendStatus(401);


});

app.post("/api/auth/logout", (request, response) => {
    if(!request.user) return response.sendStatus(401);

    request.logout((err) => {
        if (err) return response.sendStatus(400);
        return response.sendStatus(200);
    });
});

app.post('/api/cart', (request, response) => {
    if(!request.session.user) return response.sendStatus(401);
    const data = matchedData(request);
    const { body : item} = request;
    const { cart } = request.session;
    if (cart) {
        cart.push(item)
    } else {
        request.session.cart = [item]
    }
    return response.status(201).send(item)
})

app.get('/api/cart', (request, response) => {
    if (!request.session.user) return response.sendStatus(401);
        return response.send(request.session.cart ?? []);
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

