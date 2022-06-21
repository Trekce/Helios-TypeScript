import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const alert = withReactContent(Swal);

let tmpStatus = 'Incomplete';

export default function Esd() {
  const [status, setStatus] = useState('Incomplete');

  function help() {
    alert.fire({
      html: `<div>
        If test does not seem to work, check wrist strap and grounding wire
        connections to strap and tester
      </div>`,
    });
  }

  function esdSubmit() {
    alert.fire({
      toast: true,
      timerProgressBar: true,
      timer: 3000,
      icon: 'success',
      text: 'Submission Successful',
      position: 'top-end',
      showConfirmButton: false,
    });
    tmpStatus = 'Incomplete';
    setStatus(tmpStatus);
  }

  function esdClear() {
    tmpStatus = 'Incomplete';
    setStatus(tmpStatus);
  }

  function receiveData(e: MessageEvent) {
    if (e.data.channel === 'serial-data') {
      if (e.data.data.trim() === '1' && tmpStatus === 'Incomplete') {
        tmpStatus = 'Complete';
        setStatus(tmpStatus);

        console.log(tmpStatus);
      }
    }
  }

  useEffect(() => {
    window.addEventListener('message', receiveData);
    return () => {
      tmpStatus = 'Incomplete';
      window.removeEventListener('message', receiveData);
    };
  }, []);

  return (
    <>
      {status === 'Incomplete' && (
        <div>
          <h2>ESD Test</h2>
          <span>
            Press and hold the button on the tester until this screen updates
          </span>
          <span>
            <button type="button" onClick={() => help()}>
              Help
            </button>
          </span>
        </div>
      )}
      {status === 'Complete' && (
        <div>
          <h2>Pass/Fail</h2>
          <div style={{ marginBottom: '-40px' }}>Username</div>
          <input type="text" id="usernameInput" />
          <div>
            <button type="submit" onClick={() => esdSubmit()}>
              Submit
            </button>
            <button type="submit" onClick={() => esdClear()}>
              Clear
            </button>
          </div>
        </div>
      )}
    </>
  );
}
