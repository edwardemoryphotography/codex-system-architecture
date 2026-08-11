import { routeEnergy } from '../../lib/cognitionPersistence';

interface RealityContactPanelProps {
  recoveryScore: number;
  onRecoveryScoreChange: (score: number) => void;
}

export function RealityContactPanel({ recoveryScore, onRecoveryScoreChange }: RealityContactPanelProps) {
  const route = routeEnergy(recoveryScore);

  return (
    <section className="reality-contact-panel" aria-label="Reality contact energy router">
      <div>
        <p>Today’s recovery signal</p>
        <label htmlFor="recovery-score">Recovery score</label>
        <input
          id="recovery-score"
          max="100"
          min="0"
          onChange={(event) => onRecoveryScoreChange(Number(event.target.value))}
          type="number"
          value={recoveryScore}
        />
      </div>
      <div className="reality-contact-panel__route">
        <span>{route.mode}</span>
        <strong>{route.sessionCapMin} minute session cap</strong>
        <p>Break every {route.breakFrequencyMin} minutes. {route.guidance}</p>
      </div>
      <ul>
        <li>Trader Joe’s: 2–10 PM shifts</li>
        <li>Astrophotography: night work and long exposures</li>
        <li>Recovery: a constraint worth designing around</li>
        <li>Build sessions: bounded proof over ambient effort</li>
      </ul>
    </section>
  );
}
