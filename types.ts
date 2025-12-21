export interface Lead {
  id: string;
  email: string;
  name: string;
  company: string;
  status: 'pending' | 'sent' | 'opened' | 'replied' | 'waiting_followup' | 'followup_sent' | 'completed' | 'bounced';
  history: Array<{ timestamp: Date; event: string }>;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface SmtpConfig {
  host: string;
  port: string;
  user: string;
  pass: string; // In a real app, this wouldn't be stored in plain state like this
}

export interface CampaignLogic {
  followUpDelayDays: number;
  maxFollowUps: number;
  stopOnReply: boolean;
}

export interface CampaignState {
  step: number; // 0: Start, 1: SMTP, 2: Leads, 3: Template, 4: Logic, 5: Review/Schedule, 6: Simulation
  smtp: SmtpConfig;
  leads: Lead[];
  template: EmailTemplate;
  followUpTemplate: EmailTemplate;
  logic: CampaignLogic;
  isRunning: boolean;
  startDate: string;
}

export enum SimulationSpeed {
  REALTIME = 1000, // 1 sec = 1 sec (too slow for demo)
  FAST = 100,      // 1 sec = 100ms
  INSTANT = 10     // 1 sec = 10ms
}