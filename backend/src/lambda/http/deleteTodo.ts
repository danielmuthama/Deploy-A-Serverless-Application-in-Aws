import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";
import { deleteTodo } from "../../businessLogic/todo";
import { createLogger } from "../../utils/logger";
import { decodeJWTFromAPIGatewayEvent } from "../../auth/utils";
import { parseUserId } from "../../auth/utils";

<<<<<<< HEAD
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../helpers/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Deleting TODO', { event })
    try {
      const todoId = event.pathParameters.todoId;
      const userId = getUserId(event);
      const item = await deleteTodo(todoId, userId)
      return {
        statusCode: 200,
        body: JSON.stringify({
          item
        })
      }

    } catch (error) {
      logger.error('Error: ', error.message)
      throw new Error(error);
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
=======
const logger = createLogger("todo");

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing event: ", event);
    const todoId = event.pathParameters.todoId;
    const jwtToken = decodeJWTFromAPIGatewayEvent(event);
    const userId = parseUserId(jwtToken);

    // TODO: Remove a TODO item by id
    await deleteTodo(todoId, userId);

    logger.info("todo DELETED", {
      // Additional information stored with a log statement
      key: todoId,
      userId: userId,
      date: new Date().toISOString,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(true),
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
