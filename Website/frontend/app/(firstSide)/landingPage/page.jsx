import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './landingPage.module.css';
import logo from '../../assets/aquaPong.svg';
import Animation from './animation/animation';
import SlowMotionText from './animation/textMontion';
import PopUpBackdrop from '../../components/sign/PopUpBackdrop';

function LandingPage() {


  const SlowMotionTextValue = "AquaPong is an underwater adventure game set in the depths of the ocean, where players take on the role of courageous divers exploring mysterious underwater worlds.Equipped with state-of-the-art diving gear, including advanced propulsion systems and high-tech gadgets, players dive into the oceans depths to uncover hidden treasures, ancient ruins, and encounter fascinating marine life.As players venture deeper into the abyss, they discover breathtaking underwater landscapes, from vibrant coral reefs teeming with colorful fish to eerie shipwrecks shrouded in darkness.However, the journey is not without challenges. Along the way, divers must navigate treacherous underwater caverns, avoid dangerous sea creatures such as sharks, jellyfish, and giant octopuses, and solve intricate puzzles to progress.Fortunately, divers can upgrade their gear and acquire new skills to overcome obstacles, such as installing stronger lights to illuminate dark passages or deploying decoys to distract aggressive predators.But danger lurks in every shadowy corner of the ocean, and players must stay vigilant to survive. Will you brave the depths and uncover the secrets hidden beneath the waves in AquaPong?";
  return (
    <div className={styles.container}>
        <div className={styles.logo}>
          <Image
            src={logo} 
            alt="logo"
          />
        </div>
        <div className={styles.signInUp}>
          <PopUpBackdrop />
        </div>
        <div className={styles.animationContainer}>
            <Animation />
        </div>
        <div className={styles.textInfo}>
                <h1>
                    Welcome to <span style={{ fontSize: '2rem', color: '#66FCF1' }}>AquaPong</span>
                </h1>
                <SlowMotionText text={SlowMotionTextValue} />
        </div>
        <div className={styles.tryNow}>
            <Link href="">Try Now</Link>
        </div>
    </div>
  );
}

export default LandingPage;