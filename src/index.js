import * as THREE from 'three';
import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import ReactDOM from 'react-dom';
import { Canvas, useRender } from 'react-three-fiber';

import './styles.scss';

function randomColor() {
  const colors = ['#D62839', '#959897', '#E2E2E2'];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * @param {React.ComponentProps<"button">} props
 */
function Button(props) {
  return <button className="Button" {...props} />;
}

const globals = { isRunning: true };

function Thingy(props) {
  let group = useRef();
  let theta = 0;

  globals.isRunning = props.isRunning;

  useRender(() => {
    if (globals.isRunning) {
      const r = 1 * Math.sin(THREE.Math.degToRad((theta += 0.2)));
      const s = Math.cos(THREE.Math.degToRad(theta * 2));
      group.current.rotation.set(r, r, r);
      group.current.scale.set(s, s, s);
    }
  });

  const balls = useMemo(() => {
    return new Array(20)
      .fill()
      .map(i => [
        Math.random() * 500 - 25,
        Math.random() * 500 - 25,
        Math.random() * 500 - 50,
      ])
      .map((pos, i) => (
        <mesh key={'b' + i} visible position={pos}>
          <sphereGeometry attach="geometry" args={[20, 32, 32]} />
          <meshLambertMaterial attach="material" color={randomColor()} />
        </mesh>
      ));
  }, []);

  return (
    <group ref={group} position={[50, 50, 0]}>
      {balls}
    </group>
  );
}

function Main() {
  const [isRunning, setIsRunning] = useState(true);

  const toggleIsRunning = useCallback(
    () => setIsRunning(isRunning => !isRunning),
    []
  );

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === ' ') {
        toggleIsRunning();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleIsRunning]);

  return (
    <>
      <Canvas
        invalidateFrameLoop
        pixelRatio={window.devicePixelRatio}
        camera={{
          near: 0.2,
          far: 1000,
          position: [50, 50, 90],
        }}
      >
        <ambientLight intensity={0.7} />
        <spotLight intensity={0.5} position={[50, 50, 1000]} />
        <Thingy isRunning={isRunning} />
      </Canvas>
      <Button
        onClick={toggleIsRunning}
        style={{ position: 'absolute', left: 10, top: 10 }}
      >
        {isRunning ? 'pause' : 'run'}
      </Button>
    </>
  );
}

ReactDOM.render(<Main />, document.getElementById('root'));
