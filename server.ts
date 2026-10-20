import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { GoogleGenAI } from '@google/genai';
import {
  initDatabase,
  findUserByGoogleId,
  upsertGoogleUser,
  getAllUsers,
  IUser,
} from './server/userModel.ts';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Enable trust proxy so Express accurately reads client IPs from X-Forwarded-For in proxy / cloud environments
app.set('trust proxy', 1);

// Dev server in AI Studio must bind to 3000 (port 8080 is reserved for the Nginx proxy)
const PORT = 3000;

// Initialize Database connection / Schema
initDatabase();

// --- Security Middleware Setup ---
// Helmet security headers (configured safely for AI Studio dev iframe preview and Google GSI scripts)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    frameguard: false,
  })
);

// Strict and permissive CORS matching frontend domain
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local and preview domain origins
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Rate limiter for authentication endpoints (prevent brute-force abuse)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // limit each IP to 150 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    xForwardedForHeader: false,
    forwardedHeader: false,
  },
  message: { error: 'Too many authentication attempts, please try again in a few moments.' },
});

app.use('/api/auth/', authLimiter);

// Body parsing with sanitization limit
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// OAuth2 Client & JWT Secret
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';
const googleOAuthClient = new OAuth2Client(GOOGLE_CLIENT_ID || undefined);
const JWT_SECRET = process.env.JWT_SECRET || 'sanctuary_sacred_jwt_secret_token_2026_key';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// --- Types & Schemas ---
export interface PreConsultationIntake {
  energyBaseline: number; // 1 to 10
  emotionalLandscape: string;
  physicalTightness: string[];
  burdenOrSeeking: string;
  modalityPreference: string[];
  sleepAndDigestionNotes: string;
}

export interface DoctorScheduleSlot {
  id: string;
  date: string; // YYYY-MM-DD
  dayLabel: string;
  startTime: string; // e.g., "07:30 AM"
  endTime: string;   // e.g., "08:15 AM"
  period: 'Morning Dawn' | 'Midday Prana' | 'Twilight Sanctuary';
  isAvailable: boolean;
  sessionType: string;
}

export interface Appointment {
  id: string;
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  sessionType: string;
  patientName: string;
  patientEmail: string;
  status: 'confirmed' | 'completed' | 'cancelled';
  intake: PreConsultationIntake;
  createdAt: string;
}

export interface TargetedAsana {
  name: string;
  sanskrit: string;
  duration: string;
  breathFocus: string;
  therapeuticCue: string;
}

export interface HerbalRitual {
  timeOfDay: string;
  ritualName: string;
  herbalFormula: string;
  instructions: string;
}

export interface HealingPrescription {
  id: string;
  appointmentId?: string;
  patientName: string;
  doctorName: string;
  issuedDate: string;
  primaryEnergyState: string;
  personalDoctorNote: string;
  targetedYogaSequence: {
    sequenceTitle: string;
    totalDuration: string;
    intention: string;
    asanas: TargetedAsana[];
  };
  herbalRituals: HerbalRitual[];
  pranayamaPrescription: {
    breathName: string;
    ratio: string;
    dailyDuration: string;
    guidance: string;
  };
  followUpWindow: string;
}

export interface WeeklyReflection {
  id: string;
  weekNumber: number;
  theme: string;
  inquiry: string;
  mentorPrompt: string;
  userResponse?: {
    reflectionText: string;
    recordedMood: string;
    submittedAt: string;
  };
  mentorGuidance?: {
    notes: string;
    audioCueTitle?: string;
    repliedAt: string;
  };
}

export interface MessageItem {
  id: string;
  sender: 'user' | 'dr_karishma';
  senderName: string;
  text: string;
  timestamp: string;
}

