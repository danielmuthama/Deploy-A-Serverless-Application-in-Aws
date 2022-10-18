import "source-map-support/register";

<<<<<<< HEAD
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createLogger } from '../../utils/logger'
import { getUserTodos as getUserTodos } from '../../helpers/todos'
import { getUserId } from '../utils';

const logger = createLogger('getTodo')


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('getting TODO', { event })
    try {
      const userId = getUserId(event)
      const todos = await getUserTodos(userId);
      return {
        statusCode: 200,
        body: JSON.stringify({
          items: todos
        })
      };
    } catch (error) {
      logger.error('Error: ', error.message)
      throw new Error(error);
    }
  })

handler.use(
  cors({
    credentials: true
  })
)
=======
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";
import { getAllTodosForUser } from "../../businessLogic/todo";
import { decodeJWTFromAPIGatewayEvent } from "../../auth/utils";
import { parseUserId } from "../../auth/utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing event: ", event);
    // TODO: Get all TODO items for a current user
    const jwtToken = decodeJWTFromAPIGatewayEvent(event);
    const userId = parseUserId(jwtToken);
    const result = await getAllTodosForUser(userId);

    if (result.count !== 0)
      return {
        statusCode: 200,
        body: JSON.stringify({ items: result.Items }),
      };

    return {
      statusCode: 404,
      body: JSON.stringify({
        error: "Item not found",
      }),
    };
  }
);

handler
  .use(
    cors({
      credentials: true,
    })
  )
  .use(httpErrorHandler());
>>>>>>> 2a212deb9a209deb002256147968ff27b1a5d065
