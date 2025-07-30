// import the jwt
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

const auth = (req,res,next)=>{
    // extract authorization header
    const authHeader = req.headers.authorization
    // get actual token from the header
    const token = authHeader && authHeader.split(' ')

    // check if we have a token 
    if(!token) return res.status(404).json({message:"No token provided"})
        try {
            // Verify the token using the secret key
            const decode = jwt.verify(token,JWT_SECRET)
            // we attach the payload to the request object
            // This is the logged in user
            req.user = decode
            // proced to the next route/function
            next()

        } catch (error) {
            res.status(500).json({message:error.message})
        }
}

// middleware to authorize access based on the user role
// accepts any number of allowed roles(e.g 'admin',teacher')
// ...params - accepts any number of arguments and automatically puts them into an array
const authorizeRoles = (...allowedRoles)=>{
    return(req,res,next)=>{
        if(!req.user || !allowedRoles.includes(req.user.role)){
            return res.status(403).json({message:"Access denied:Insufficient Permissions..."})
        }
        next()
    }
}

module.exports = {auth,authorizeRoles}