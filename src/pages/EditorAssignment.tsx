import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { mockManuscripts, mockExecutiveEditors, mockAssociateEditors } from '@/data/mockData';
import { Editor } from '@/types/manuscript';
import { 
  ArrowLeft, 
  CheckCircle, 
  User, 
  Briefcase, 
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const EditorAssignment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const manuscriptId = location.state?.manuscriptId || 'MS-2024-001';
  
  const manuscript = mockManuscripts.find(m => m.id === manuscriptId) || mockManuscripts[0];
  const isAutoAssignment = manuscriptId === 'MS-2024-001';

  const [selectedEE, setSelectedEE] = useState<string | null>(
    isAutoAssignment ? mockExecutiveEditors[0].id : null
  );
  const [selectedAEs, setSelectedAEs] = useState<string[]>(
    isAutoAssignment 
      ? mockAssociateEditors.filter(ae => ae.isAutoAssigned).map(ae => ae.id)
      : []
  );

  const handleAEToggle = (aeId: string) => {
    setSelectedAEs(prev => 
      prev.includes(aeId) 
        ? prev.filter(id => id !== aeId)
        : [...prev, aeId]
    );
  };

  const handleAssign = () => {
    toast.success('Editors assigned successfully', {
      description: `${manuscript.id} has been assigned to the selected editors.`
    });
    navigate('/ee-workspace');
  };

  const EditorCard = ({ editor, type, isSelected, onSelect }: { 
    editor: Editor; 
    type: 'ee' | 'ae';
    isSelected: boolean;
    onSelect: () => void;
  }) => (
    <div
      className={cn(
        'card-elevated p-4 cursor-pointer transition-all',
        isSelected && 'ring-2 ring-primary',
        type === 'ee' ? 'hover:shadow-md' : ''
      )}
      onClick={onSelect}
    >
      <div className="flex items-start gap-3">
        {type === 'ae' && (
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={() => onSelect()}
            className="mt-1"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-foreground">{editor.name}</h4>
            {editor.isAutoAssigned && (
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 gap-1">
                <Sparkles className="h-3 w-3" />
                Auto-assigned
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-2">{editor.affiliation}</p>
          
          <div className="flex items-center gap-4 text-sm mb-2">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="font-medium text-success">{editor.matchPercentage}% match</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>Workload: {editor.workload}</span>
            </div>
            {editor.pastHandlingHistory && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{editor.pastHandlingHistory} handled</span>
              </div>
            )}
          </div>
          
          {editor.matchReason && (
            <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
              {editor.matchReason}
            </p>
          )}
          
          <div className="flex flex-wrap gap-1 mt-2">
            {editor.expertise.map((exp) => (
              <Badge key={exp} variant="secondary" className="text-xs">
                {exp}
              </Badge>
            ))}
          </div>
        </div>
        {type === 'ee' && (
          <div className={cn(
            'h-6 w-6 rounded-full border-2 flex items-center justify-center',
            isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
          )}>
            {isSelected && <CheckCircle className="h-4 w-4 text-primary-foreground" />}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Worklist
          </Button>
          <h1 className="text-2xl font-bold text-foreground mb-2">Editor Assignment</h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{manuscript.id}</Badge>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground truncate">{manuscript.title}</span>
          </div>
        </div>

        {/* Assignment Type Banner */}
        <div className={cn(
          'rounded-lg p-4 mb-6',
          isAutoAssignment ? 'bg-success/10 border border-success/20' : 'bg-accent/10 border border-accent/20'
        )}>
          <div className="flex items-center gap-3">
            {isAutoAssignment ? (
              <>
                <Sparkles className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium text-foreground">Automatic Assignment</p>
                  <p className="text-sm text-muted-foreground">
                    High confidence match (&gt;90%) detected. Executive Editor and Associate Editors have been pre-selected.
                  </p>
                </div>
              </>
            ) : (
              <>
                <User className="h-5 w-5 text-accent" />
                <div>
                  <p className="font-medium text-foreground">Manual Selection Required</p>
                  <p className="text-sm text-muted-foreground">
                    Please select an Executive Editor and Associate Editors from the candidates below.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Executive Editors */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Executive Editor Candidates ({mockExecutiveEditors.length})
          </h2>
          <div className="grid gap-4">
            {mockExecutiveEditors.map((editor) => (
              <EditorCard
                key={editor.id}
                editor={editor}
                type="ee"
                isSelected={selectedEE === editor.id}
                onSelect={() => setSelectedEE(editor.id)}
              />
            ))}
          </div>
        </div>

        {/* Associate Editors */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Associate Editor Candidates ({mockAssociateEditors.length})
            <span className="text-sm font-normal text-muted-foreground ml-2">
              {selectedAEs.length} selected
            </span>
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {mockAssociateEditors.map((editor) => (
              <EditorCard
                key={editor.id}
                editor={editor}
                type="ae"
                isSelected={selectedAEs.includes(editor.id)}
                onSelect={() => handleAEToggle(editor.id)}
              />
            ))}
          </div>
        </div>

        {/* Action Bar */}
        <div className="sticky bottom-0 bg-background border-t border-border p-4 -mx-6 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{selectedEE ? 1 : 0}</span> Executive Editor, 
            <span className="font-medium text-foreground ml-1">{selectedAEs.length}</span> Associate Editors selected
          </div>
          <Button
            onClick={handleAssign}
            disabled={!selectedEE || selectedAEs.length === 0}
            className="gap-2"
          >
            Assign Editors
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default EditorAssignment;