// --- In-Memory Store with Serene Seed Data ---
const doctorSlots: DoctorScheduleSlot[] = [
  {
    id: 'slot-1',
    date: '2026-10-12',
    dayLabel: 'Monday',
    startTime: '07:30 AM',
    endTime: '08:15 AM',
    period: 'Morning Dawn',
    isAvailable: true,
    sessionType: 'Sacred Prana Consultation & Alignment'
  },
  {
    id: 'slot-2',
    date: '2026-10-12',
    dayLabel: 'Monday',
    startTime: '09:00 AM',
    endTime: '09:45 AM',
    period: 'Morning Dawn',
    isAvailable: true,
    sessionType: 'Integrative Therapeutic Asana Assessment'
  },
  {
    id: 'slot-3',
    date: '2026-10-12',
    dayLabel: 'Monday',
    startTime: '05:30 PM',
    endTime: '06:15 PM',
    period: 'Twilight Sanctuary',
    isAvailable: true,
    sessionType: 'Mind-Body Deep Reset & Restorative Flow'
  },
  {
    id: 'slot-4',
    date: '2026-10-13',
    dayLabel: 'Tuesday',
    startTime: '08:00 AM',
    endTime: '08:45 AM',
    period: 'Morning Dawn',
    isAvailable: true,
    sessionType: 'Sacred Prana Consultation & Alignment'
  },
  {
    id: 'slot-5',
    date: '2026-10-13',
    dayLabel: 'Tuesday',
    startTime: '11:30 AM',
    endTime: '12:15 PM',
    period: 'Midday Prana',
    isAvailable: true,
    sessionType: 'Dosha Assessment & Herbal Living Guide'
  },
  {
    id: 'slot-6',
    date: '2026-10-14',
    dayLabel: 'Wednesday',
    startTime: '06:00 PM',
    endTime: '06:45 PM',
    period: 'Twilight Sanctuary',
    isAvailable: true,
    sessionType: '1-on-1 Mentorship Integration'
  },
  {
    id: 'slot-7',
    date: '2026-10-15',
    dayLabel: 'Thursday',
    startTime: '07:30 AM',
    endTime: '08:15 AM',
    period: 'Morning Dawn',
    isAvailable: true,
    sessionType: 'Integrative Therapeutic Asana Assessment'
  },
  {
    id: 'slot-8',
    date: '2026-10-16',
    dayLabel: 'Friday',
    startTime: '05:00 PM',
    endTime: '05:45 PM',
    period: 'Twilight Sanctuary',
    isAvailable: true,
    sessionType: 'Mind-Body Deep Reset & Restorative Flow'
  }
];

const appointments: Appointment[] = [
  {
    id: 'apt-seed-1',
    slotId: 'slot-past-1',
    date: '2026-10-06',
    startTime: '07:30 AM',
    endTime: '08:15 AM',
    sessionType: 'Sacred Prana Consultation & Alignment',
    patientName: 'Ashlan Syed',
    patientEmail: 'ashlansyed28@gmail.com',
    status: 'completed',
    intake: {
      energyBaseline: 6,
      emotionalLandscape: 'Holding tension across neck & chest from sustained screen work; yearning for grounded breath.',
      physicalTightness: ['Cervical spine & neck', 'Upper chest', 'Adrenal fatigue'],
      burdenOrSeeking: 'Seeking to release chronic mental rushing and anchor a gentle morning sadhana.',
      modalityPreference: ['Therapeutic Asana', 'Pranayama', 'Ayurvedic Lifestyle Rituals'],
      sleepAndDigestionNotes: 'Waking between 3:00 - 4:00 AM with active thoughts; digestion slightly erratic.'
    },
    createdAt: '2026-10-04T12:00:00Z'
  }
];

