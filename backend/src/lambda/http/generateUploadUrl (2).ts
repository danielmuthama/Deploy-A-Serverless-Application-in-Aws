import 'source-map-support/register'
import { getSignedUrl } from '../../businessLogic/allTodos'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  const imageUrl = await getSignedUrl(todoId);
  return {
    statusCode: 202,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true 
    },
    body: JSON.stringify({
        uploadUrl: imageUrl.signedUploadUrl
    })

}
}
