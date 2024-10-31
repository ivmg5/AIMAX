import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import pages from '@/app/routes/routes';

interface PageTransitionProps {
  children: ReactNode;
}

const variants = {
  initial: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    transition: {
      duration: 0.5,
    },
  }),
};

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const [direction, setDirection] = useState(1);
  const [prevPath, setPrevPath] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (prevPath !== null) {
      const currentPageIndex = pages.indexOf(prevPath);
      const nextPageIndex = pages.indexOf(pathname);
      setDirection(nextPageIndex > currentPageIndex ? 1 : -1);
    }
    setPrevPath(pathname);
  }, [pathname, prevPath]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      custom={direction}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
