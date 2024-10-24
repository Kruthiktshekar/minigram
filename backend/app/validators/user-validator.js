
import { User } from "../models/user-model.js"


export const userRegisterSchema = {
    email : {
        exists : {
            errorMessage : "email field is required"
        },
        notEmpty : {
            errorMessage : "email is required"
        },
        isEmail : {
            errorMessage : "email should be in a valid formate"
        },
        trim : true,
        normalizeEmail : true,
        // custom : {
        //     options : async function(value){
        //         try{
        //             const user = await User.findOne({email:value})
        //             if(user){
        //                 throw new Error('Email is already exists')
        //             }
        //             return true

        //         }
        //         catch(error){
        //             throw new Error(error.message)
        //         }
        //     }
        // }

    },
    password : {
        exists : {
            errorMessage : "password field is required"
        },
        notEmpty : {
            errorMessage : "password is required"
        },
        trim : true,
        isStrongPassword : {
            options : {
                minLength : 8,
                maxLength : 128,
                minLowerCase : 1,
                minUpperCase : 1,
                minSymbol : 1,
                minNumber : 1
            },
            errorMessage : 'password should consists of atleast one lowercase, one uppercase, one special character, one number and should be atleast 8 characters'
        }
    },
    fullname : {
        exists : {
            errorMessage : "name field required"
        },
        notEmpty : {
            errorMessage : "name is required"
        },
        trim : true
    },
    username : {
        exists : {
            errorMessage : "name field required"
        },
        notEmpty : {
            errorMessage : "name is required"
        },
        trim : true,
        custom :{
            options : async function(value){
                try{
                    const userName = await User.findOne({username : value})
                if(userName){
                    throw new Error('user name is already taken')
                }
                return true
                }
                catch(error) {
                    throw new Error(error.message)
                }
               
            }
        } 
    }
}

 export const loginUserSchema = {
    username : {
        exists : {
            errorMessage : "username field is required"
        },
        notEmpty : {
            errorMessage : "username is required"
        },
        trim : true,
        normalizeEmail : true,

    },
    password : {
        exists : {
            errorMessage : "password field is required"
        },
        notEmpty : {
            errorMessage : "password is required"
        },
        trim : true,
        isStrongPassword : {
            options : {
                minLength : 8,
                maxLength : 128,
                minLowerCase : 1,
                minUpperCase : 1,
                minSymbol : 1,
                minNumber : 1
            },
            errorMessage : 'password should consists of atleast one lowercase, one uppercase, one special character, one number and should be atleast 8 characters'
        }
    }
 }
