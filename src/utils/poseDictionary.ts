/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PoseDetailData } from '../components/PoseDetailView.tsx';

export const POSE_DICTIONARY: Record<string, PoseDetailData> = {
  stillness: {
    id: 'stillness',
    name: 'Deep Stillness (Seated Lotus Meditation)',
    sanskritName: 'Sukhasana / Padmasana',
    category: 'Meditation & Centering',
    theme: 'Calming the autonomic nervous system & steadying mental waves',
    durationSeconds: 300,
    clinicalCue: 'Allow the pelvic basin to drop like heavy stone while the occipital skull floats effortlessly upward.',
    commonMistake: 'Slumping the lumbar spine or tensing the shoulders up toward the ears.',
    breathRhythm: { inhale: 4, retain: 2, exhale: 4, settle: 2 },
    replicationSteps: [
      { step: 1, phase: 'Setup Base', instruction: 'Sit on a mat or cushion. Cross shins gently, placing feet under opposite knees.' },
      { step: 2, phase: 'Spine & Hands', instruction: 'Rest wrists on knees in Chin Mudra (index finger lightly touching thumb tip).' },
      { step: 3, phase: 'Inhale (4s)', instruction: 'Lengthen the spine upward, broaden collarbones, and feel chest softly expand.' },
      { step: 4, phase: 'Exhale (4s)', instruction: 'Drop shoulders down away from ears, soften jaw, and root sit bones into mat.' }
    ]
  },
  spine: {
    id: 'spine',
    name: 'Spinal Softening (Cat-Cow Wave)',
    sanskritName: 'Marjaryasana-Bitilasana',
    category: 'Spinal Health & Fluidity',
    theme: 'Articulating individual vertebrae & hydrating intervertebral discs',
    durationSeconds: 240,
    clinicalCue: 'Initiate every wave from the tailbone first; let the skull be the very last to tilt.',
    commonMistake: 'Bending elbows or cranking the neck backwards rather than articulating the spine.',
    breathRhythm: { inhale: 5, retain: 1, exhale: 5, settle: 1 },
    replicationSteps: [
      { step: 1, phase: 'Tabletop Stance', instruction: 'Come to hands and knees. Wrists directly under shoulders, knees under hips.' },
      { step: 2, phase: 'Inhale Cow (5s)', instruction: 'Dip belly down toward floor, tilt tailbone up, roll shoulders back, gaze forward.' },
      { step: 3, phase: 'Exhale Cat (5s)', instruction: 'Press palms down, dome spine up toward ceiling, tuck tailbone, chin to chest.' },
      { step: 4, phase: 'Fluid Wave', instruction: 'Continue moving smoothly between Cat and Cow with each breath like an ocean wave.' }
    ]
  },
  heart: {
    id: 'heart',
    name: 'Heart Space Ease (Puppy Melting Heart)',
    sanskritName: 'Anahatasana',
    category: 'Thoracic Opening',
    theme: 'Unburdening emotional constriction & opening thoracic spine',
    durationSeconds: 240,
    clinicalCue: 'Inhale into the back of the heart as much as the front. True opening happens 360 degrees.',
    commonMistake: 'Letting hips drift forward past the knees or straining the cervical neck.',
    breathRhythm: { inhale: 4, retain: 4, exhale: 4, settle: 4 },
    replicationSteps: [
      { step: 1, phase: 'Kneeling Alignment', instruction: 'Start on all fours. Keep hips stacked strictly directly above your knees.' },
      { step: 2, phase: 'Walk Arms Forward', instruction: 'Walk hands forward along the mat shoulder-width apart, arms straight.' },
      { step: 3, phase: 'Melt Heart on Exhale', instruction: 'Soften chest down toward the mat, resting forehead or chin lightly on floor.' },
      { step: 4, phase: 'Breathe in Anahata', instruction: 'Breathe deeply into the upper chest and under armpits, feeling tension melt.' }
    ]
  },
  prana: {
    id: 'prana',
    name: 'Restorative Prana (Legs-Up-The-Wall)',
    sanskritName: 'Viparita Karani',
    category: 'Restorative & Inversion',
    theme: 'Replenishing cellular vitality & relieving nervous exhaustion',
    durationSeconds: 360,
    clinicalCue: 'Surrender all muscular holding. Let gravity pull blood back toward the liver and kidneys.',
    commonMistake: 'Placing hips too far from the wall or locking the knees rigidly.',
    breathRhythm: { inhale: 4, retain: 7, exhale: 8, settle: 1 },
    replicationSteps: [
      { step: 1, phase: 'Wall & Bolster Setup', instruction: 'Place a folded blanket or bolster 4 inches away from a smooth wall.' },
      { step: 2, phase: 'Extend Legs Upward', instruction: 'Lie on your back, swinging legs straight up the wall, resting hips on support.' },
      { step: 3, phase: 'Open Arms Wide', instruction: 'Rest arms out by sides at 45 degrees, palms facing ceiling, chest wide.' },
      { step: 4, phase: '4-7-8 Breath', instruction: 'Inhale 4s, hold prana 7s, exhale 8s through lips, allowing nervous system to settle.' }
    ]
  },
  grounding: {
    id: 'grounding',
    name: 'Rooted Grounding (Mountain to Upward Salute)',
    sanskritName: 'Tadasana to Urdhva Hastasana',
    category: 'Standing Grounding',
    theme: 'Anchoring scattered mental speed & stabilizing the base energy center',
    durationSeconds: 180,
    clinicalCue: 'Feel three points of contact on each foot: big toe mound, pinky toe mound, and center of heel.',
    commonMistake: 'Arching lower back excessively when raising arms or locking knees backward.',
    breathRhythm: { inhale: 5, retain: 2, exhale: 5, settle: 3 },
    replicationSteps: [
      { step: 1, phase: 'Standing Base', instruction: 'Stand with feet parallel, hip-width apart. Spread toes wide and grip earth.' },
      { step: 2, phase: 'Inhale Sweep Arms Up', instruction: 'Inhale deeply as arms sweep wide and overhead, joining palms in Anjali Mudra.' },
      { step: 3, phase: 'Exhale Lower to Heart', instruction: 'Exhale lowering hands slowly through heart center back to Mountain Pose.' },
      { step: 4, phase: 'Root & Lengthen', instruction: 'Feel roots pushing down into the earth as the crown of head reaches to the sky.' }
    ]
  },
  downdog: {
    id: 'downdog',
    name: 'Downward-Facing Dog',
    sanskritName: 'Adho Mukha Svanasana',
    category: 'Full-Body Inversion',
    theme: 'Decompressing posterior fascia & sending oxygenated prana to the brain',
    durationSeconds: 180,
    clinicalCue: 'Press firmly through knuckles of index fingers and thumbs. Send sit bones high like a mountain peak.',
    commonMistake: 'Dumping all body weight into wrists or rounding the lower back.',
    breathRhythm: { inhale: 4, retain: 2, exhale: 4, settle: 2 },
    replicationSteps: [
      { step: 1, phase: 'Hand Placement', instruction: 'Plant hands shoulder-width apart, fingers spread wide like sea stars.' },
      { step: 2, phase: 'Lift Hips Up & Back', instruction: 'Tuck toes, exhale and lift knees off floor, sending sit bones up toward ceiling.' },
      { step: 3, phase: 'Lengthen Spine', instruction: 'Keep knees softly bent if hamstrings are tight; prioritize a long, straight spine.' },
      { step: 4, phase: 'Sink Heels', instruction: 'Allow heels to sink naturally toward the mat while relaxing the neck between biceps.' }
    ]
  },
  warrior2: {
    id: 'warrior2',
    name: 'Warrior II',
    sanskritName: 'Virabhadrasana II',
    category: 'Standing Strength & Focus',
    theme: 'Cultivating courageous stillness, pelvic stability, and concentrated gaze',
    durationSeconds: 150,
    clinicalCue: 'Keep front knee tracking directly over second toe; extend equally through front and back fingertips.',
    commonMistake: 'Letting front knee cave inward or leaning the torso forward over the front thigh.',
    breathRhythm: { inhale: 4, retain: 2, exhale: 4, settle: 2 },
    replicationSteps: [
      { step: 1, phase: 'Wide Stance', instruction: 'Step feet 4 feet apart. Turn right foot forward 90 degrees, back foot in slightly.' },
      { step: 2, phase: 'Bend Front Knee', instruction: 'Exhale and bend right knee to 90 degrees, tracking directly over ankle.' },
      { step: 3, phase: 'Extend Arms', instruction: 'Float arms wide parallel to earth, palms facing down, shoulders relaxed.' },
      { step: 4, phase: 'Focused Drishti', instruction: 'Gaze serenely over front right fingertips; root down through both feet.' }
    ]
  },
  tree: {
    id: 'tree',
    name: 'Tree Pose',
    sanskritName: 'Vrksasana',
    category: 'Standing Balance & Equilibrium',
    theme: 'Calming cerebellum oscillation and rooting the nervous system into stability',
    durationSeconds: 150,
    clinicalCue: 'Press foot into inner thigh and thigh back into foot equally. Choose an unmoving eye gaze point.',
    commonMistake: 'Placing the foot directly against the knee joint or holding the breath.',
    breathRhythm: { inhale: 4, retain: 2, exhale: 4, settle: 2 },
    replicationSteps: [
      { step: 1, phase: 'Root Standing Leg', instruction: 'Shift weight onto left foot, spreading toes wide like tree roots.' },
      { step: 2, phase: 'Place Foot', instruction: 'Place right foot on inner left calf or inner thigh (never directly on knee).' },
      { step: 3, phase: 'Hands to Heart', instruction: 'Bring palms together at heart center in Anjali Mudra, steadying the gaze.' },
      { step: 4, phase: 'Grow Branches', instruction: 'Optionally float arms overhead like branches while keeping breath smooth.' }
    ]
  },
  balasana: {
    id: 'balasana',
    name: 'Child’s Pose',
    sanskritName: 'Balasana',
    category: 'Restorative Grounding',
    theme: 'Surrendering adrenal activation and creating safe somatic containment',
    durationSeconds: 240,
    clinicalCue: 'Allow the forehead to connect deeply with the mat. Direct your breath into the back kidneys.',
    commonMistake: 'Tensing the shoulders or clenching the hips rather than yielding to gravity.',
    breathRhythm: { inhale: 4, retain: 2, exhale: 6, settle: 2 },
    replicationSteps: [
      { step: 1, phase: 'Kneel on Mat', instruction: 'Kneel with big toes touching, knees wide toward outer edges of mat.' },
      { step: 2, phase: 'Fold Torso', instruction: 'Exhale and fold torso down between thighs, letting belly rest gently.' },
      { step: 3, phase: 'Rest Forehead', instruction: 'Rest forehead on mat or cushion, releasing all neck and cranial tension.' },
      { step: 4, phase: 'Extend Arms', instruction: 'Drape arms forward with palms down, or rest them alongside calves with palms up.' }
    ]
  },
  sphinx: {
    id: 'sphinx',
    name: 'Sphinx & Gentle Cobra Pose',
    sanskritName: 'Salamba Bhujangasana',
    category: 'Gentle Backbend',
    theme: 'Decompressing lumbar nerve roots and awakening the heart chakra',
    durationSeconds: 180,
    clinicalCue: 'Pull elbows gently backward toward hips without moving them to draw the chest through the arms.',
    commonMistake: 'Craning the neck backward or clenching glutes aggressively.',
    breathRhythm: { inhale: 4, retain: 2, exhale: 4, settle: 2 },
    replicationSteps: [
      { step: 1, phase: 'Lie Prone', instruction: 'Lie on your belly with legs straight back, tops of feet flat on mat.' },
      { step: 2, phase: 'Place Elbows', instruction: 'Set elbows directly under shoulders, forearms parallel and flat on floor.' },
      { step: 3, phase: 'Inhale Lift Chest', instruction: 'Inhale and gently draw heart forward and upward, relaxing glute muscles.' },
      { step: 4, phase: 'Lengthen Neck', instruction: 'Keep gaze soft forward and downward to preserve length in cervical spine.' }
    ]
  },
  bridge: {
    id: 'bridge',
    name: 'Supported Bridge Pose',
    sanskritName: 'Setu Bandha Sarvangasana',
    category: 'Inversion & Heart Opening',
    theme: 'Regulating thyroid blood flow and relieving sacral-lumbar stagnation',
    durationSeconds: 200,
    clinicalCue: 'Keep knees parallel and directly above ankles. Lift from the posterior hamstrings, not the lumbar.',
    commonMistake: 'Splaying knees outward or turning head from side to side while in the bridge.',
    breathRhythm: { inhale: 4, retain: 2, exhale: 4, settle: 2 },
    replicationSteps: [
      { step: 1, phase: 'Lie on Back', instruction: 'Lie flat on back, bend knees, and place feet flat on mat hip-width apart.' },
      { step: 2, phase: 'Arm Placement', instruction: 'Rest arms long by sides, fingertips lightly grazing heels.' },
      { step: 3, phase: 'Inhale Lift Pelvis', instruction: 'Press into feet and arms to float pelvis and spine upward off the mat.' },
      { step: 4, phase: 'Hold & Expand', instruction: 'Roll shoulders under, broaden collarbones, and breathe into chest.' }
    ]
  },
  savasana: {
    id: 'savasana',
    name: 'Corpse Pose (Deep Integration)',
    sanskritName: 'Savasana',
    category: 'Integration & Stillness',
    theme: 'Integrating the neurological benefits of practice into deep parasympathetic surrender',
    durationSeconds: 300,
    clinicalCue: 'Surrender every muscle fiber to gravity. Release control of the breath; let the earth hold you completely.',
    commonMistake: 'Fidgeting or opening eyes rather than surrendering to pure stillness.',
    breathRhythm: { inhale: 4, retain: 0, exhale: 6, settle: 2 },
    replicationSteps: [
      { step: 1, phase: 'Lie Supine', instruction: 'Lie flat on back. Separate legs comfortably, letting feet flop open to sides.' },
      { step: 2, phase: 'Arms & Shoulders', instruction: 'Rest arms slightly away from body, palms turned receptive toward ceiling.' },
      { step: 3, phase: 'Release Jaw & Brow', instruction: 'Close eyes softly, let tongue drop away from palate, relax forehead.' },
      { step: 4, phase: 'Pure Stillness', instruction: 'Remain motionless for 5 to 10 minutes, drifting into peaceful awareness.' }
    ]
  }
};

