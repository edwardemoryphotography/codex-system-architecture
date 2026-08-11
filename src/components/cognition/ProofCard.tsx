import type { ProofCardData } from '../../types/cognition';

export function ProofCard({ card }: { card: ProofCardData }) {
  return (
    <article className="cognition-proof-card">
      <span className="cognition-proof-card__status">{card.status}</span>
      <p>{card.label}</p>
      <strong>{card.value}</strong>
      <small>{card.detail}</small>
    </article>
  );
}