const prescriptions: HealingPrescription[] = [
  {
    id: 'rx-seed-1',
    appointmentId: 'apt-seed-1',
    patientName: 'Ashlan Syed',
    doctorName: 'Dr. Syed Karishma',
    issuedDate: '2026-10-07',
    primaryEnergyState: 'Elevated Vata (Air/Ether) with Cervical Spine Compression & Restlessness',
    personalDoctorNote: 'Dearest Ashlan, when the mind moves faster than the breath, the nervous system stores the pace as tension in the neck and solar plexus. Your body is not broken; it is simply asking for deliberate deceleration. Prioritize the warm sesame oil ritual upon waking before you touch any screen, and allow your spine to soften into Supta Baddha Konasana every twilight.',
    targetedYogaSequence: {
      sequenceTitle: 'Vata-Pacifying Grounding & Spine Decompression',
      totalDuration: '24 minutes',
      intention: 'Rooting prana downward (Apana Vayu), unclenching the thoracic diaphragm, and relieving cervical tightness.',
      asanas: [
        {
          name: 'Reclining Bound Angle with Heart Bolster',
          sanskrit: 'Supta Baddha Konasana',
          duration: '6 minutes',
          breathFocus: '4-count smooth inhalation into the low belly; 6-count unforced exhalation.',
          therapeuticCue: 'Allow the knees to fall wide onto supporting blocks. Let the collarbones melt back like quiet water.'
        },
        {
          name: 'Gentle Cat-Cow with Prana Wave',
          sanskrit: 'Marjaryasana-Bitilasana',
          duration: '5 minutes',
          breathFocus: 'Initiate every motion from the base of the tailbone before the chin moves.',
          therapeuticCue: 'Do not over-extend the neck. Keep the back of the neck soft and elongated.'
        },
        {
          name: 'Supported Reclined Spinal Twist',
          sanskrit: 'Supta Matsyendrasana',
          duration: '4 minutes per side',
          breathFocus: 'Exhale deeply into the lumbar vertebrae and outer hip.',
          therapeuticCue: 'Keep both shoulder blades flush against your mat. Soften the jaw.'
        },
        {
          name: 'Legs-Up-The-Wall Restorative Stillness',
          sanskrit: 'Viparita Karani',
          duration: '5 minutes',
          breathFocus: 'Natural unhurried rhythm; observing pulse settling at the throat.',
          therapeuticCue: 'Fold a linen blanket under your sacrum for elevated venous return.'
        }
      ]
    },
    herbalRituals: [
      {
        timeOfDay: 'Morning Dawn (Prior to shower)',
        ritualName: 'Abhyanga Warm Oil Self-Anointment',
        herbalFormula: 'Organic cold-pressed sesame oil infused with Bala & Ashwagandha',
        instructions: 'Warm 2 tablespoons of oil in warm water. Massage in gentle circular strokes over joints and long strokes along limbs.'
      },
      {
        timeOfDay: 'Dusk (30 mins before sleep)',
        ritualName: 'Golden Moon Milk Elixir',
        herbalFormula: 'Warm almond or oat milk, 1/4 tsp organic turmeric, 1/8 tsp nutmeg, pinch of cardamon, 1/2 tsp ghee',
        instructions: 'Simmer gently for 3 minutes. Sip slowly in quiet twilight light, away from artificial blue illumination.'
      }
    ],
    pranayamaPrescription: {
      breathName: 'Nadi Shodhana (Alternate Nostril Purification)',
      ratio: 'Inhale 4 · Gentle Hold 2 · Exhale 4 (Vishama/Sama Vritti balance)',
      dailyDuration: '8 minutes every morning',
      guidance: 'Use Vishnu Mudra. Never force the breath; let it feel like a whisper across the upper lip.'
    },
    followUpWindow: '2 weeks for post-sadhana alignment'
  }
];

const reflections: WeeklyReflection[] = [
  {
    id: 'ref-week-1',
    weekNumber: 1,
    theme: 'Listening to the Body’s Whispers',
    inquiry: 'Where in your physical temple did tension arise this week, and what was the situation trying to tell you before you reacted?',
    mentorPrompt: 'Notice without judgment. Asana begins where resistance meets compassion.',
    userResponse: {
      reflectionText: 'I noticed that whenever back-to-back demands piled up around 2 PM, my shoulders crept toward my ears and my breath became shallow. Taking 3 minutes in the quiet sanctuary mode helped me reset before speaking.',
      recordedMood: 'Grounded and softening',
      submittedAt: '2026-10-08T18:30:00Z'
    },
    mentorGuidance: {
      notes: 'Beautiful awareness, Ashlan. That 2 PM shift is your pitta-vata transition hour. Even 4 cycles of sighing exhale through parted lips can prevent that shoulder contraction. Keep honoring that quiet pause.',
      audioCueTitle: 'Gentle Voice Note from Dr. Karishma (1m 40s)',
      repliedAt: '2026-10-09T09:15:00Z'
    }
  },
  {
    id: 'ref-week-2',
    weekNumber: 2,
    theme: 'The Space Between Inhale and Exhale',
    inquiry: 'How does your nervous system respond to silence when you stop rushing from one task to the next?',
    mentorPrompt: 'Kumbhaka is not holding; it is dwelling in the divine stillpoint.',
    userResponse: undefined,
    mentorGuidance: undefined
  }
];

