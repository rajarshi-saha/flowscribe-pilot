import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { mockManuscripts, mockReviewers } from '@/data/mockData';
import { Reviewer } from '@/types/manuscript';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Mail, 
  User, 
  Clock, 
  TrendingUp, 
  Briefcase,
  CheckCircle,
  Send,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const PeerReviewerAssignment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const manuscriptId = location.state?.manuscriptId || 'MS-2024-001';
  
  const manuscript = mockManuscripts.find(m => m.id === manuscriptId) || mockManuscripts[0];

  const [selectedReviewers, setSelectedReviewers] = useState<string[]>(
    mockReviewers.slice(0, 5).map(r => r.id)
  );
  const [reviewerStatus, setReviewerStatus] = useState<Record<string, Reviewer['inviteStatus']>>(
    mockReviewers.reduce((acc, r) => ({ ...acc, [r.id]: r.inviteStatus }), {})
  );
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const [selectedForInvite, setSelectedForInvite] = useState<Reviewer | null>(null);
  const [selectedForReplace, setSelectedForReplace] = useState<Reviewer | null>(null);
  const [replaceNote, setReplaceNote] = useState('');

  const topReviewers = mockReviewers.slice(0, 5);
  const alternateReviewers = mockReviewers.slice(5);

  const handleToggleReviewer = (reviewerId: string) => {
    setSelectedReviewers(prev => 
      prev.includes(reviewerId) 
        ? prev.filter(id => id !== reviewerId)
        : [...prev, reviewerId]
    );
  };

  const handleOpenInvite = (reviewer: Reviewer) => {
    setSelectedForInvite(reviewer);
    setShowInviteModal(true);
  };

  const handleSendInvite = () => {
    if (selectedForInvite) {
      setReviewerStatus(prev => ({ ...prev, [selectedForInvite.id]: 'sent' }));
      toast.success('Invitation sent', {
        description: `Email sent to ${selectedForInvite.name}`
      });
      setShowInviteModal(false);
      setSelectedForInvite(null);
    }
  };

  const handleReplace = (reviewer: Reviewer) => {
    setSelectedForReplace(reviewer);
    setShowReplaceModal(true);
  };

  const handleConfirmReplace = () => {
    if (selectedForReplace) {
      setSelectedReviewers(prev => prev.filter(id => id !== selectedForReplace.id));
      toast.info('Reviewer replaced', {
        description: `${selectedForReplace.name} has been removed from selection.`
      });
      setShowReplaceModal(false);
      setSelectedForReplace(null);
      setReplaceNote('');
    }
  };

  const ReviewerCard = ({ reviewer, isSelected, showActions }: { 
    reviewer: Reviewer; 
    isSelected: boolean;
    showActions?: boolean;
  }) => {
    const status = reviewerStatus[reviewer.id];
    
    return (
      <div className={cn(
        'card-elevated p-4 transition-all',
        isSelected && 'ring-2 ring-primary'
      )}>
        <div className="flex items-start gap-3">
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={() => handleToggleReviewer(reviewer.id)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-semibold text-foreground">{reviewer.name}</h4>
              {status === 'accepted' && (
                <Badge className="bg-success/10 text-success border-success/20 gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Accepted
                </Badge>
              )}
              {status === 'sent' && (
                <Badge className="bg-accent/10 text-accent border-accent/20 gap-1">
                  <Mail className="h-3 w-3" />
                  Invite Sent
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{reviewer.affiliation}</p>
            
            <div className="flex items-center gap-4 text-sm mb-2 flex-wrap">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="font-medium text-success">{reviewer.matchPercentage}% match</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{reviewer.averageReviewSpeed}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>Workload: {reviewer.workload}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{reviewer.pastReviewHistory} reviews</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2 mb-2">
              {reviewer.matchReason}
            </p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {reviewer.expertise.map((exp) => (
                <Badge key={exp} variant="secondary" className="text-xs">{exp}</Badge>
              ))}
            </div>

            {showActions && isSelected && status !== 'accepted' && (
              <div className="flex gap-2 pt-2 border-t border-border">
                {status !== 'sent' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleOpenInvite(reviewer)}
                    className="gap-1"
                  >
                    <Send className="h-4 w-4" />
                    Invite
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleReplace(reviewer)}
                  className="gap-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  Replace
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/post-ee-worklist')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Worklist
          </Button>
          <h1 className="text-2xl font-bold text-foreground mb-2">Peer Reviewer Assignment</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{manuscript.id}</Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground truncate">{manuscript.title}</span>
          </div>
        </div>

        {/* Top Recommended Reviewers */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-success" />
            Top Recommended Reviewers ({topReviewers.length})
          </h2>
          <div className="space-y-4">
            {topReviewers.map((reviewer) => (
              <ReviewerCard
                key={reviewer.id}
                reviewer={reviewer}
                isSelected={selectedReviewers.includes(reviewer.id)}
                showActions
              />
            ))}
          </div>
        </div>

        {/* Alternate Reviewers */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            Additional Candidates ({alternateReviewers.length})
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {alternateReviewers.map((reviewer) => (
              <ReviewerCard
                key={reviewer.id}
                reviewer={reviewer}
                isSelected={selectedReviewers.includes(reviewer.id)}
              />
            ))}
          </div>
        </div>

        {/* Status Summary */}
        <div className="sticky bottom-0 bg-background border-t border-border p-4 -mx-6">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="font-medium text-foreground">{selectedReviewers.length}</span>
              <span className="text-muted-foreground"> reviewers selected • </span>
              <span className="font-medium text-success">
                {Object.values(reviewerStatus).filter(s => s === 'accepted').length}
              </span>
              <span className="text-muted-foreground"> accepted • </span>
              <span className="font-medium text-accent">
                {Object.values(reviewerStatus).filter(s => s === 'sent').length}
              </span>
              <span className="text-muted-foreground"> invites sent</span>
            </div>
            <Button onClick={() => navigate('/')} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Complete Assignment
            </Button>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Send Review Invitation
            </DialogTitle>
            <DialogDescription>
              Compose and send invitation email to {selectedForInvite?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="text-sm">
                <span className="font-medium text-foreground">To:</span>
                <span className="ml-2 text-muted-foreground">{selectedForInvite?.email}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-foreground">Subject:</span>
                <span className="ml-2 text-muted-foreground">
                  Invitation to Review: {manuscript.id}
                </span>
              </div>
            </div>
            <div className="prose prose-sm max-w-none border rounded-lg p-4">
              <p>Dear {selectedForInvite?.name},</p>
              <p>
                We would like to invite you to review the following manuscript submitted to{' '}
                <strong>{manuscript.journal}</strong>:
              </p>
              <div className="bg-muted rounded p-3 my-3">
                <p className="font-medium">{manuscript.title}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  <strong>Abstract:</strong> {manuscript.abstract}
                </p>
              </div>
              <p>
                <strong>Review Timeline:</strong>
              </p>
              <ul>
                <li>Response to invitation: 5 days</li>
                <li>Review completion: 21 days from acceptance</li>
              </ul>
              <p>
                Please respond to this invitation by clicking the link below. If you are unable 
                to complete this review, we would appreciate suggestions for alternative reviewers.
              </p>
              <p>
                Thank you for your contribution to the peer review process.
              </p>
              <p>
                Best regards,<br />
                Editorial Office<br />
                {manuscript.journal}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendInvite} className="gap-2">
              <Send className="h-4 w-4" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Replace Modal */}
      <Dialog open={showReplaceModal} onOpenChange={setShowReplaceModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Replace Reviewer
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for replacing {selectedForReplace?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter your reason for replacement..."
              value={replaceNote}
              onChange={(e) => setReplaceNote(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReplaceModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmReplace}>
              Confirm Replacement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default PeerReviewerAssignment;
