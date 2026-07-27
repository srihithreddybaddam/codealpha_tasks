import type { Priority, ChecklistItem } from '../types';

export interface AIBreakdownResult {
  summary: string;
  suggestedPriority: Priority;
  estimatedHours: number;
  checklist: ChecklistItem[];
  labels: string[];
}

export class AIService {
  /**
   * Generates automated sub-task checklists, priority recommendations,
   * and time estimates based on task title & context.
   */
  static async generateTaskBreakdown(title: string, description: string): Promise<AIBreakdownResult> {
    // Simulate AI network processing latency for realistic feedback
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lower = (title + ' ' + description).toLowerCase();

    // Default intelligent sub-task checklists based on intent recognition
    let checklist: string[] = [];
    let priority: Priority = 'medium';
    let hours = 8;
    let labels: string[] = ['AI Generated'];

    if (lower.includes('auth') || lower.includes('login') || lower.includes('security') || lower.includes('oauth')) {
      checklist = [
        'Design OAuth 2.0 PKCE auth flow & token refresh mechanism',
        'Setup JWT access/refresh cookie security options (SameSite & Secure)',
        'Implement social login providers (Google, GitHub, Apple)',
        'Add rate limiting & brute-force IP protection middleware',
        'Write end-to-end authentication test suite'
      ];
      priority = 'urgent';
      hours = 16;
      labels.push('Security', 'Backend');
    } else if (lower.includes('ui') || lower.includes('design') || lower.includes('glass') || lower.includes('component')) {
      checklist = [
        'Craft high-fidelity Figma glassmorphism design tokens',
        'Build responsive React glass card layout with Framer Motion animations',
        'Implement accessibility (WAI-ARIA) keyboard shortcuts & contrast colors',
        'Integrate micro-interaction audio feedback & haptics',
        'Validate cross-browser glass backdrop-filter rendering'
      ];
      priority = 'high';
      hours = 12;
      labels.push('Design', 'Frontend');
    } else if (lower.includes('api') || lower.includes('database') || lower.includes('backend') || lower.includes('sql')) {
      checklist = [
        'Define GraphQL / REST endpoint OpenAPI 3.0 specification',
        'Create optimized database indexing for high-concurrency queries',
        'Build redis caching layer with sliding expiration TTL',
        'Add comprehensive request validation & sanitization',
        'Deploy staging environment & load test with 10k RPS'
      ];
      priority = 'high';
      hours = 20;
      labels.push('Backend', 'Database');
    } else if (lower.includes('analytics') || lower.includes('chart') || lower.includes('report') || lower.includes('dashboard')) {
      checklist = [
        'Aggregate raw event stream into hourly/daily summary metrics',
        'Build interactive Recharts gradient velocity visualization',
        'Implement CSV / PDF export feature for executive summaries',
        'Add date range picker & dynamic metric filtering'
      ];
      priority = 'medium';
      hours = 14;
      labels.push('Analytics', 'Frontend');
    } else {
      checklist = [
        `Analyze technical scope for "${title}"`,
        'Draft architecture RFC & align with lead engineers',
        'Implement core functionality & error edge cases',
        'Conduct code review & test coverage verification',
        'Prepare release notes & deploy to production'
      ];
      priority = 'medium';
      hours = 8;
      labels.push('Feature');
    }

    return {
      summary: `Aether AI analyzed task "${title}" and constructed a ${checklist.length}-step execution plan with recommended priority [${priority.toUpperCase()}] and estimated ${hours}h dev scope.`,
      suggestedPriority: priority,
      estimatedHours: hours,
      checklist: checklist.map((text, idx) => ({
        id: `ai-chk-${Date.now()}-${idx}`,
        text,
        completed: false
      })),
      labels
    };
  }

  /**
   * Generates AI summary for task comments and activity history.
   */
  static generateQuickSummary(title: string, description: string, commentCount: number): string {
    return `⚡ AI Summary: "${title}" is currently progressing smoothly. Scope includes ${description.slice(0, 80)}... with ${commentCount} team discussion notes recorded.`;
  }
}
