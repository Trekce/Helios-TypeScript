/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState, useRef, RefObject } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import backdrop from '../../assets/backdrop.png';
import './App.css';

function Main() {
  const ipc = window.electron.ipcRenderer;

  const mover = useRef<HTMLDivElement | HTMLElement>(null);
  const drawer = useRef<HTMLDivElement | HTMLElement>(null);
  const drawerButton = useRef<HTMLDivElement | HTMLElement>(null);
  const selectionButtons = useRef<HTMLDivElement | HTMLElement>(null);
  const indicator = useRef<SVGSVGElement>(null);
  const [selectionButtonsVisible, setSelectionButtonsVisible] = useState(true);
  const [draggable, setDraggable] = useState(false);
  const [showDrawer, toggleShowDrawer] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCounter, selectCounter] = useState<string>('');
  const [count, setCount] = useState({
    Michael: 0,
    Alex: 0,
    Melissa: 0,
    MJ: 0,
  });

  useEffect(() => {
    ipc.sendMessage('ipc', 'getDeaths');

    ipc.on('ipc', (args) => {
      const { Alex, MJ, Michael, Melissa, Total } = args;
      setCount({ Alex, MJ, Michael, Melissa });
    });

    selectionButtons.current?.classList.remove('hide');
    indicator.current?.classList.add('hide');
  }, []);

  function toggleDrag() {
    if (!draggable) {
      mover.current?.classList.remove('hide');
    } else {
      mover.current?.classList.add('hide');
      ipc.sendMessage('ipc', ['updateWindowLocation']);
    }
    setDraggable(!draggable);
  }

  function toggleDrawer() {
    if (!showDrawer) {
      drawer.current?.classList.add('drawer_open');
      drawerButton.current?.classList.add('icon_flip');
    } else {
      drawer.current?.classList.remove('drawer_open');
      drawerButton.current?.classList.remove('icon_flip');
    }
    toggleShowDrawer(!showDrawer);
  }

  function toggleCounterSelection() {
    setSelectionButtonsVisible(!selectionButtonsVisible);
    if (selectionButtonsVisible) {
      selectionButtons.current?.classList.add('hide');
      indicator.current?.classList.remove('hide');
    } else {
      selectionButtons.current?.classList.remove('hide');
      indicator.current?.classList.add('hide');
    }
    toggleShowDrawer(false);
    drawer.current?.classList.remove('drawer_open');
    drawerButton.current?.classList.remove('icon_flip');
  }

  const closeApp = () => {
    ipc.sendMessage('ipc', ['closeApp']);
  };

  function settings() {
    const mainSettings = () => {
      return (
        <>
          <div className="row">
            <button type="button" onClick={toggleDrag}>
              Move Window
            </button>
          </div>
          <div className="row">
            <button type="button" onClick={toggleCounterSelection}>
              Select Your Counter
            </button>
          </div>
          <div className="row">
            <button type="button" onClick={closeApp}>
              Exit
            </button>
          </div>
        </>
      );
    };

    return (
      <div className="drawer" ref={drawer as RefObject<HTMLDivElement>}>
        {mainSettings()}
      </div>
    );
  }

  const counterSelection = () => {
    function select(name: string, position: string) {
      selectCounter(name);
      toggleCounterSelection();
      indicator.current?.classList.remove('first');
      indicator.current?.classList.remove('second');
      indicator.current?.classList.remove('third');
      indicator.current?.classList.remove('fourth');
      indicator.current?.classList.add(position);
      ipc.sendMessage('ipc', ['select', name]);
    }

    return (
      <div
        ref={selectionButtons as RefObject<HTMLDivElement>}
        className="counterSelection hide"
      >
        <button type="button" onClick={() => select('Michael', 'first')} />
        <button type="button" onClick={() => select('Melissa', 'second')} />
        <button type="button" onClick={() => select('Alex', 'third')} />
        <button type="button" onClick={() => select('MJ', 'fourth')} />
      </div>
    );
  };

  return (
    <div className="main_content">
      <div
        id="mover"
        ref={mover as RefObject<HTMLDivElement>}
        className="mover hide"
      >
        <span>Drag Me</span>
        <button type="button" onClick={toggleDrag}>
          Save
        </button>
      </div>
      <div>
        <FontAwesomeIcon
          ref={indicator as RefObject<SVGSVGElement>}
          className="chosenCounterIndicator first"
          icon={faChevronLeft}
        />
      </div>
      <div className="counters">
        <div className="row">
          <span className="row_data">
            <span className="name">Michael</span>
            <span className="count">{count.Michael}</span>
          </span>
          <span className="row_img">
            <img className="backdrop" src={backdrop} alt="" />
          </span>
        </div>
        <div className="row">
          <span className="row_data">
            <span className="name">Melissa</span>
            <span className="count">{count.Melissa}</span>
          </span>
          <span className="row_img">
            <img className="backdrop" src={backdrop} alt="" />
          </span>
        </div>
        <div className="row">
          <span className="row_data">
            <span className="name">Alex</span>
            <span className="count">{count.Alex}</span>
          </span>
          <span className="row_img">
            <img className="backdrop" src={backdrop} alt="" />
          </span>
        </div>
        <div className="row">
          <span className="row_data">
            <span className="name">MJ</span>
            <span className="count">{count.MJ}</span>
          </span>
          <span className="row_img">
            <img className="backdrop" src={backdrop} alt="" />
          </span>
        </div>
      </div>
      <div
        className="drawer-toggle"
        ref={drawerButton as RefObject<HTMLDivElement>}
      >
        <FontAwesomeIcon
          className="icon"
          icon={faChevronDown}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={toggleDrawer}
        />
      </div>
      {settings()}
      {counterSelection()}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Router>
  );
}
