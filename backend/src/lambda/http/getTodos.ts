import 'source-map-support/register'

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
