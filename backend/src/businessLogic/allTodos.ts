import * as uuid from 'uuid'
import {TodoItem} from "../models/TodoItem";
import {TodoUpdate} from "../models/TodoUpdate";
import { TodoItemAccess } from "../dataLayer/todoItemDataAccess";
import {CreateTodoRequest} from "../requests/CreateTodoRequest";
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

// const TodoItemAccess = new TodoItemAccess()

export async function getAllTodoItems (userId: String): Promise<TodoItem[]>{
  const todoItemAccess = new TodoItemAccess()
  return await todoItemAccess.getAllTodoItems(userId);
}


export async function createTodoItem (userId: string, todoItem: CreateTodoRequest): Promise<TodoItem>{
  const todoId = uuid.v4();
  console.log(todoId)
  console.log(userId)
  console.log(todoItem.name)
  console.log(todoItem.dueDate)

  const todoItemAccess = new TodoItemAccess()
  return await todoItemAccess.createTodoItem(
    {
      userId: userId,
      todoId: todoId,
      createdAt: new Date().toISOString(),
      name: todoItem.name,
      dueDate: todoItem.dueDate,
      done: false,
      attachmentUrl: null
    }
  )
}

export async function updateTodoItem(todoId: String, todoItem:UpdateTodoRequest): Promise<TodoUpdate>{
  const todoItemAccess = new TodoItemAccess()
  return await todoItemAccess.updateTodoItem(todoId, todoItem)

}

export async function deleteTodoItem(todoId: String){
  const todoItemAccess = new TodoItemAccess()
  return await todoItemAccess.deleteTodoItem(todoId)

}



export async function getSignedUrl(todoId:string){
  const imageId = uuid.v4();
  const todoItemAccess = new TodoItemAccess()
  return await todoItemAccess.imageUpload(todoId, imageId);
}