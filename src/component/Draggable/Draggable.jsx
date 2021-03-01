import { React, useState } from 'react';
import './Style.scss';

export const Draggable = (props) => {
  // let { onPointerDown, onPointerUp, onPointerMove, onDragMove, children, style, className, width, height } = props;
  const { children, width, height, pos } = props;
  let { gridSize } = props;

  const [translate, setTranslate] = useState({
    x: pos?.x || 0,
    y: pos?.y || 0,
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleDragMove = (e) => {
    // console.log(e);
    console.log(e.pageX, e.pageY);
    // setTranslate({
    //   x: e.pageX - width / 2,
    //   y: e.pageY - height / 2,
    // });
    setTranslate({
      x: translate.x + e.movementX,
      y: translate.y + e.movementY,
    });
  };
  gridSize = gridSize || 100;
  const onPointerUp = () => {
    setTranslate({
      x: Math.round(translate.x / gridSize) * gridSize,
      y: Math.round(translate.y / gridSize) * gridSize,
    });
  };

  const handlePointerDown = (e) => {
    setIsDragging(true);

    // onPointerDown(e);
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);

    onPointerUp(e);
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      handleDragMove(e);
    }

    // onPointerMove(e);
  };

  return (
    <div
      onMouseDown={handlePointerDown}
      onMouseUp={handlePointerUp}
      onMouseMove={handlePointerMove}
      style={{
        position: 'absolute',
        left: translate.x + 'px',
        top: translate.y + 'px',
        width: width,
        height: height,
        backgroundColor: 'white',
      }}
      // className={className}
      // className=""
    >
      {children}
    </div>
  );
};

Draggable.defaultProps = {
  onPointerDown: () => {},
  onPointerUp: () => {},
  onPointerMove: () => {},
};
