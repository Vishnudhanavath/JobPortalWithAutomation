import jwt from "jsonwebtoken";

export const isAuthenticated = async(req,res,next) =>{
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                message:"User not Authenticated",
                success:false 
            });
        }
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        };
        req.user = decode.userId;
        req.role = decode.role;
        next();
    } catch (error) {
        console.log(error);
    }
}

export const isAuthorized = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "User is not authenticated.",
                    success: false,
                });
            }
            if (!allowedRoles.includes(req.role)) {
                return res.status(403).json({
                    message: "You do not have permission to perform this action.",
                    success: false,
                });
            }
            next();
        } catch (error) {
            console.error("Authorization error:", error);
            return res.status(500).json({
                message: "Something went wrong.",
                success: false,
            });
        }
    };
};