const messages: MessageItem[] = [
  {
    id: 'msg-1',
    sender: 'dr_karishma',
    senderName: 'Dr. Syed Karishma',
    text: 'Welcome to this digital sanctuary, Ashlan. Take a slow, settling breath. Your health journey here is held with reverence and deep care.',
    timestamp: '2026-10-06T08:30:00Z'
  },
  {
    id: 'msg-2',
    sender: 'user',
    senderName: 'Ashlan Syed',
    text: 'Thank you, Dr. Karishma. The Supta Baddha Konasana sequence after work yesterday immediately relieved the tightness in my upper chest.',
    timestamp: '2026-10-07T19:40:00Z'
  },
  {
    id: 'msg-3',
    sender: 'dr_karishma',
    senderName: 'Dr. Syed Karishma',
    text: 'That warms my heart. When the chest opens, the nervous system receives permission to trust. Continue the golden moon milk ritual tonight.',
    timestamp: '2026-10-08T08:10:00Z'
  }
];

// --- User Profile State ---
let userProfile = {
  id: 'usr-1',
  name: 'Ashlan Syed',
  email: 'ashlansyed28@gmail.com',
  currentDoshaFocus: 'Vata-Pitta Balance',
  dailyIntention: 'Grounding into quiet presence and honoring my physical limits with gentleness.',
  currentStreakDays: 5,
  joinedDate: 'October 2026'
};

// --- API Routes ---

// 1. Doctor Schedule & Availability
app.get('/api/schedule', (req: Request, res: Response) => {
  res.json({
    doctor: {
      name: 'Dr. Syed Karishma',
      title: 'Integrative Ayurvedic Physician & Master Yoga Mentor',
      qualifications: 'BAMS, MD (Yoga & Holistic Medicine), ERYT-500',
      clinicLocation: 'Serene Sanctuary Clinic & Virtual Sacred Consultations',
      philosophy: 'Treating the root, honoring the prana, and guiding you back to innate inner stillness.'
    },
    slots: doctorSlots
  });
});

// 2. Appointments Listing
app.get('/api/appointments', (req: Request, res: Response) => {
  res.json(appointments);
});

// 3. Book Minimalist Appointment with Reflective Pre-Consultation Intake
app.post('/api/appointments', (req: Request, res: Response) => {
  const { slotId, patientName, patientEmail, intake, customDate, customTime, sessionType } = req.body;

  let chosenSlot = doctorSlots.find(s => s.id === slotId);
  if (chosenSlot) {
    chosenSlot.isAvailable = false;
  }

  const newAppointment: Appointment = {
    id: `apt-${Date.now()}`,
    slotId: slotId || `custom-${Date.now()}`,
    date: chosenSlot ? chosenSlot.date : (customDate || '2026-10-15'),
    startTime: chosenSlot ? chosenSlot.startTime : (customTime || '09:00 AM'),
    endTime: chosenSlot ? chosenSlot.endTime : '09:45 AM',
    sessionType: sessionType || (chosenSlot ? chosenSlot.sessionType : 'Sacred Prana Consultation & Alignment'),
    patientName: patientName || userProfile.name,
    patientEmail: patientEmail || userProfile.email,
    status: 'confirmed',
    intake: intake || {
      energyBaseline: 5,
      emotionalLandscape: 'Seeking balance',
      physicalTightness: ['General fatigue'],
      burdenOrSeeking: 'Rest and restoration',
      modalityPreference: ['Therapeutic Asana'],
      sleepAndDigestionNotes: 'Normal'
    },
    createdAt: new Date().toISOString()
  };

  appointments.unshift(newAppointment);

  res.status(201).json({
    message: 'Your sacred space has been reserved with Dr. Syed Karishma.',
    appointment: newAppointment
  });
});

