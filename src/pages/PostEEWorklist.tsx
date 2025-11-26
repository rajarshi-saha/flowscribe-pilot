import { AppLayout } from '@/components/AppLayout';
import { ManuscriptAccordion } from '@/components/ManuscriptAccordion';
import { mockManuscripts } from '@/data/mockData';
import { Manuscript } from '@/types/manuscript';
import { FileText, CheckCircle, Clock, Users } from 'lucide-react';

const PostEEWorklist = () => {
  // Simulate post-EE review state with some manuscripts ready for peer review
  const postEEManuscripts: Manuscript[] = [
    { ...mockManuscripts[0], status: 'ready-for-peer-review' },
    { ...mockManuscripts[1], status: 'ready-for-peer-review' },
    { ...mockManuscripts[2], status: 'pending-review' },
    { ...mockManuscripts[3], status: 'ready-for-peer-review' },
    { ...mockManuscripts[4], status: 'pending-review' },
    { ...mockManuscripts[5], status: 'pending-review' },
  ];

  const readyForPeerReview = postEEManuscripts.filter(m => m.status === 'ready-for-peer-review');
  const pendingReview = postEEManuscripts.filter(m => m.status === 'pending-review');

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Editorial Office Worklist</h1>
          <p className="text-muted-foreground">Post Executive Editor Review - Assign peer reviewers</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card-elevated p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{postEEManuscripts.length}</p>
              <p className="text-sm text-muted-foreground">Total Active</p>
            </div>
          </div>
          <div className="card-elevated p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{readyForPeerReview.length}</p>
              <p className="text-sm text-muted-foreground">Ready for Reviewers</p>
            </div>
          </div>
          <div className="card-elevated p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pendingReview.length}</p>
              <p className="text-sm text-muted-foreground">Pending EE Review</p>
            </div>
          </div>
          <div className="card-elevated p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">0</p>
              <p className="text-sm text-muted-foreground">In Peer Review</p>
            </div>
          </div>
        </div>

        {/* Ready for Peer Review */}
        {readyForPeerReview.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-accent" />
              Ready for Peer Reviewer Assignment ({readyForPeerReview.length})
            </h2>
            <div className="space-y-3">
              {readyForPeerReview.map((manuscript) => (
                <ManuscriptAccordion key={manuscript.id} manuscript={manuscript} />
              ))}
            </div>
          </div>
        )}

        {/* Pending EE Review */}
        {pendingReview.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              Pending Executive Editor Review ({pendingReview.length})
            </h2>
            <div className="space-y-3">
              {pendingReview.map((manuscript) => (
                <ManuscriptAccordion key={manuscript.id} manuscript={manuscript} showAssignButton={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default PostEEWorklist;
