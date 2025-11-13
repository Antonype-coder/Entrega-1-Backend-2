import passport from "./passport.js";

export const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      res.clearCookie("currentUser");
      return res.redirect("/users/login");
    }
    req.user = user;
    next();
  })(req, res, next);
};

export const redirectIfAuthenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (user) return res.redirect("/users/current");
    next();
  })(req, res, next);
};