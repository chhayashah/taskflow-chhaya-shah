import axios from 'axios'
import type { Project } from '../types'

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`,
})

export const getProjects = async (): Promise<{ projects: Project[] }> => {
  const res = await axios.get('/projects', { headers: getHeaders() })
  return res.data
}

export const createProject = async (name: string, description?: string): Promise<Project> => {
  const res = await axios.post('/projects', { name, description }, { headers: getHeaders() })
  return res.data
}

export const getProject = async (id: string): Promise<Project & { tasks: any[] }> => {
  const res = await axios.get(`/projects/${id}`, { headers: getHeaders() })
  return res.data
}

export const updateProject = async (id: string, data: Partial<Project>): Promise<Project> => {
  const res = await axios.patch(`/projects/${id}`, data, { headers: getHeaders() })
  return res.data
}

export const deleteProject = async (id: string): Promise<void> => {
  await axios.delete(`/projects/${id}`, { headers: getHeaders() })
}

export const getProjectStats = async (id: string) => {
  const res = await axios.get(`/projects/${id}/stats`, { headers: getHeaders() })
  return res.data
}