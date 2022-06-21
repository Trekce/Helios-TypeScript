import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const tempProgress = 0;

export default function Sfp() {
  const [status, setStatus] = useState('Not Started');
  const [progress, setProgress] = useState(tempProgress);

  function start() {
    setStatus('Running');
  }

  return (
    <>
      {status === 'Not Started' && (
        <div>
          <h2>SFP Test</h2>
          <button className="button-main" type="button" onClick={() => start()}>
            Start Test
          </button>
        </div>
      )}
      {status === 'Running' && (
        <div>
          <span className="progress">
            <div style={{ width: `${100 * (progress / 46)}%` }} />
          </span>
        </div>
      )}
      {status === 'Completed' && <div />}
    </>
  );
}
