import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { StoplightIndicator } from '@/components/StoplightIndicator';
import { eeManuscripts, mockAIEvaluation } from '@/data/mockData';
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
  Clock, 
  FileText, 
  Brain, 
  CheckCircle, 
  XCircle,
  Sparkles,
  Target,
  Lightbulb,
  Shield,
  PenTool,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ManuscriptReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const manuscriptId = location.state?.manuscriptId || 'MS-2024-001';
  
  const manuscript = eeManuscripts.find(m => m.id === manuscriptId) || eeManuscripts[0];
  
  const [showAIEvaluation, setShowAIEvaluation] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectComments, setRejectComments] = useState('');
  const [selectedSummary, setSelectedSummary] = useState('5min');

  const summaries = {
    '5min': `This manuscript presents a comprehensive review of machine learning applications in climate modeling. The authors examine neural network architectures for weather prediction and long-term climate projections. Key findings include improved accuracy in 10-day forecasts using transformer-based models and novel ensemble methods for uncertainty quantification.`,
    '10min': `This manuscript presents a comprehensive review of machine learning applications in climate modeling, with particular focus on neural network architectures for weather prediction and long-term climate projections.

The authors systematically analyze three main categories of ML approaches: (1) convolutional neural networks for spatial pattern recognition in atmospheric data, (2) recurrent architectures including LSTMs and transformers for temporal sequence modeling, and (3) hybrid physics-informed neural networks that incorporate domain knowledge.

Key findings indicate that transformer-based models achieve 15% improvement in 10-day forecast accuracy compared to traditional numerical weather prediction. The review also introduces novel ensemble methods for uncertainty quantification in climate projections extending to 2100.

The methodology is rigorous, with meta-analysis of 127 studies spanning 2018-2024. Limitations include the computational cost of large-scale models and the challenge of interpretability in black-box systems.`,
    '15min': `This manuscript presents a comprehensive review of machine learning applications in climate modeling, examining the state-of-the-art in neural network architectures for weather prediction and long-term climate projections. The work fills an important gap in the literature by providing a systematic comparison of ML approaches across different temporal and spatial scales.

METHODOLOGY:
The authors conducted a meta-analysis of 127 peer-reviewed studies from 2018-2024, categorizing approaches into three main frameworks:
1. Convolutional Neural Networks (CNNs) for spatial pattern recognition in atmospheric reanalysis data
2. Recurrent architectures (LSTMs, GRUs, Transformers) for temporal sequence modeling
3. Physics-Informed Neural Networks (PINNs) that incorporate conservation laws and domain constraints

KEY FINDINGS:
- Transformer-based models demonstrate 15% improvement in 10-day forecast accuracy compared to ECMWF's IFS system
- Hybrid physics-ML models show promise for century-scale climate projections with reduced systematic biases
- Novel ensemble methods for uncertainty quantification provide calibrated probability distributions
- Computational requirements for state-of-the-art models remain 100x higher than operational forecasting systems

CRITICAL ANALYSIS:
The review identifies several challenges: interpretability of deep learning predictions, generalization to out-of-distribution climate scenarios, and the risk of overfitting to historical patterns that may not persist under climate change.

The authors propose a research roadmap including federated learning for distributed climate data, foundation models for Earth system science, and improved methods for attribution of extreme weather events.

CONCLUSION:
This review will serve as a valuable reference for researchers and practitioners seeking to apply ML methods to climate science while being aware of current limitations and future directions.`,
  };

  const evaluationItems = [
    { key: 'journalFit', label: 'Journal Fit & Scope', icon: Target, data: mockAIEvaluation.journalFit },
    { key: 'scholarlyMerit', label: 'Scholarly Merit', icon: Lightbulb, data: mockAIEvaluation.scholarlyMerit },
    { key: 'originality', label: 'Originality', icon: Sparkles, data: mockAIEvaluation.originality },
    { key: 'technicalIntegrity', label: 'Technical Integrity', icon: PenTool, data: mockAIEvaluation.technicalIntegrity },
    { key: 'riskSensitivity', label: 'Risk & Sensitivity', icon: Shield, data: mockAIEvaluation.riskSensitivity },
  ];

  const handleAccept = () => {
    toast.success('Manuscript accepted for peer review', {
      description: 'The manuscript has been sent to the Editorial Office for reviewer assignment.'
    });
    navigate('/post-ee-worklist');
  };

  const handleReject = () => {
    toast.info('Manuscript returned to author', {
      description: 'Comments have been sent to the Editorial Office.'
    });
    setShowRejectModal(false);
    navigate('/post-ee-worklist');
  };

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/ee-workspace')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workspace
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{manuscript.id}</Badge>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {manuscript.journal}
                </Badge>
              </div>
              <h1 className="text-xl font-bold text-foreground mb-2">{manuscript.title}</h1>
              <p className="text-muted-foreground">{manuscript.authors.join(', ')}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pre-screening Summary */}
            <div className="card-elevated p-4">
              <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Pre-Screening Summary
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {manuscript.preScreeningChecks.map((check) => (
                  <div key={check.name} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                    <span className="text-sm text-foreground">{check.name}</span>
                    <StoplightIndicator status={check.status} score={check.score} size="sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* AI Summaries */}
            <div className="card-elevated p-4">
              <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                AI-Generated Summary
              </h2>
              <Tabs value={selectedSummary} onValueChange={setSelectedSummary}>
                <TabsList className="mb-4">
                  <TabsTrigger value="5min" className="gap-2">
                    <Clock className="h-4 w-4" />
                    5-min read
                  </TabsTrigger>
                  <TabsTrigger value="10min" className="gap-2">
                    <Clock className="h-4 w-4" />
                    10-min read
                  </TabsTrigger>
                  <TabsTrigger value="15min" className="gap-2">
                    <Clock className="h-4 w-4" />
                    15-min read
                  </TabsTrigger>
                </TabsList>
                {Object.entries(summaries).map(([key, content]) => (
                  <TabsContent key={key} value={key} className="mt-0">
                    <div className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-line">
                      {content}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* AI Evaluation Button */}
            <Button 
              variant="outline" 
              className="w-full gap-2 h-12"
              onClick={() => setShowAIEvaluation(true)}
            >
              <Brain className="h-5 w-5 text-accent" />
              View Automated Manuscript Evaluation
            </Button>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Metadata */}
            <div className="card-elevated p-4">
              <h3 className="font-semibold text-foreground mb-3">Manuscript Details</h3>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Submitted</dt>
                  <dd className="text-foreground font-medium">{manuscript.submissionDate}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Decision Deadline</dt>
                  <dd className="text-foreground font-medium">{manuscript.decisionDeadline}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Keywords</dt>
                  <dd className="flex flex-wrap gap-1 mt-1">
                    {manuscript.keywords.map((kw) => (
                      <Badge key={kw} variant="secondary" className="text-xs">{kw}</Badge>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Decision Buttons */}
            <div className="card-elevated p-4 space-y-3">
              <h3 className="font-semibold text-foreground mb-3">Editorial Decision</h3>
              <Button 
                className="w-full gap-2" 
                variant="success"
                onClick={handleAccept}
              >
                <CheckCircle className="h-4 w-4" />
                Accept for Peer Review
              </Button>
              <Button 
                variant="destructive" 
                className="w-full gap-2"
                onClick={() => setShowRejectModal(true)}
              >
                <XCircle className="h-4 w-4" />
                Reject & Send to Author
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Evaluation Modal */}
      <Dialog open={showAIEvaluation} onOpenChange={setShowAIEvaluation}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-accent" />
              Automated Manuscript Evaluation
            </DialogTitle>
            <DialogDescription>
              AI-assisted assessment across key evaluation dimensions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {evaluationItems.map(({ key, label, icon: Icon, data }) => (
              <div key={key} className="card-elevated p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-foreground">{label}</h4>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold',
                          data.score >= 90 ? 'bg-success/20 text-success' :
                          data.score >= 75 ? 'bg-warning/20 text-warning' :
                          'bg-destructive/20 text-destructive'
                        )}>
                          {data.score}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{data.rationale}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Reject Manuscript
            </DialogTitle>
            <DialogDescription>
              Please provide comments explaining the rejection decision.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter your comments for the author..."
              value={rejectComments}
              onChange={(e) => setRejectComments(e.target.value)}
              className="min-h-[150px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default ManuscriptReview;