// 4. Doctor Healing Prescriptions
app.get('/api/prescriptions', (req: Request, res: Response) => {
  res.json(prescriptions);
});

// Create/Assign New Prescription (Doctor Portal)
app.post('/api/prescriptions', (req: Request, res: Response) => {
  const {
    patientName,
    appointmentId,
    primaryEnergyState,
    personalDoctorNote,
    targetedYogaSequence,
    herbalRituals,
    pranayamaPrescription,
    followUpWindow
  } = req.body;

  const newPrescription: HealingPrescription = {
    id: `rx-${Date.now()}`,
    appointmentId,
    patientName: patientName || userProfile.name,
    doctorName: 'Dr. Syed Karishma',
    issuedDate: new Date().toISOString().split('T')[0],
    primaryEnergyState: primaryEnergyState || 'Balanced Prana & Gentle Restoration',
    personalDoctorNote: personalDoctorNote || 'Breathe deeply and trust the healing capacity of your body.',
    targetedYogaSequence: targetedYogaSequence || {
      sequenceTitle: 'Restorative Nervous System Calming',
      totalDuration: '20 minutes',
      intention: 'Cultivating tranquil presence',
      asanas: [
        {
          name: 'Balasana (Child’s Pose with Support)',
          sanskrit: 'Balasana',
          duration: '5 minutes',
          breathFocus: 'Breathing into the back ribs',
          therapeuticCue: 'Rest forehead gently on a cushion.'
        }
      ]
    },
    herbalRituals: herbalRituals || [],
    pranayamaPrescription: pranayamaPrescription || {
      breathName: 'Sama Vritti',
      ratio: '4:4 equal rhythm',
      dailyDuration: '6 minutes',
      guidance: 'Keep breathing gentle.'
    },
    followUpWindow: followUpWindow || '2 weeks'
  };

  prescriptions.unshift(newPrescription);
  res.status(201).json({
    message: 'Healing prescription assigned with sacred intention.',
    prescription: newPrescription
  });
});

// 5. Weekly Mentorship Reflections
app.get('/api/reflections', (req: Request, res: Response) => {
  res.json(reflections);
});

app.post('/api/reflections/:id/submit', (req: Request, res: Response) => {
  const { id } = req.params;
  const { reflectionText, recordedMood } = req.body;

  const ref = reflections.find(r => r.id === id);
  if (!ref) {
    return res.status(404).json({ error: 'Reflection not found' });
  }

  ref.userResponse = {
    reflectionText,
    recordedMood: recordedMood || 'Reflective',
    submittedAt: new Date().toISOString()
  };

  // Add gentle prompt mentor feedback simulation
  if (!ref.mentorGuidance) {
    ref.mentorGuidance = {
      notes: 'Thank you for opening this truthful reflection. Your awareness of breath is deepening noticeably. Honor this sacred gentleness today.',
      audioCueTitle: 'Audio Note from Dr. Karishma',
      repliedAt: new Date().toISOString()
    };
  }

  res.json({ message: 'Reflection submitted peacefully.', reflection: ref });
});

// 6. Safe Space Messages
app.get('/api/messages', (req: Request, res: Response) => {
  res.json(messages);
});

app.post('/api/messages', (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Message cannot be empty' });
  }

  const userMsg: MessageItem = {
    id: `msg-${Date.now()}`,
    sender: 'user',
    senderName: userProfile.name,
    text: text.trim(),
    timestamp: new Date().toISOString()
  };
  messages.push(userMsg);

  // Generate a caring, compassionate doctor response
  setTimeout(() => {
    const responses = [
      'I receive your message with care. Remember to exhale fully before stepping onto your mat today.',
      'Thank you for sharing this update. Notice how your breath softens when you give yourself permission to pause.',
      'Such beautiful progress. Be gentle with your body; healing is an unraveling, not an achievement.'
    ];
    const drMsg: MessageItem = {
      id: `msg-${Date.now() + 1}`,
      sender: 'dr_karishma',
      senderName: 'Dr. Syed Karishma',
      text: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date().toISOString()
    };
    messages.push(drMsg);
  }, 1000);

  res.status(201).json(userMsg);
});

