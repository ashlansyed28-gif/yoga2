/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// Exquisite, scalable vector illustrations for Buddha and Zen Sanctuary themes

export const BuddhaMeditationArtwork: React.FC<{ className?: string; opacity?: number }> = ({
  className = 'w-full h-full',
  opacity = 1
}) => {
  return (
    <svg
      viewBox="0 0 800 800"
      className={className}
      style={{ opacity }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="haloGlow" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#F5D0A9" stopOpacity="0.45" />
          <stop offset="50%" stopColor="#D4A373" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#CCD5AE" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="auraRing" cx="50%" cy="40%" r="40%">
          <stop offset="0%" stopColor="#FFF4E6" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#E0AFA0" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#D4A373" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4A373" />
          <stop offset="40%" stopColor="#B88554" />
          <stop offset="100%" stopColor="#7E5328" />
        </linearGradient>
        <linearGradient id="robeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E6C29E" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#C99460" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="lotusPetal" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FCE7E4" />
          <stop offset="60%" stopColor="#E0AFA0" />
          <stop offset="100%" stopColor="#C48474" />
        </linearGradient>
      </defs>

      {/* Outer Halo Radiance */}
      <circle cx="400" cy="340" r="300" fill="url(#haloGlow)" />
      <circle cx="400" cy="340" r="190" fill="url(#auraRing)" />

      {/* Concentric Sacred Geometry Mandala Rings */}
      <circle cx="400" cy="340" r="160" stroke="#D4A373" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />
      <circle cx="400" cy="340" r="210" stroke="#E0AFA0" strokeWidth="1" strokeDasharray="3 8" opacity="0.35" />
      <circle cx="400" cy="340" r="260" stroke="#CCD5AE" strokeWidth="1" strokeDasharray="2 10" opacity="0.25" />

      {/* Radiating Ray Lines */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
        <line
          key={i}
          x1="400"
          y1="340"
          x2={400 + Math.cos((deg * Math.PI) / 180) * 250}
          y2={340 + Math.sin((deg * Math.PI) / 180) * 250}
          stroke="#D4A373"
          strokeWidth="0.75"
          opacity="0.2"
        />
      ))}

      {/* Buddha Head and Ushnisha (Topknot) */}
      {/* Ushnisha flame/crest */}
      <path
        d="M394 175 C396 160 404 160 406 175 C408 190 392 190 394 175 Z"
        fill="url(#bodyGradient)"
      />
      <circle cx="400" cy="195" r="18" fill="url(#bodyGradient)" />

      {/* Head oval */}
      <ellipse cx="400" cy="235" r="42" rx="38" ry="48" fill="url(#bodyGradient)" />

      {/* Elongated Ear Lobes (symbol of renunciation and listening) */}
      <path d="M358 225 C354 240 354 265 358 275 C360 270 361 240 364 230 Z" fill="url(#bodyGradient)" />
      <path d="M442 225 C446 240 446 265 442 275 C440 270 439 240 436 230 Z" fill="url(#bodyGradient)" />

      {/* Closed Meditative Eyes & Brow */}
      <path d="M375 235 Q385 242 393 235" stroke="#FFF4E6" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M407 235 Q415 242 425 235" stroke="#FFF4E6" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9" />
      {/* Urna (Third Eye dot) */}
      <circle cx="400" cy="218" r="3" fill="#FFF4E6" />
      {/* Serene Smile */}
      <path d="M392 260 Q400 266 408 260" stroke="#FFF4E6" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />

      {/* Neck & Shoulders */}
      <path d="M386 280 L386 300 Q350 315 310 350 L310 440 L490 440 L490 350 Q450 315 414 280 Z" fill="url(#bodyGradient)" />

      {/* Sanghati Robe Drape across left shoulder */}
      <path
        d="M340 330 Q400 370 460 340 L480 430 Q400 460 320 430 Z"
        fill="url(#robeGradient)"
      />
      <path d="M340 350 Q400 390 460 360" stroke="#FFF4E6" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M330 380 Q400 415 470 385" stroke="#FFF4E6" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />

      {/* Dhyana Mudra (Meditating Hands in Lap) */}
      <path
        d="M360 430 C360 415 440 415 440 430 C440 450 360 450 360 430 Z"
        fill="url(#bodyGradient)"
      />
      <ellipse cx="400" cy="432" rx="24" ry="10" fill="#E6C29E" opacity="0.8" />
      <circle cx="400" cy="428" r="4" fill="#FFF4E6" />

      {/* Crossed Legs (Padmasana Lotus Posture Base) */}
      <path
        d="M260 470 C280 430 340 430 380 440 C420 430 480 430 500 470 C520 500 480 520 400 520 C320 520 240 500 260 470 Z"
        fill="url(#bodyGradient)"
      />

      {/* Sacred Blooming Lotus Throne at Base */}
      {/* Center Top Petal */}
      <path
        d="M400 495 C385 465 415 465 400 495 Z"
        fill="url(#lotusPetal)"
      />
      {/* Front Radiating Petals */}
      <path d="M400 500 C370 470 370 525 400 540 C430 525 430 470 400 500 Z" fill="url(#lotusPetal)" />
      <path d="M365 505 C335 480 340 535 375 545 C385 530 380 515 365 505 Z" fill="url(#lotusPetal)" />
      <path d="M435 505 C465 480 460 535 425 545 C415 530 420 515 435 505 Z" fill="url(#lotusPetal)" />
      <path d="M330 515 C295 495 305 550 345 555 C355 540 345 525 330 515 Z" fill="url(#lotusPetal)" />
      <path d="M470 515 C505 495 495 550 455 555 C445 540 455 525 470 515 Z" fill="url(#lotusPetal)" />

      {/* Lotus Bottom Support Rim */}
      <ellipse cx="400" cy="552" rx="140" ry="18" fill="#C48474" opacity="0.6" />
      <ellipse cx="400" cy="556" rx="160" ry="12" fill="#D4A373" opacity="0.3" />

      {/* Floating Lotus Blossom Petals */}
      <path d="M220 320 Q230 305 240 320 Q230 335 220 320 Z" fill="url(#lotusPetal)" opacity="0.75" />
      <path d="M570 340 Q580 325 590 340 Q580 355 570 340 Z" fill="url(#lotusPetal)" opacity="0.75" />
      <path d="M260 240 Q270 225 280 240 Q270 255 260 240 Z" fill="url(#lotusPetal)" opacity="0.6" />
      <path d="M520 220 Q530 205 540 220 Q530 235 520 220 Z" fill="url(#lotusPetal)" opacity="0.6" />
    </svg>
  );
};

