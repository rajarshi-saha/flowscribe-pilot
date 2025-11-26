import { useState } from 'react';
import { ChevronDown, Mail, ExternalLink, ArrowRight, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Manuscript } from '@/types/manuscript';
import { StatusBadge } from './StatusBadge';
import { StoplightIndicator } from './StoplightIndicator';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface ManuscriptAccordionProps {
  manuscript: Manuscript;
  showAssignButton?: boolean;
}

export function ManuscriptAccordion({ manuscript, showAssignButton = true }: ManuscriptAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const navigate = useNavigate();

  const failedCheck = manuscript.preScreeningChecks.find(c => c.status === 'fail');

  return (
    <>
      <div className="card-elevated overflow-hidden animate-fade-in">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xs font-mono text-muted-foreground">{manuscript.id}</span>
                <StatusBadge status={manuscript.status} />
              </div>
              <h3 className="font-semibold text-foreground truncate pr-4">{manuscript.title}</h3>
              <p className="text-sm text-muted-foreground">
                {manuscript.authors.join(', ')} • {manuscript.journal}
              </p>
            </div>
          </div>
          <ChevronDown className={cn(
            'h-5 w-5 text-muted-foreground transition-transform',
            isExpanded && 'rotate-180'
          )} />
        </button>

        {isExpanded && (
          <div className="border-t border-border p-4 space-y-4 animate-fade-in">
            {/* Pre-screening Checks */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Pre-Screening Checks</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {manuscript.preScreeningChecks.map((check) => (
                  <div
                    key={check.name}
                    className={cn(
                      'p-3 rounded-lg border',
                      check.status === 'pass' && 'bg-success/5 border-success/20',
                      check.status === 'warning' && 'bg-warning/5 border-warning/20',
                      check.status === 'fail' && 'bg-destructive/5 border-destructive/20'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground">{check.name}</span>
                      <StoplightIndicator status={check.status} score={check.score} size="sm" />
                    </div>
                    {check.details && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{check.details}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sent Back Details */}
            {manuscript.status === 'sent-back' && manuscript.sentBackReason && (
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-destructive mb-1">
                      Failed: {manuscript.sentBackReason}
                    </h4>
                    <p className="text-sm text-foreground/80 mb-3">{manuscript.sentBackDetails}</p>
                    
                    {manuscript.sentBackReason === 'Plagiarism Check' && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <ExternalLink className="h-4 w-4" />
                        <a href="#" className="text-accent hover:underline">
                          View similar publication: "Smart Grid Integration Strategies" (IEEE, 2023)
                        </a>
                      </div>
                    )}
                    
                    {manuscript.sentBackReason === 'Journal Scope' && (
                      <div className="bg-card rounded p-3 mb-3">
                        <p className="text-xs font-medium text-foreground mb-2">Recommended Journals:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Journal of Social Media Studies</li>
                          <li>• Media & Communication Quarterly</li>
                          <li>• Digital Sociology Review</li>
                        </ul>
                      </div>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowEmailModal(true)}
                      className="gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      View Email Sent to Author
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Manuscript Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Submitted:</span>
                <span className="ml-2 text-foreground">{manuscript.submissionDate}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Keywords:</span>
                <span className="ml-2 text-foreground">{manuscript.keywords.slice(0, 3).join(', ')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            {manuscript.status === 'ready' && showAssignButton && (
              <div className="flex justify-end pt-2 border-t border-border">
                <Button
                  onClick={() => navigate('/editor-assignment', { state: { manuscriptId: manuscript.id } })}
                  className="gap-2"
                >
                  Assign Executive & Associate Editors
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {manuscript.status === 'ready-for-peer-review' && (
              <div className="flex justify-end pt-2 border-t border-border">
                <Button
                  onClick={() => navigate('/peer-reviewer-assignment', { state: { manuscriptId: manuscript.id } })}
                  className="gap-2"
                >
                  Assign Peer Reviewers
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Email Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Email Sent to Author</DialogTitle>
            <DialogDescription>
              Regarding manuscript {manuscript.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div className="text-sm">
                <span className="font-medium text-foreground">To:</span>
                <span className="ml-2 text-muted-foreground">{manuscript.authors[0]}</span>
              </div>
              <div className="text-sm">
                <span className="font-medium text-foreground">Subject:</span>
                <span className="ml-2 text-muted-foreground">
                  Submission {manuscript.id} - Pre-Screening Results
                </span>
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <p>Dear {manuscript.authors[0]},</p>
              <p>
                Thank you for submitting your manuscript titled "{manuscript.title}" 
                to {manuscript.journal}.
              </p>
              <p>
                After careful pre-screening, we regret to inform you that your submission 
                cannot proceed to peer review due to the following reason:
              </p>
              <div className="bg-destructive/10 border border-destructive/20 rounded p-3 my-3">
                <p className="font-medium text-destructive mb-1">{manuscript.sentBackReason}</p>
                <p className="text-sm">{manuscript.sentBackDetails}</p>
              </div>
              {manuscript.sentBackReason === 'Journal Scope' && (
                <p>
                  We believe your research would be better suited for journals focusing on 
                  social media studies or general media communication. Please consider 
                  submitting to the recommended journals listed in your submission portal.
                </p>
              )}
              <p>
                If you have questions about this decision, please contact the editorial office.
              </p>
              <p>
                Best regards,<br />
                Editorial Office<br />
                {manuscript.journal}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
