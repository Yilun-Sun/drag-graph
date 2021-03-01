import './Style.scss';

export const LeftRightText = (props) => {
  return (
    <div>
      <div className='text_left'>{props.left}</div>
      <div className='text_right'>{props.right}</div>
    </div>
  );
};

export const HeaderText = (props) => {
  return (
    <div>
      <div className='header'>{props.text}</div>
    </div>
  );
};
