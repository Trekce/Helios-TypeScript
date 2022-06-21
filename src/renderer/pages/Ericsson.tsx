import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

let tempProgress = 0;

export default function Ericsson() {
  const [status, setStatus] = useState('Not Started');
  const [progress, setProgress] = useState(tempProgress);

  function startGetAllInfo() {
    setStatus('Running');
    window.electron.ericsson.getAllInfo();
  }

  function startGetProductInfo() {
    setStatus('Running');
    window.electron.ericsson.getProductInfo();
  }

  function moreDetails() {
    Swal.fire({
      title: 'More details screen',
    });
  }

  function clear() {
    setStatus('Not Started');
  }

  function handlePostTest(msg: MessageEvent) {
    if (msg.data === 'ericssonTestProgress') {
      tempProgress += 1;
      setProgress(tempProgress);
    }
    if (msg.data === 'ericssonTestComplete') {
      setProgress(0);
      tempProgress = 0;
      setStatus('Completed');
    }
    document.getElementById('usernameInput')?.focus();
  }

  useEffect(() => {
    window.addEventListener('message', handlePostTest);

    // returned function will be called on component unmount
    return () => {
      window.removeEventListener('message', handlePostTest);
    };
  }, []);

  return (
    <>
      {status === 'Not Started' && (
        <div>
          <h2>Ericsson Test</h2>
          <button
            className="button-main"
            type="button"
            onClick={() => startGetAllInfo()}
          >
            All Info
          </button>
          <button
            className="button-main"
            type="button"
            onClick={() => startGetProductInfo()}
          >
            Product Info
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
      {status === 'Completed' && (
        <div>
          <h2>Pass/Fail</h2>
          <span className="ericssonDetails">
            <span>Part Number</span>
            <span id="itemNumber">KRC161669/3</span>
          </span>
          <span className="ericssonDetails">
            <span>Serial Number</span>
            <span id="serialNumber">C12345678</span>
          </span>
          <span>
            <button
              type="button"
              className="button-secondary"
              onClick={() => moreDetails()}
            >
              More Details
            </button>
          </span>
          <span>Username</span>
          <input type="text" name="username" id="usernameInput" />
          <span>Asset Number</span>
          <input type="text" name="assetNumber" id="assetNumberInput" />
          <div>
            <button className="button-ericsson-submit" type="submit">
              Submit
            </button>
            <button
              className="button-ericsson-submit"
              type="submit"
              onClick={() => clear()}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </>
  );
}
