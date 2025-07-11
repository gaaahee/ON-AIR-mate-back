import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import errorHandler from './middleware/errors/errorHandler.js'; // .js 추가
import AppError from './middleware/errors/AppError.js'; // .js 추가
import { sendSuccess } from './utils/response.js'; // .js 추가
import swaggerUi from 'swagger-ui-express';
import { specs } from '../swagger.js'; // .js 추가
import passport from './auth/passport.js'; // .js 추가
import { requireAuth } from './middleware/authMiddleware.js'; // .js 추가

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(passport.initialize());

app.get('/protected', requireAuth, (req: Request, res: Response) => {
  sendSuccess(res, { message: '인증된 사용자만 접근 가능' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Returns a hello world message
 *     tags: [Default]
 *     responses:
 *       200:
 *         description: The hello world message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                 error:
 *                   type: object
 */
app.get('/', (req: Request, res: Response) => {
  sendSuccess(res, { message: 'Hello World!' });
});

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(404, 'Not Found'));
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
