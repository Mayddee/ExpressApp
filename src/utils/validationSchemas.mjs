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
            errorMessage: "DisplayName must be 5-32 characters length!"
        },
        notEmpty: {
            errorMessage: "DisplayName can not be empty!"
        },
        isString: {
            errorMessage: "DisplayName must be a string!"
        }
    },
    password: {
        isLength: {
            options: {
                min: 4, 
                max: 32
            },
            errorMessage: "Password must be 4-32 characters length!"
        },
        notEmpty: {
            errorMessage: "Password can not be empty!"
        },
        isString: {
            errorMessage: "Password must be a string!"
        }
    }
}

