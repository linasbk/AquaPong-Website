import PropTypes from 'prop-types';
import styles from '../landingPage.module.css';

function SlowMotionText({ text }) {
  const words = text.split(' ');

  return (
    <div className={styles.shortStory}>
      {words.map((word, index) => (
        <span className={styles.animationDelay} key={index} style={{ animationDelay: `${index * 0.05}s` }}>{word} </span>
      ))}
    </div>
  );
}

SlowMotionText.propTypes = {
  text: PropTypes.string.isRequired
};

export default SlowMotionText;
