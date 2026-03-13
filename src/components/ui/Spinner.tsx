interface SpinnerProps {
  fullPage?: boolean;
}

export default function Spinner({ fullPage }: SpinnerProps) {
  const spinner = (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div className="spinner" aria-label="Loading..." role="status" />
    </div>
  );

  if (fullPage) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <div className="spinner" aria-label="Loading..." role="status" />
      </div>
    );
  }

  return spinner;
}