// 7. User Profile
app.get('/api/profile', (req: Request, res: Response) => {
  res.json(userProfile);
});

app.put('/api/profile', (req: Request, res: Response) => {
  const { dailyIntention, currentDoshaFocus } = req.body;
  if (dailyIntention) userProfile.dailyIntention = dailyIntention;
  if (currentDoshaFocus) userProfile.currentDoshaFocus = currentDoshaFocus;
  res.json(userProfile);
});

// 8. AI Sanctuary Guide Endpoint (Dr. Syed Karishma AI Guide)
app.post('/api/ai-guide', async (req: Request, res: Response) => {
  const { message, context } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const systemInstruction = `You are Dr. Syed Karishma's AI Sanctuary Guide, a deeply compassionate, serene, and knowledgeable holistic mentor specializing in therapeutic yoga, Ayurvedic lifestyle medicine, pranayama breathwork, face yoga, and somatic nervous system calming.
Your tone is warm, divine, peaceful, grounding, and clear.
Guidelines:
1. Provide actionable, safe, biomechanically sound advice for asana postures, modifications for tension/pain, and breath ratios.
2. Weave in Ayurvedic wisdom (Vata, Pitta, Kapha balancing, chronobiology, herbal teas like golden milk or CCF tea) where helpful.
3. Keep answers concise, unhurried, beautifully structured with gentle bullet points or short paragraphs. Avoid medical jargon or robotic phrasing.
4. If the user mentions acute stress or panic, remind them to soften their shoulders, unclench the jaw, and take a long sighing exhalation.`;

  try {
    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { text: context ? `Current Sanctuary Context: ${context}\n\nUser Question: ${message}` : message }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const reply = response.text || "Breathe deeply into your heart center. Soften your shoulders and allow your breath to guide your practice.";
      return res.json({ reply });
    }
  } catch (err) {
    console.warn('Gemini API call warning, using holistic sanctuary wisdom fallback:', err);
  }

  // Graceful serene fallback
  const fallbackWisdom: Record<string, string> = {
    back: "For lower back release, practice Supta Matsyendrasana (reclined spinal twist) with a cushion under your knees. Avoid rounding the lumbar spine; instead, hinge from the hips and breathe directly into the sacral bowl.",
    neck: "To release cervical tension, gently tuck your chin toward your throat to elongate the suboccipital muscles. Practice Garudasana (Eagle arms) for 3 minutes, breathing between the shoulder blades.",
    anxiety: "When anxiety surges, the breath becomes trapped high in the chest. Practice the physiological sigh: two quick nasal inhalations followed by an extended, unhurried oral sigh. This signals safety to the vagus nerve in under 60 seconds.",
    sleep: "To prepare for restful sleep, sip warm almond milk infused with 1/8 tsp freshly grated nutmeg and turmeric. Elevate your legs up the wall (Viparita Karani) for 7 minutes in dim amber lighting.",
    morning: "Begin your dawn sadhana with 5 minutes of Nadi Shodhana (alternate nostril breathing) before touching any screens. Sip warm water with a slice of fresh ginger to kindle your digestive fire (Agni)."
  };

  const lower = message.toLowerCase();
  let matchedReply = "Honor the wisdom of your body right now. In yoga, we do not push to achieve a shape; we create space for the prana to flow freely. Soften your jaw, deepen your exhale, and move with gentle reverence.";
  for (const [key, val] of Object.entries(fallbackWisdom)) {
    if (lower.includes(key)) {
      matchedReply = val;
      break;
    }
  }

  return res.json({ reply: matchedReply });
});

// ==========================================
// --- Google Auth (OAuth 2.0) Endpoints ---
// ==========================================

// Helper middleware to authenticate JWT session tokens
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Missing or malformed Bearer token.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      googleId: string;
      email: string;
      name: string;
      picture?: string;
    };
    (req as any).authUser = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }
}

