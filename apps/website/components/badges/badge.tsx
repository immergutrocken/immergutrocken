"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import BlueBadge from './blue-badge';
import GreenBadge from './green-badge';
import RedBadge from './red-badge';
import YellowBadge from './yellow-badge';

const angle = 15;
const shakeAnimation = {
  shake: {
    rotate: [0, angle, 0, -angle, 0],
    transition: {
      duration: 2,
      ease: "easeInOut",
      times: [0, 0.5, 1, 1.5, 2],
      repeat: Infinity,
    },
  },
};

const Badge = (): JSX.Element => {
  const [image, setImage] = useState<JSX.Element | undefined>(<></>);

  useEffect(() => {
    const map = new Map([
      [0, BlueBadge],
      [1, GreenBadge],
      [2, RedBadge],
      [3, YellowBadge],
    ]);
    const random = Math.floor(Math.random() * map.size);
    setImage(map.get(random));
  }, []);

  return (
    <>
      <motion.div
        className="max-w-28 lg:mr-8"
        variants={shakeAnimation}
        animate="shake"
      >
        {image}
      </motion.div>
    </>
  );
};

export default Badge;
