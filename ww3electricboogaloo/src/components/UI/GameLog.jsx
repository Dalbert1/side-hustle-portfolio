import React, { useRef, useEffect } from 'react';

const GameLog = ({ log }) => {
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  return (
    <div className="game-log">
      <h4>Game Log</h4>
      <div className="log-entries">
        {log.slice(-30).map((entry, index) => (
          <div
            key={index}
            className={`log-entry ${entry.startsWith('---') ? 'round-marker' : ''}`}
          >
            {entry}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default GameLog;
