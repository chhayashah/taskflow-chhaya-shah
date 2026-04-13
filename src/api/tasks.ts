import axios from 'axios'
import { Task } from '../types'

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

export const getTasks = async (projectId: string, filters?: { status?: string; assignee?: string }): Promise<{ tasks: Task[] }> => {
  const res = await axios.get(`/projects/${projectId}/tasks`, { params: filters, headers: getHeaders() })
  return res.data
}

export const createTask = async (projectId: string, data: Partial<Task>): Promise<Task> => {
  const res = await axios.post(`/projects/${projectId}/tasks`, data, { headers: getHeaders() })
  return res.data
}

export const updateTask = async (id: string, data: Partial<Task>): Promise<Task> => {
  const res = await axios.patch(`/tasks/${id}`, data, { headers: getHeaders() })
  return res.data
}

export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`/tasks/${id}`, { headers: getHeaders() })
}