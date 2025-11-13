import passport from "./passport.js";

export const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err || !user) {
      res.clearCookie("currentUser");
      return res.redirect("/users/login");
    }

    req.user = user;
    next();
  })(req, res, next);
};
