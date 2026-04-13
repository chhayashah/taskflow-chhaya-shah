import { http, HttpResponse } from 'msw'
import { AuthResponse, Project, Task, User } from '../types'

const users: User[] = [
  { id: '1', name: 'Chhaya Shah', email: 'test@example.com' },
]

const projects: Project[] = [
  { id: '1', name: 'Website Redesign', description: 'Q2 project', owner_id: '1', created_at: '2026-04-01T10:00:00Z' },
  { id: '2', name: 'Mobile App v2', description: 'New features', owner_id: '1', created_at: '2026-04-02T10:00:00Z' },
]

const tasks: Task[] = [
  { id: '1', title: 'Design homepage', status: 'todo', priority: 'high', project_id: '1', due_date: '2026-04-10', created_at: '2026-04-01T10:00:00Z', updated_at: '2026-04-01T10:00:00Z' },
  { id: '2', title: 'Setup component library', status: 'in_progress', priority: 'medium', project_id: '1', assignee_id: '1', created_at: '2026-04-01T10:00:00Z', updated_at: '2026-04-01T10:00:00Z' },
  { id: '3', title: 'Setup project repo', status: 'done', priority: 'high', project_id: '1', assignee_id: '1', created_at: '2026-04-01T10:00:00Z', updated_at: '2026-04-01T10:00:00Z' },
]

const getProjectsWithCounts = () => {
  return projects.map(p => ({
    ...p,
    task_count: tasks.filter(t => t.project_id === p.id).length,
    done_count: tasks.filter(t => t.project_id === p.id && t.status === 'done').length,
  }))
}

export const handlers = [
  http.post('/auth/register', async ({ request }) => {
    const body = await request.json() as any
    const user: User = { id: Date.now().toString(), name: body.name, email: body.email }
    users.push(user)
    return HttpResponse.json<AuthResponse>({ token: 'mock-jwt-token', user }, { status: 201 })
  }),

  http.post('/auth/login', async ({ request }) => {
    const body = await request.json() as any
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json<AuthResponse>({ token: 'mock-jwt-token', user: users[0] })
    }
    return HttpResponse.json({ error: 'unauthorized' }, { status: 401 })
  }),

  http.get('/projects', () => {
    return HttpResponse.json({ projects: getProjectsWithCounts() })
  }),

  http.post('/projects', async ({ request }) => {
    const body = await request.json() as any
    const project: Project = {
      id: Date.now().toString(),
      name: body.name,
      description: body.description,
      owner_id: '1',
      created_at: new Date().toISOString(),
      task_count: 0,
      done_count: 0,
    }
    projects.push(project)
    return HttpResponse.json(project, { status: 201 })
  }),

  http.get('/projects/:id', ({ params }) => {
    const project = projects.find(p => p.id === params.id)
    if (!project) return HttpResponse.json({ error: 'not found' }, { status: 404 })
    const projectTasks = tasks.filter(t => t.project_id === params.id)
    return HttpResponse.json({
      ...project,
      task_count: projectTasks.length,
      done_count: projectTasks.filter(t => t.status === 'done').length,
      tasks: projectTasks,
    })
  }),

  http.patch('/projects/:id', async ({ params, request }) => {
    const body = await request.json() as any
    const idx = projects.findIndex(p => p.id === params.id)
    if (idx === -1) return HttpResponse.json({ error: 'not found' }, { status: 404 })
    projects[idx] = { ...projects[idx], ...body }
    return HttpResponse.json(projects[idx])
  }),

  http.delete('/projects/:id', ({ params }) => {
    const idx = projects.findIndex(p => p.id === params.id)
    if (idx === -1) return HttpResponse.json({ error: 'not found' }, { status: 404 })
    projects.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),

  http.get('/projects/:id/tasks', ({ params, request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const assignee = url.searchParams.get('assignee')
    let filtered = tasks.filter(t => t.project_id === params.id)
    if (status) filtered = filtered.filter(t => t.status === status)
    if (assignee) filtered = filtered.filter(t => t.assignee_id === assignee)
    return HttpResponse.json({ tasks: filtered })
  }),

  http.post('/projects/:id/tasks', async ({ params, request }) => {
    const body = await request.json() as any
    const task: Task = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      status: 'todo',
      priority: body.priority || 'medium',
      project_id: params.id as string,
      assignee_id: body.assignee_id,
      due_date: body.due_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    tasks.push(task)
    return HttpResponse.json(task, { status: 201 })
  }),

  http.patch('/tasks/:id', async ({ params, request }) => {
    const body = await request.json() as any
    const idx = tasks.findIndex(t => t.id === params.id)
    if (idx === -1) return HttpResponse.json({ error: 'not found' }, { status: 404 })
    tasks[idx] = { ...tasks[idx], ...body, updated_at: new Date().toISOString() }
    return HttpResponse.json(tasks[idx])
  }),

  http.get('/projects/:id/stats', ({ params }) => {
  const projectTasks = tasks.filter(t => t.project_id === params.id)
  const stats = {
    total: projectTasks.length,
    by_status: {
      todo: projectTasks.filter(t => t.status === 'todo').length,
      in_progress: projectTasks.filter(t => t.status === 'in_progress').length,
      done: projectTasks.filter(t => t.status === 'done').length,
    },
    by_priority: {
      high: projectTasks.filter(t => t.priority === 'high').length,
      medium: projectTasks.filter(t => t.priority === 'medium').length,
      low: projectTasks.filter(t => t.priority === 'low').length,
    },
    completion_rate: projectTasks.length > 0
      ? Math.round((projectTasks.filter(t => t.status === 'done').length / projectTasks.length) * 100)
      : 0,
    overdue: projectTasks.filter(t => t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done').length,
  }
  return HttpResponse.json(stats)
}),

  http.delete('/tasks/:id', ({ params }) => {
    const idx = tasks.findIndex(t => t.id === params.id)
    if (idx === -1) return HttpResponse.json({ error: 'not found' }, { status: 404 })
    tasks.splice(idx, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]