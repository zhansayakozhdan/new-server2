import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth-middleware'
import AuthController from './auth-controller'
import AuthService from './auth-service'
import passport from 'passport';

const authRouter = Router()

const authService = new AuthService()
const authController = new AuthController(authService)

authRouter.post('/register', authController.registerUser)
authRouter.post('/login', authController.loginUser)
authRouter.post('/refresh-token', authController.refreshToken)

authRouter.post('/check-tokens', authController.checkTokens);



authRouter.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

authRouter.get('/google/callback', passport.authenticate('google', {
  successRedirect: `${process.env.FRONTEND_URL}`,
  failureRedirect:  `${process.env.FRONTEND_URL}/sign-in`
}));

// Example protected route
authRouter.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'You have access to this route!' })
})

export default authRouter
