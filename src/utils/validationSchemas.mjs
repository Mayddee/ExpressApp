//for body() validator method
export const createUserValidationSchema = {
    username: {
        isLength: {
            options: {
                min: 5, 
                max: 32
            },
            errorMessage: "Username must be 5-32 characters length!"
        },
        notEmpty: {
            errorMessage: "Username can not be empty!"
        },
        isString: {
            errorMessage: "Username must be a string!"
        }
    },
    displayname: {
        isLength: {
            options: {
                min: 5, 
                max: 32
            },
            errorMessage: "Username must be 5-32 characters length!"
        },
        notEmpty: {
            errorMessage: "Username can not be empty!"
        },
        isString: {
            errorMessage: "Username must be a string!"
        }
    }
}