import { Router } from 'express'
import { authMiddleware } from '../../middlewares/auth-middleware'
import EventController from './event-controller'
import EventService from './event-service'
import { addEventToCalendar } from './calendar-controller'

const eventRouter = Router()

const eventService = new EventService()
const eventController = new EventController(eventService)

eventRouter.get('/', eventController.getAllEvents)
eventRouter.get('/:id', eventController.getEventById);
eventRouter.get('/get/by-url', eventController.getEventByUrl);
eventRouter.post('/suitable', eventController.getSuitableEvents);


eventRouter.post('/add-event', addEventToCalendar);
eventRouter.post('/generate-todo', eventController.generateTodoList);


// // Example protected route
// eventRouter.get('/protected', authMiddleware, (req, res) => {
//   res.json({ message: 'You have access to this route!' })
// })




export default eventRouter
