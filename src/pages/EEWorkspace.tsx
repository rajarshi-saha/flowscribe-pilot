import { AppLayout } from '@/components/AppLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { eeManuscripts, mockExecutiveEditors } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  AlertTriangle, 
  Clock,
  ArrowRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const EEWorkspace = () => {
  const navigate = useNavigate();
  const editor = mockExecutiveEditors[0];

  // Group manuscripts by journal
  const journalGroups = eeManuscripts.reduce((acc, ms) => {
    if (!acc[ms.journal]) {
      acc[ms.journal] = [];
    }
    acc[ms.journal].push(ms);
    return acc;
  }, {} as Record<string, typeof eeManuscripts>);

  const urgencyConfig = {
    high: { label: 'High', className: 'bg-destructive/10 text-destructive border-destructive/20' },
    medium: { label: 'Medium', className: 'bg-warning/10 text-warning border-warning/20' },
    low: { label: 'Low', className: 'bg-muted text-muted-foreground border-muted' },
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              {editor.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{editor.name}</h1>
              <p className="text-muted-foreground">Executive Editor • {editor.affiliation}</p>
            </div>
          </div>
          <p className="text-muted-foreground">
            Review and evaluate assigned manuscripts across your journals
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card-elevated p-4">
            <p className="text-3xl font-bold text-foreground">{eeManuscripts.length}</p>
            <p className="text-sm text-muted-foreground">Total Assigned</p>
          </div>
          <div className="card-elevated p-4">
            <p className="text-3xl font-bold text-destructive">
              {eeManuscripts.filter(m => m.urgency === 'high').length}
            </p>
            <p className="text-sm text-muted-foreground">High Priority</p>
          </div>
          <div className="card-elevated p-4">
            <p className="text-3xl font-bold text-warning">
              {eeManuscripts.filter(m => m.urgency === 'medium').length}
            </p>
            <p className="text-sm text-muted-foreground">Medium Priority</p>
          </div>
          <div className="card-elevated p-4">
            <p className="text-3xl font-bold text-foreground">{Object.keys(journalGroups).length}</p>
            <p className="text-sm text-muted-foreground">Active Journals</p>
          </div>
        </div>

        {/* Manuscripts by Journal */}
        {Object.entries(journalGroups).map(([journal, manuscripts]) => (
          <div key={journal} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">{journal}</h2>
              <Badge variant="secondary">{manuscripts.length}</Badge>
            </div>
            
            <div className="card-elevated overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Manuscript</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Authors</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Submitted</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Urgency</th>
                    <th className="text-left p-3 text-sm font-medium text-muted-foreground">Deadline</th>
                    <th className="text-right p-3 text-sm font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {manuscripts.map((ms) => (
                    <tr key={ms.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <div>
                          <span className="text-xs font-mono text-muted-foreground">{ms.id}</span>
                          <p className="font-medium text-foreground text-sm line-clamp-1">{ms.title}</p>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {ms.authors.slice(0, 2).join(', ')}
                        {ms.authors.length > 2 && ` +${ms.authors.length - 2}`}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {ms.submissionDate}
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge 
                          variant="outline" 
                          className={cn(urgencyConfig[ms.urgency || 'low'].className, 'gap-1')}
                        >
                          {ms.urgency === 'high' && <AlertTriangle className="h-3 w-3" />}
                          {urgencyConfig[ms.urgency || 'low'].label}
                        </Badge>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {ms.decisionDeadline}
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          size="sm"
                          onClick={() => navigate('/manuscript-review', { state: { manuscriptId: ms.id } })}
                          className="gap-1"
                        >
                          Review
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
};

export default EEWorkspace;
