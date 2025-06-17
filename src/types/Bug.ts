
export interface Bug {
  id: string;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  url?: string;
  browser?: string;
  steps?: string;
  createdAt: string;
}
