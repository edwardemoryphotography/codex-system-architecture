import type { CodexGraphNode } from '../../types/cognition';

interface CodexGraphProps {
  nodes: CodexGraphNode[];
  selectedNodeId: string | null;
  onSelect: (id: string) => void;
}

export function CodexGraph({ nodes, selectedNodeId, onSelect }: CodexGraphProps) {
  const selectedNode = nodes.find(({ id }) => id === selectedNodeId) ?? nodes[0];

  return (
    <div className="codex-graph">
      <div className="codex-graph__map" aria-label="Interactive Codex knowledge graph">
        <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none">
          {nodes.flatMap((source) =>
            source.connections.map((targetId) => {
              const target = nodes.find(({ id }) => id === targetId);
              return target ? (
                <line key={`${source.id}-${target.id}`} x1={source.x} y1={source.y} x2={target.x} y2={target.y} />
              ) : null;
            }),
          )}
        </svg>
        {nodes.map((node) => (
          <button
            key={node.id}
            aria-pressed={node.id === selectedNode.id}
            className="codex-graph__node"
            onClick={() => onSelect(node.id)}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            type="button"
          >
            {node.label}
          </button>
        ))}
      </div>
      <aside className="codex-graph__detail" aria-live="polite">
        <span>Selected node</span>
        <strong>{selectedNode.label}</strong>
        <p>{selectedNode.summary}</p>
      </aside>
    </div>
  );
}
