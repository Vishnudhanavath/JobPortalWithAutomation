// import jwt from "jsonwebtoken";

// export const isAuthenticated = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.status(401).json({
//         message: "User not authenticated",
//         success: false,
//       });
//     }

//     // Verify the JWT token
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);

//     // Assign userId and role to req object
//     req.user = decoded.userId;
//     req.role = decoded.role || "user";  // Default role to "user" if not provided

//     next();
//   } catch (error) {
//     console.error("Authentication error:", error);
//     return res.status(401).json({
//       message: "Invalid or expired token", // Provide clear error for invalid/expired token
//       success: false,
//     });
//   }
// };

// // Middleware to check if the user is authorized based on their role
// export const isAuthorized = (...allowedRoles) => {
//   return (req, res, next) => {
//     try {
//       // Ensure the user is authenticated
//       if (!req.user || !req.role) {
//         return res.status(401).json({
//           message: "User not authenticated or role missing",
//           success: false,
//         });
//       }

//       // Check if the user's role is allowed to access the resource
//       if (!allowedRoles.includes(req.role)) {
//         return res.status(403).json({
//           message: `Role ${req.role} is not allowed. Required roles: ${allowedRoles.join(", ")}`,
//           success: false,
//         });
//       }

//       // Proceed to the next middleware/handler if authorized
//       next();
//     } catch (error) {
//       console.error("Authorization error:", error);
//       return res.status(500).json({
//         message: "Something went wrong during authorization.",
//         success: false,
//       });
//     }
//   };
// };

import jwt from "jsonwebtoken";
import { User } from "../models/userSchema.js";

// CatchAsyncErrors function inline
const catchAsyncErrors = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      console.error(error); // Optionally log the error
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    });
  };
};

// isAuthenticated middleware
// export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
//   const { token } = req.cookies;
//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "User is not authenticated.",
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//     req.user = await User.findById(decoded.id);
//     console.log(req.user);

//     if (!req.user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     next();
//   } catch (error) {
//     console.error(error); // Log error for debugging
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token.",
//     });
//   }
// });


// Middleware to check if the user is authenticated
export const isAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies; 
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User is not authenticated. Token is missing.",
            });
        }

        // Decode the token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decoded);

        // Fetch the user from the database
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Invalid token.",
            });
        }

        // Attach user to the request
        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};


// isAuthorized middleware
export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `${req.user ? req.user.role : "User"} is not authorized to access this resource.`,
      });
    }
    next();
  };
};
