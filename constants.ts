import { Lead } from './types';

export const MOCK_LEADS: Lead[] = [
  { id: '1', email: 'alice@example.com', name: 'Alice Smith', company: 'TechCorp', status: 'pending', history: [] },
  { id: '2', email: 'bob@example.com', name: 'Bob Jones', company: 'BizInc', status: 'pending', history: [] },
  { id: '3', email: 'charlie@startup.io', name: 'Charlie Day', company: 'StartupIO', status: 'pending', history: [] },
  { id: '4', email: 'diana@enterprise.net', name: 'Diana Prince', company: 'Enterprise', status: 'pending', history: [] },
  { id: '5', email: 'evan@dev.co', name: 'Evan Wright', company: 'DevCo', status: 'pending', history: [] },
];

export const STEPS = [
  { id: 1, title: 'SMTP Config', description: 'Connect email server' },
  { id: 2, title: 'Leads', description: 'Upload contact list' },
  { id: 3, title: 'Templates', description: 'Design emails' },
  { id: 4, title: 'Logic', description: 'Follow-up rules' },
  { id: 5, title: 'Simulation', description: 'Run campaign' },
];