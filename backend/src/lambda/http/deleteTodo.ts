import 'source-map-support/register'

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
