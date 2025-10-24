import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import locales from '../locales/it.json';

function EscapeRoomScene({ isLocked, onUnlock, attempts = 0, startTime }) {
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer effect
  useEffect(() => {
    if (!startTime || !isLocked) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isLocked]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="escape-room-scene relative w-full h-64 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 rounded-lg overflow-hidden border-2 border-gray-700 shadow-2xl">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
      </div>

      {/* Timer and Stats */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-600 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-lg font-mono font-bold text-blue-400">
              {formatTime(elapsedTime)}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{locales.escapeRoom.timer}</p>
        </motion.div>

        {/* Attempts Counter */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-600 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-lg font-mono font-bold text-purple-400">{attempts}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{locales.escapeRoom.attempts.replace('{count}', '')}</p>
        </motion.div>
      </div>

      {/* Door and Lock */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={!isLocked ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Door */}
          <motion.div
            className="relative w-48 h-56 bg-gradient-to-b from-amber-900 to-amber-950 rounded-lg border-4 border-amber-950 shadow-2xl"
            animate={!isLocked ? { rotateY: -15 } : { rotateY: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Door panels */}
            <div className="absolute inset-4 border-2 border-amber-800/50 rounded"></div>
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-amber-800/50"></div>
            
            {/* Door handle */}
            <motion.div
              className="absolute right-6 top-1/2 -translate-y-1/2 w-3 h-8 bg-yellow-600 rounded-full shadow-lg"
              animate={!isLocked ? { x: 5 } : { x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            ></motion.div>

            {/* Lock mechanism */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                className="relative w-20 h-24 bg-gradient-to-b from-gray-700 to-gray-900 rounded-lg border-2 border-gray-600 shadow-xl flex items-center justify-center"
                animate={!isLocked ? { scale: 0.8, opacity: 0.5 } : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Lock body */}
                <div className="absolute inset-2 bg-gradient-to-br from-gray-600 to-gray-800 rounded"></div>
                
                {/* Keyhole */}
                <motion.div
                  className="relative z-10"
                  animate={!isLocked ? { rotate: 90, scale: 1.2 } : { rotate: 0, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-4 h-4 bg-gray-900 rounded-full border-2 border-gray-950"></div>
                  <div className="w-1 h-6 bg-gray-900 mx-auto border-x-2 border-gray-950"></div>
                </motion.div>

                {/* Lock status indicator */}
                <motion.div
                  className={`absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    isLocked ? 'bg-red-500 border-red-600' : 'bg-green-500 border-green-600'
                  }`}
                  animate={!isLocked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.5, repeat: !isLocked ? 2 : 0 }}
                >
                  {isLocked ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                    </svg>
                  )}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Status text */}
          <motion.div
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className={`text-sm font-semibold ${isLocked ? 'text-red-400' : 'text-green-400'}`}>
              {isLocked ? locales.escapeRoom.statusLocked : locales.escapeRoom.statusUnlocked}
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Unlock animation particles */}
      {!isLocked && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full"
              initial={{
                x: '50%',
                y: '50%',
                opacity: 1,
                scale: 0,
              }}
              animate={{
                x: `${50 + (Math.random() - 0.5) * 100}%`,
                y: `${50 + (Math.random() - 0.5) * 100}%`,
                opacity: 0,
                scale: 1,
              }}
              transition={{
                duration: 1,
                delay: i * 0.05,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default EscapeRoomScene;
