import styles from './button.module.css';
import PropTypes from 'prop-types';

const Button = ({ value, className = "" ,fsize = 'text-lg', children, style = 'bg-aqua-pong', ...params }) => {
  return (
    <div  className={`${style} ${styles.button} ${className}`} {...params}>
      <div className={`${styles.button_box} flex-wrap flex justify-center text-center items-center`}>
        <span className={`${styles.button_text} ${className} ${fsize}`}>
          <p className={`${className}`}>{children || value}</p>
        </span>
      </div>
    </div>
  );
};

Button.propTypes = {
  fsize: PropTypes.string,
  children: PropTypes.node,
  value: PropTypes.string
};

export default Button;

