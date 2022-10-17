import * as AWS from 'aws-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
const todoAtIndex = process.env.TODOS_CREATED_AT_INDEX

export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX
    ) {
    }

    async getAllTodos(userId: string): Promise<TodoItem[]> {
        const params = {
            TableName: this.todosTable,
            indexName: this.todosCreatedAtIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }
        const result = await this.docClient.query(params).promise()
        const items = result.Items
        logger.info('Getting Todos', {
            items
        })
        return items as TodoItem[]
    }

    async getUserTodo(userId: string): Promise<TodoItem> {
        const result = await this.docClient
            .query({
                TableName: this.todosTable,
                IndexName: todoAtIndex,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                }
            }).promise()

        return result.Items as unknown as TodoItem
    }

    async createTodo(todo: TodoItem): Promise<void> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise();
    }

    async updateTodo(
        todo: TodoUpdate,
        todoId: string,
        userId: string): Promise<TodoItem> {
        const res = await this.docClient.update({
            TableName: this.todosTable,
            Key: { userId, todoId },
            UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ExpressionAttributeValues: {
                ':name': todo.name,
                ':dueDate': todo.dueDate,
                ':done': todo.done
            },
            ReturnValues: "ALL_NEW"
        }).promise();
        return res.Attributes as TodoItem
    }

    async deleteTodo(todoId: string, userId: string) {
        const result = await this.docClient
            .delete({
                TableName: this.todosTable,
                Key: { userId, todoId },
                ReturnValues: 'ALL_OLD',
            }).promise()

        return result.Attributes as TodoItem
    }

    async updateTodoItemAttachment(
        userId: string,
        todoId: string,
        attachmentUrl: string
    ): Promise<void> {
        await this.docClient
            .update({
                TableName: this.todosTable,
                Key: { userId, todoId },
                UpdateExpression: 'set attachmentUrl = :attachmentUrl',
                ExpressionAttributeValues: {
                    ':attachmentUrl': attachmentUrl
                },
            }).promise()

        return
    }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}