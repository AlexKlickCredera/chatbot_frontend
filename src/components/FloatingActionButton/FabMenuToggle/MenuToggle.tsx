import { motion } from 'framer-motion';
import CrederaLogoFull from '../../../assets/credera-logo-full.png'; // update with your path
import CrederaLogo from  '../../../assets/credera-logo.png'; // update with your path
import styles from './MenuToggle.module.css';

interface MenuToggleProps {
  toggle: () => void;
  isOpen: boolean;
}

export const MenuToggle: React.FC<MenuToggleProps> = ({ toggle, isOpen }) => {
  const variants = {
    open: { opacity: 1, scale: 1, x: '0%', y: '0%', width: '250px' },
    closed: { opacity: 1, scale: 1, x: '0%', y: '0%', width: '60px', top: '5px'},
  };

  return (
    <button onClick={toggle} className={isOpen ? styles.menuToggleButtonFull : styles.menuToggleButton}>
      <motion.img
        animate={isOpen ? "open" : "closed"}
        variants={variants}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className={isOpen ? styles.fabLogoFull : styles.fabLogo}
        src={isOpen ? CrederaLogoFull : CrederaLogo}
        alt="Custom Logo"
      />
    </button>
  );
};

