import type { CognitionSlidePayload as Payload } from '../../types/cognition';
import { CodexGraph } from './CodexGraph';
import { MemoryEchoLayer } from './MemoryEchoLayer';
import { ProofCard } from './ProofCard';
import { RealityContactPanel } from './RealityContactPanel';

interface CognitionSlidePayloadProps {
  payload: Payload;
  selectedNodeId: string | null;
  onNodeSelect: (id: string) => void;
  recoveryScore: number;
  onRecoveryScoreChange: (score: number) => void;
}

export function CognitionSlidePayload({
  payload,
  selectedNodeId,
  onNodeSelect,
  recoveryScore,
  onRecoveryScoreChange,
}: CognitionSlidePayloadProps) {
  switch (payload.kind) {
    case 'proof':
      return <div className="cognition-proof-grid">{payload.cards.map((card) => <ProofCard key={card.id} card={card} />)}</div>;
    case 'graph':
      return <CodexGraph nodes={payload.nodes} selectedNodeId={selectedNodeId} onSelect={onNodeSelect} />;
    case 'memory':
      return <MemoryEchoLayer echoes={payload.echoes} />;
    case 'reality':
      return <RealityContactPanel recoveryScore={recoveryScore} onRecoveryScoreChange={onRecoveryScoreChange} />;
    case 'collapse':
      return <p className="cognition-collapse-mark" aria-hidden="true">•</p>;
  }
}