export const HimalayanSunriseArtwork: React.FC<{ className?: string; opacity?: number }> = ({
  className = 'w-full h-full',
  opacity = 1
}) => {
  return (
    <svg
      viewBox="0 0 1200 600"
      className={className}
      style={{ opacity }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFF9F0" />
          <stop offset="50%" stopColor="#F6E7D2" />
          <stop offset="100%" stopColor="#EAD8C0" />
        </linearGradient>
        <linearGradient id="mountainBack" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#C8B8A6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#E2D4C3" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="mountainMid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A69480" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#8A7865" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE0B2" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#FFCC80" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFE0B2" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky Canvas */}
      <rect width="1200" height="600" fill="url(#skyGrad)" />

      {/* Golden Sunrise Orb */}
      <circle cx="600" cy="220" r="140" fill="url(#sunGlow)" />
      <circle cx="600" cy="220" r="60" fill="#FFF3E0" />

      {/* Back Distant Peaks */}
      <path
        d="M0 400 L240 220 L450 360 L600 180 L780 340 L980 200 L1200 380 L1200 600 L0 600 Z"
        fill="url(#mountainBack)"
      />

      {/* Mid Layer Mountain Ridges */}
      <path
        d="M0 470 L180 340 L380 440 L520 310 L710 430 L890 290 L1100 420 L1200 380 L1200 600 L0 600 Z"
        fill="url(#mountainMid)"
      />

      {/* Morning Mist Drift */}
      <ellipse cx="600" cy="460" rx="500" ry="60" fill="#FFF9F0" opacity="0.6" />
      <ellipse cx="300" cy="480" rx="350" ry="40" fill="#FFF9F0" opacity="0.5" />
      <ellipse cx="900" cy="490" rx="350" ry="40" fill="#FFF9F0" opacity="0.5" />

      {/* Foreground Mountain Temple Ridge */}
      <path
        d="M0 550 Q300 480 600 520 Q900 490 1200 560 L1200 600 L0 600 Z"
        fill="#5E5042"
        opacity="0.8"
      />
    </svg>
  );
};

export const ZenStonesWaterArtwork: React.FC<{ className?: string; opacity?: number }> = ({
  className = 'w-full h-full',
  opacity = 1
}) => {
  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      style={{ opacity }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="waterRipple" cx="50%" cy="65%" r="45%">
          <stop offset="0%" stopColor="#CCD5AE" stopOpacity="0.25" />
          <stop offset="70%" stopColor="#D4A373" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#CCD5AE" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="stone1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A39686" />
          <stop offset="100%" stopColor="#6E6254" />
        </linearGradient>
        <linearGradient id="stone2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#BDAD9B" />
          <stop offset="100%" stopColor="#7E7264" />
        </linearGradient>
        <linearGradient id="stone3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D5C5B3" />
          <stop offset="100%" stopColor="#968777" />
        </linearGradient>
      </defs>

      {/* Water Ripples */}
      <ellipse cx="300" cy="460" rx="260" ry="60" fill="url(#waterRipple)" />
      <ellipse cx="300" cy="460" rx="200" ry="40" stroke="#CCD5AE" strokeWidth="1" opacity="0.4" />
      <ellipse cx="300" cy="460" rx="140" ry="25" stroke="#D4A373" strokeWidth="1" opacity="0.5" />
      <ellipse cx="300" cy="460" rx="80" ry="14" stroke="#CCD5AE" strokeWidth="1" opacity="0.6" />

      {/* Stacked Balance Stones (Cairn of Presence) */}
      {/* Bottom Large Pebble */}
      <ellipse cx="300" cy="440" rx="110" ry="42" fill="url(#stone1)" />
      <ellipse cx="295" cy="435" rx="90" ry="32" fill="#8C7F70" opacity="0.5" />

      {/* Middle Pebble */}
      <ellipse cx="300" cy="385" rx="80" ry="32" fill="url(#stone2)" />
      <ellipse cx="295" cy="380" rx="65" ry="24" fill="#9C8D7C" opacity="0.5" />

      {/* Third Pebble */}
      <ellipse cx="300" cy="335" rx="58" ry="24" fill="url(#stone3)" />

      {/* Top Pinnacle Pebble */}
      <ellipse cx="300" cy="292" rx="38" ry="18" fill="#E2D4C2" />
      <circle cx="298" cy="290" r="10" fill="#F4EFE6" opacity="0.6" />

      {/* Floating Sacred Lotus Leaf and Flower */}
      <path d="M430 460 C400 440 450 420 470 445 C490 470 440 480 430 460 Z" fill="#CCD5AE" opacity="0.8" />
      <ellipse cx="450" cy="445" rx="12" ry="7" fill="#E0AFA0" />
      <circle cx="450" cy="444" r="3" fill="#FFF4E6" />
    </svg>
  );
};
