// Simple identification for this college project:
// the frontend sends the logged-in user's id in the "x-user-id" header.
// (A production app would use JWT tokens instead.)
module.exports = (req, res, next) => {
  const id = parseInt(req.header("x-user-id"), 10);
  if (!id) {
    return res.status(401).json({ message: "Please log in to continue" });
  }
  req.userId = id;
  next();
};
