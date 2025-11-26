import { AppLayout } from '@/components/AppLayout';
import { ManuscriptAccordion } from '@/components/ManuscriptAccordion';
import { mockManuscripts } from '@/data/mockData';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';

const Index = () => {
  const readyManuscripts = mockManuscripts.filter(m => m.status === 'ready');
  const sentBackManuscripts = mockManuscripts.filter(m => m.status === 'sent-back');

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Editorial Office Worklist</h1>
          <p className="text-muted-foreground">Manage submitted manuscripts and pre-screening results</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card-elevated p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{mockManuscripts.length}</p>
              <p className="text-sm text-muted-foreground">Total Submissions</p>
            </div>
          </div>
          <div className="card-elevated p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{readyManuscripts.length}</p>
              <p className="text-sm text-muted-foreground">Ready to Progress</p>
            </div>
          </div>
          <div className="card-elevated p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{sentBackManuscripts.length}</p>
              <p className="text-sm text-muted-foreground">Sent Back to Author</p>
            </div>
          </div>
        </div>

        {/* Sent Back Manuscripts */}
        {sentBackManuscripts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Sent Back to Author ({sentBackManuscripts.length})
            </h2>
            <div className="space-y-3">
              {sentBackManuscripts.map((manuscript) => (
                <ManuscriptAccordion key={manuscript.id} manuscript={manuscript} showAssignButton={false} />
              ))}
            </div>
          </div>
        )}

        {/* Ready Manuscripts */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Ready to Progress ({readyManuscripts.length})
          </h2>
          <div className="space-y-3">
            {readyManuscripts.map((manuscript) => (
              <ManuscriptAccordion key={manuscript.id} manuscript={manuscript} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
