import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth-middleware'
import EventController from './event-controller'
import EventService from './event-service'

const eventRouter = Router()

const eventService = new EventService()
const eventController = new EventController(eventService)

eventRouter.get('/', eventController.getAllEvents)
eventRouter.get('/:id', eventController.getEventById);
eventRouter.get('/get/by-url', eventController.getEventByUrl);
eventRouter.post('/suitable', eventController.getSuitableEvents);

// eventRouter.post('/register', authController.registerUser)
// eventRouter.post('/login', authController.loginUser)
// eventRouter.post('/refresh-token', authController.refreshToken)

// // Example protected route
// eventRouter.get('/protected', authMiddleware, (req, res) => {
//   res.json({ message: 'You have access to this route!' })
// })

export default eventRouter
