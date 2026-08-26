import { Router, Request, Response } from 'express';

export const projectsRouter = Router();

// Имитация БД в памяти для демонстрации API без активного подключения PostgreSQL
let projectsStore: any[] = [];

projectsRouter.get('/', (req: Request, res: Response) => {
  res.json({ success: true, projects: projectsStore });
});

projectsRouter.post('/', (req: Request, res: Response) => {
  const { name, client, regionId } = req.body;
  const newProject = {
    id: `proj_${Date.now()}`,
    name: name || 'Новый проект',
    client: client || null,
    regionId: regionId || 'TM-AS',
    createdAt: new Date().toISOString()
  };
  projectsStore.push(newProject);
  res.status(201).json({ success: true, project: newProject });
});

projectsRouter.get('/:id', (req: Request, res: Response) => {
  const project = projectsStore.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
  res.json({ success: true, project });
});

projectsRouter.put('/:id', (req: Request, res: Response) => {
  const project = projectsStore.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ success: false, error: 'Project not found' });
  Object.assign(project, req.body);
  res.json({ success: true, project });
});

projectsRouter.delete('/:id', (req: Request, res: Response) => {
  projectsStore = projectsStore.filter(p => p.id !== req.params.id);
  res.json({ success: true, message: 'Project deleted' });
});
