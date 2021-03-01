import './App.scss';
import { useEffect, useState, useRef } from 'react';

// import { Popover, Button } from 'antd';

import React from 'react';
// import { render } from 'react-dom';
import { Stage, Layer, Circle, Shape } from 'react-konva';

function generateTargets() {
  return [...Array(10)].map((_, i) => ({
    id: 'target-' + i.toString(),
    x: (Math.random() * 0.8 + 0.1) * window.innerWidth,
    y: (Math.random() * 0.8 + 0.1) * window.innerHeight,
    isDragging: false,
  }));
}
function generateConnectors() {
  var number = 0;
  var result = [];
  while (result.length < number) {
    var from = 'target-' + Math.floor(Math.random() * INITIAL_TARGET_STATE.length);
    var to = 'target-' + Math.floor(Math.random() * INITIAL_TARGET_STATE.length);
    if (from === to) {
      continue;
    }
    result.push({
      id: 'connector-' + result.length,
      from: from,
      to: to,
    });
  }
  return result;
}
function getControlPoints(startPoint, endPoint) {
  const controlPoint1 = [(startPoint[0] + endPoint[0]) / 2, startPoint[1]];
  const controlPoint2 = [(startPoint[0] + endPoint[0]) / 2, endPoint[1]];
  return [controlPoint1, controlPoint2];
}

const INITIAL_TARGET_STATE = generateTargets();
const INITIAL_CONNECTOR_STATE = generateConnectors();
const GRID_SIZE = 50;
function App() {
  const outer = useRef(null);
  const [toolType, setToolType] = useState('drag');
  const [targets] = React.useState(INITIAL_TARGET_STATE);
  const [connectors, setConnectors] = React.useState(INITIAL_CONNECTOR_STATE);
  let connectorCandidates = [];
  let disconnectorCandidates = [];

  const handleMouseDown = (e) => {
    const layer = outer.current.getLayer();
    const node = layer.findOne('#' + e.target.id());
    node.draggable(toolType === 'drag');

    if (toolType === 'connect') {
      if (connectorCandidates.length < 2) {
        connectorCandidates.push(e.target.id());
      }
      if (connectorCandidates.length === 2) {
        // make connection
        if (
          connectors.filter(
            (x) =>
              (x.from === connectorCandidates[0] && x.to === connectorCandidates[1]) ||
              (x.from === connectorCandidates[1] && x.to === connectorCandidates[0])
          ).length === 0
        )
          addConnector();

        connectorCandidates = [];
      }
    }

    if (toolType === 'disconnect') {
      if (disconnectorCandidates.length < 2) {
        disconnectorCandidates.push(e.target.id());
      }
      if (disconnectorCandidates.length === 2) {
        console.log(disconnectorCandidates);
        // make connection
        if (
          connectors.filter(
            (x) =>
              (x.from === disconnectorCandidates[0] && x.to === disconnectorCandidates[1]) ||
              (x.from === disconnectorCandidates[1] && x.to === disconnectorCandidates[0])
          ).length === 1
        )
          removeConnector();

        disconnectorCandidates = [];
      }
    }
  };

  function addConnector() {
    console.log('add new connection');
    const newConnector = {
      id: 'connector-' + connectors.length,
      from: connectorCandidates[0],
      to: connectorCandidates[1],
    };
    setConnectors([...connectors, newConnector]);
    const newConnectors = [...connectors, newConnector];
    const layer = outer.current.getLayer();
    newConnectors.forEach((connect, index) => {
      var line = layer.findOne('#' + connect.id);
      var fromNode = layer.findOne('#' + connect.from);
      var toNode = layer.findOne('#' + connect.to);
      line.sceneFunc(function (context, shape) {
        context.beginPath();
        context.moveTo(fromNode.position().x, fromNode.position().y);
        const [c1, c2] = getControlPoints(
          [fromNode.position().x, fromNode.position().y],
          [toNode.position().x, toNode.position().y]
        );
        context.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], toNode.position().x, toNode.position().y);
        context.fillStrokeShape(shape);
      });
    });
    layer.draw();
  }

  function removeConnector() {
    for (let index = 0; index < connectors.length; index++) {
      if (
        (connectors[index].from === disconnectorCandidates[0] && connectors[index].to === disconnectorCandidates[1]) ||
        (connectors[index].from === disconnectorCandidates[1] && connectors[index].to === disconnectorCandidates[0])
      ) {
        const needDeleteConnector = connectors.splice(index, 1)[0];
        console.log(needDeleteConnector)
        setConnectors(connectors);
        const layer = outer.current.getLayer();

        const needDeleteNode = layer.findOne('#' + needDeleteConnector.id);
        console.log('deleting: ' + needDeleteNode.id());
        needDeleteNode.destroy();
        layer.draw();
        console.log('disconnet: ' + disconnectorCandidates[0] + ' ' + disconnectorCandidates[1]);
        return;
      }
    }
  }

  const handleDragStart = (e) => {
    // const layer = outer.current.getLayer();
    // const node = layer.findOne('#' + e.target.id());

    if (toolType === 'drag') {
      console.log('drag start');
    }
    if (toolType === 'connect') {
      console.log('connect start');
    }
  };

  const handleDragMove = (e) => {
    // const id = e.target.id();
    if (toolType === 'connect') {
      console.log('connect');
    }
    if (toolType === 'connect') {
      console.log('connect end');
    }
  };

  const handleDragEnd = (e) => {
    const layer = outer.current.getLayer();
    var node = layer.findOne('#' + e.target.id());
    if (toolType === 'drag') {
      console.log('drag end');
      const newPosition = getGridXY(node.position().x, node.position().y);
      node.x(newPosition.x);
      node.y(newPosition.y);
    }
  };

  function updateConnectors() {
    const layer = outer.current.getLayer();
    connectors.forEach((connect, index) => {
      var line = layer.findOne('#' + connect.id);
      var fromNode = layer.findOne('#' + connect.from);
      var toNode = layer.findOne('#' + connect.to);
      line.sceneFunc(function (context, shape) {
        context.beginPath();
        context.moveTo(fromNode.position().x, fromNode.position().y);
        const [c1, c2] = getControlPoints(
          [fromNode.position().x, fromNode.position().y],
          [toNode.position().x, toNode.position().y]
        );
        context.bezierCurveTo(c1[0], c1[1], c2[0], c2[1], toNode.position().x, toNode.position().y);
        context.fillStrokeShape(shape);
      });
    });
    layer.draw();
  }
  useEffect(() => {
    updateConnectors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getGridXY = (x, y) => {
    return { x: Math.round(x / GRID_SIZE) * GRID_SIZE, y: Math.round(y / GRID_SIZE) * GRID_SIZE };
  };

  return (
    <div className='App'>
      <button onClick={() => setToolType('drag')}>drag</button>
      <button onClick={() => setToolType('connect')}>connect</button>
      <button onClick={() => setToolType('disconnect')}>disconnect</button>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer ref={outer}>
          {connectors.map((connector) => (
            <Shape key={connector.id} stroke='grey' strokeWidth='5' id={connector.id} />
          ))}
          {targets.map((target) => (
            <Circle
              key={target.id}
              id={target.id}
              x={target.x}
              y={target.y}
              radius='25'
              fill='#fafafa'
              opacity={1.0}
              // draggable
              onMouseDown={handleMouseDown}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
