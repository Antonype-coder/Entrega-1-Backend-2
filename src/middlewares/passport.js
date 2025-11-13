import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.js";

passport.use('local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user || !user.comparePassword(password)) {
      return done(null, false, { message: 'Credenciales incorrectas' });
    }
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    (req) => {
      return req.signedCookies?.currentUser || 
             req.cookies?.currentUser ||
             (req.headers.authorization?.startsWith('Bearer ') ? 
              req.headers.authorization.substring(7) : null);
    }
  ]),
  secretOrKey: process.env.JWT_SECRET
};

passport.use('jwt', new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.id);
    return user ? done(null, user) : done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

export default passport;