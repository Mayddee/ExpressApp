import { mockUsers } from "./constants.mjs";

export const resolveIndexByUserId = (request, response, next) => {
    const { params: { id }} = request
    const parsedId = parseInt(id)
    console.log(parsedId)
    if(isNaN(parsedId)) return response.status(400).send({msg: "ID is not numeric!"})
    const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId)
    if(findUserIndex === -1) return response.sendStatus(404)
    request.findUserIndex = findUserIndex
    // next(new Error())
    next()
}

export const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`)
    next()
}