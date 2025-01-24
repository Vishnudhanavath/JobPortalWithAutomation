import jwt from "jsonwebtoken";

// Middleware to check if the user is authenticated
export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid or expired token",
        success: false,
      });
    }

    // Assign userId and role to req object
    req.user = decoded.userId;
    req.role = decoded.role || "user"; // Default to "user" if no role is found in token

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      message: "Something went wrong during authentication.",
      success: false,
    });
  }
};

// Middleware to check if the user is authorized based on their role
export const isAuthorized = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Ensure the user is authenticated
      if (!req.user || !req.role) {
        return res.status(401).json({
          message: "User not authenticated or role missing",
          success: false,
        });
      }

      // Check if the user's role is allowed to access the resource
      if (!allowedRoles.includes(req.role)) {
        return res.status(403).json({
          message: `Role ${req.role} is not allowed. Required roles: ${allowedRoles.join(", ")}`,
          success: false,
        });
      }

      // Proceed to the next middleware/handler if authorized
      next();
    } catch (error) {
      console.error("Authorization error:", error);
      return res.status(500).json({
        message: "Something went wrong during authorization.",
        success: false,
      });
    }
  };
};
