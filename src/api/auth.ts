import axios from 'axios'
import { AuthResponse } from '../types'

export const loginApi = async (email: string, password: string): Promise<AuthResponse> => {
  const res = await axios.post('/auth/login', { email, password })
  return res.data
}

export const registerApi = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const res = await axios.post('/auth/register', { name, email, password })
  return res.data
}