// 1. Google OAuth Verification & User Session Creation
app.post('/api/auth/google', async (req: Request, res: Response) => {
  try {
    const { idToken, token, credential } = req.body;
    const rawToken = (idToken || token || credential);

    if (!rawToken || typeof rawToken !== 'string') {
      return res.status(400).json({
        error: 'Missing or invalid token. Please provide an ID token string in req.body.idToken or req.body.credential.',
      });
    }

    const sanitizedToken = rawToken.trim();
    if (sanitizedToken.length < 5) {
      return res.status(400).json({ error: 'Token appears malformed or empty.' });
    }

    let googleId = '';
    let email = '';
    let name = '';
    let picture = '';

    // Check if token is a developer preview test token or a live Google ID token
    if (sanitizedToken.startsWith('test-google-token-')) {
      const parts = sanitizedToken.split('::');
      googleId = parts[1] || 'google_109876543210123456789';
      email = parts[2] || 'ashlansyed28@gmail.com';
      name = parts[3] || 'Ashlan Syed';
      picture = parts[4] || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
    } else {
      // Securely verify real Google ID Token via google-auth-library
      try {
        const ticket = await googleOAuthClient.verifyIdToken({
          idToken: sanitizedToken,
          audience: GOOGLE_CLIENT_ID ? [GOOGLE_CLIENT_ID] : undefined,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.sub) {
          return res.status(401).json({ error: 'Google token verification yielded an empty payload.' });
        }

        googleId = payload.sub;
        email = payload.email || '';
        name = payload.name || payload.given_name || email.split('@')[0] || 'Google User';
        picture = payload.picture || '';
      } catch (verifyErr) {
        console.warn('⚠️ Google Auth Library verification error:', (verifyErr as Error).message);
        return res.status(401).json({
          error: 'Google ID token verification failed.',
          details: (verifyErr as Error).message,
        });
      }
    }

    if (!googleId || !email) {
      return res.status(400).json({ error: 'Incomplete user data received from token verification.' });
    }

    // 4. User Session & Logic: Check if user exists in database; create or fetch
    const { user, isNewUser } = await upsertGoogleUser({
      googleId,
      email,
      name,
      picture,
    });

    // Also update server-side active userProfile name/email to personalize sanctuary
    userProfile.name = user.name;
    userProfile.email = user.email;

    // Generate secure session JWT token (7-day validity)
    const sessionToken = jwt.sign(
      {
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      isNewUser,
      token: sessionToken,
      user: {
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        picture: user.picture,
        createdAt: user.createdAt,
      },
      message: isNewUser
        ? 'Welcome to the Sanctuary! New user account registered and session created.'
        : 'Welcome back! User authenticated successfully.',
    });
  } catch (error) {
    console.error('Fatal error in /api/auth/google:', error);
    return res.status(500).json({
      error: 'An internal server error occurred while processing authentication.',
      details: (error as Error).message,
    });
  }
});

// 2. Authenticated Profile Endpoint (Verify Session)
app.get('/api/auth/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).authUser;
    const user = await findUserByGoogleId(authUser.googleId);

    if (!user) {
      return res.status(404).json({ error: 'Authenticated user was not found in the database.' });
    }

    return res.json({
      success: true,
      user: {
        googleId: user.googleId,
        email: user.email,
        name: user.name,
        picture: user.picture,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve session profile.' });
  }
});

// 3. Logout Endpoint
app.post('/api/auth/logout', (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: 'User session logged out successfully.',
  });
});

// 4. Database User Records Inspector (Auditing / Admin)
app.get('/api/auth/users', async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    return res.json({
      count: users.length,
      users: users.map((u) => ({
        googleId: u.googleId,
        email: u.email,
        name: u.name,
        picture: u.picture,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch registered users.' });
  }
});

// 5. OAuth Config Status
app.get('/api/auth/config', (req: Request, res: Response) => {
  res.json({
    isConfigured: !!GOOGLE_CLIENT_ID,
    clientIdPrefix: GOOGLE_CLIENT_ID ? GOOGLE_CLIENT_ID.slice(0, 16) + '...' : null,
    environmentAppUrl: process.env.APP_URL || 'http://localhost:3000',
  });
});

// --- Vite Integration & Serving ---
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Serene Sanctuary Server blossomed peacefully at http://0.0.0.0:${PORT}`);
  });
}

startServer();