export function lookupPose(query: string): PoseDetailData {
  const q = query.toLowerCase();
  for (const key of Object.keys(POSE_DICTIONARY)) {
    if (q.includes(key)) {
      return POSE_DICTIONARY[key];
    }
  }

  if (q.includes('dog') || q.includes('adho')) return POSE_DICTIONARY.downdog;
  if (q.includes('warrior') || q.includes('virabh')) return POSE_DICTIONARY.warrior2;
  if (q.includes('tree') || q.includes('vrks')) return POSE_DICTIONARY.tree;
  if (q.includes('child') || q.includes('bala')) return POSE_DICTIONARY.balasana;
  if (q.includes('sphinx') || q.includes('cobra') || q.includes('bhujang')) return POSE_DICTIONARY.sphinx;
  if (q.includes('bridge') || q.includes('setu')) return POSE_DICTIONARY.bridge;
  if (q.includes('savasana') || q.includes('corpse')) return POSE_DICTIONARY.savasana;
  if (q.includes('cat') || q.includes('cow') || q.includes('marjar')) return POSE_DICTIONARY.spine;
  if (q.includes('heart') || q.includes('anahat') || q.includes('puppy')) return POSE_DICTIONARY.heart;
  if (q.includes('wall') || q.includes('vipar') || q.includes('prana')) return POSE_DICTIONARY.prana;
  if (q.includes('ground') || q.includes('tadas') || q.includes('mountain')) return POSE_DICTIONARY.grounding;

  // Fallback
  return {
    id: 'pose-custom',
    name: query,
    sanskritName: 'Asana Sadhana',
    category: 'Gentle Yoga',
    theme: 'Mindful posture awareness and breath integration',
    durationSeconds: 180,
    clinicalCue: 'Maintain steady alignment without straining. Keep breath effortless and calm.',
    commonMistake: 'Holding the breath or forcing joints beyond anatomical ease.',
    breathRhythm: { inhale: 4, retain: 2, exhale: 4, settle: 2 }
  };
}
