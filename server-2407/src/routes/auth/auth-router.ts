import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth-middleware'
import AuthController from './auth-controller'
import AuthService from './auth-service'
import passport from 'passport';
import { IUserWithTokens } from './models/User';
import { google } from 'googleapis';
import * as googleAuthController from '../auth/google-auth';

const authRouter = Router()

const authService = new AuthService()
const authController = new AuthController(authService)

authRouter.post('/register', authController.registerUser)
authRouter.post('/login', authController.loginUser)
authRouter.post('/refresh-token', authController.refreshToken)

authRouter.post('/check-tokens', googleAuthController.checkTokens);

authRouter.get('/google', googleAuthController.redirectToGoogle);
authRouter.get('/google/callback', googleAuthController.googleCallback);


// authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));


// authRouter.get('/google/callback', passport.authenticate('google', {
//   failureRedirect: `${process.env.FRONTEND_URL}/sign-in`
// }), (req, res) => {
//   const user = req.user as IUserWithTokens;

//   if (user && user.accessToken && user.refreshToken) {
//     const { accessToken, refreshToken, _id, email, username } = user; // Include necessary user info

//     // Redirect to frontend with tokens and user info
//     res.redirect(`${process.env.FRONTEND_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}&loginSource=google&userId=${_id}&email=${email}&username=${username}`);
//   } else {
//     res.redirect(`${process.env.FRONTEND_URL}/sign-in?error=token_missing`);
//   }
// });


//authRouter.post('/check-session', authController.checkSession);

// Example protected route
authRouter.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You have access to this route!' })
})

export default authRouter
