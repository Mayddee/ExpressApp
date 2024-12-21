import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";

//takes as user - findUser passed by done() in Startegy()
passport.serializeUser((user, done) => {
    console.log("Inside Serialize User!");
    console.log(user);
    done(null, user.id); //we can pass whatever(must be unique) we want as 2nd arg : done(null, user.id)
});

passport.deserializeUser((id, done)=> {
    console.log("Inside Desesrializer!")
    console.log("Deserializing user ID: ", id)
    try {
        const findUser = mockUsers.find(user => user.id === id);
        if (!findUser) throw new Error("User Not Found");
        done(null, findUser)
    } catch (error) {
        done(err, null)
    }
})

export default passport.use(
    //to strategy class we can pass options and verify functions, but now we pass only the function
    new Strategy((username, password, done )=> {// options {usernameField: "emal"}, to specify what we pass as usernameField and so on
        console.log("Username: ", username);
        console.log("Password: ", password)
        //search for the user
        try {
            const findUser = mockUsers.find(user=> user.username === username);
            if (!findUser) throw new Error("User not found!");
            if (findUser.password !== password ) throw new Error("Invalid credentials!");
            done(null, findUser);

        } catch ( err ) { //cathces the thrown error
            //done() takes as args an error and a user that could be false value
            done(err, null); //that is for Thunder server to send error as HTML
        }
    })
)