export function authMiddleware(req, res, next) {
  console.log("✅ Auth Bypassed! Injecting dummy user.");
  
  // Forcefully inject the dummy user so the database queries work
  req.user = {
    id: "000000000000000000000001",
    email: "dummy@test.com",
  };
  
  // Move to the next function without checking for tokens
  next();
}