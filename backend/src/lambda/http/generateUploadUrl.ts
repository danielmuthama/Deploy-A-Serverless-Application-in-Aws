import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import * as uuid from 'uuid'
import { generateSignedUrl, updateAttachmentUrl } from '../../helpers/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'


const logger = createLogger('generateTodoUrl')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Generating Upload URL', { event })
    try {
      const userId = getUserId(event)
      const todoId = event.pathParameters.todoId
      const attachmentId = uuid.v4()

      const uploadUrl = await generateSignedUrl(attachmentId)
      await updateAttachmentUrl(userId, todoId, attachmentId)

      return {
        statusCode: 200,
        body: JSON.stringify({
          uploadUrl
        })
      };

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
