import 'source-map-support/register'
import {createTodoItem} from "../../businessLogic/allTodos";

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  

  // TODO: Implement creating a new TODO item

  const userId = getUserId(event);
  const item = await createTodoItem(userId, newTodo);

  

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true 
    },
    body: JSON.stringify({
      item
    })
  }




}
