export function MemoryEchoLayer({ echoes }: { echoes: string[] }) {
  return (
    <ol className="memory-echo-layer" aria-label="Memory echoes">
      {echoes.map((echo, index) => (
        <li key={echo} style={{ '--echo-index': index } as React.CSSProperties}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          {echo}
        </li>
      ))}
    </ol>
  );
}
