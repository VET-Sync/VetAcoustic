// VERIFY WITH VET
// VetAcoustics - Editable Species & Auscultation Landmark Configuration
// Landmarks are approximate - verify with the supervising veterinarian.
// Rib overlay and site coordinates are computed dynamically from ribLayout and relative rib positions.

const DEFAULT_TECHNIQUE_TIPS = [
  'Part the hair coat to minimize friction artifact',
  'Maintain firm, steady diaphragm or bell contact',
  'Keep the patient standing or sternal and still'
];

const TRACHEA_SITES = [
  {
    id: 'trachea_larynx',
    label: 'Larynx',
    side: 'ventral',
    instruction: 'Ventral neck midline, larynx region (just caudal to the mandible and cricoid cartilage).',
    tips: [
      'Use light-to-moderate pressure over the laryngeal cartilages',
      'Part dense cervical hair to prevent crackle-like artifact',
      'Extend the head slightly while keeping the patient calm'
    ],
    position: { fromRib: 0.15, toRib: 0.25, dorsoventral: 0.28, isNeck: true }
  },
  {
    id: 'trachea_mid_cervical',
    label: 'Mid-cervical',
    side: 'ventral',
    instruction: 'Ventral neck midline, mid-cervical trachea.',
    tips: [
      'Center the chestpiece directly over the tracheal rings on ventral midline',
      'Avoid excessive pressure that could induce a cough reflex',
      'Listen through at least 3 full inspiratory and expiratory cycles'
    ],
    position: { fromRib: 0.45, toRib: 0.55, dorsoventral: 0.55, isNeck: true }
  },
  {
    id: 'trachea_thoracic_inlet',
    label: 'Thoracic inlet',
    side: 'ventral',
    instruction: 'Ventral neck midline, thoracic inlet (cranial to the manubrium).',
    tips: [
      'Nestle the stethoscope diaphragm into the depression cranial to the manubrium',
      'Part longer chest hair thoroughly',
      'Compare inspiratory vs. expiratory phase airflow pitch'
    ],
    position: { fromRib: 0.78, toRib: 0.90, dorsoventral: 0.82, isNeck: true }
  }
];

function createStandardLungSites(speciesKey, useDogConfirmedNumbers) {
  const sides = ['left', 'right'];
  const sites = [];

  sides.forEach((side) => {
    const sideCap = side === 'left' ? 'Left side' : 'Right side';
    const sideShort = side === 'left' ? 'L' : 'R';

    sites.push(
      {
        id: `${speciesKey}_lung_${side}_cranial_dorsal`,
        label: `Cranial Dorsal (${sideShort})`,
        side: side,
        instruction: useDogConfirmedNumbers
          ? `${sideCap}, 3rd-5th intercostal space, dorsal half of the thorax.`
          : 'Landmark to be confirmed by veterinarian',
        tips: DEFAULT_TECHNIQUE_TIPS,
        position: { fromRib: 3, toRib: 5, dorsoventral: 0.32 }
      },
      {
        id: `${speciesKey}_lung_${side}_cranial_ventral`,
        label: `Cranial Ventral (${sideShort})`,
        side: side,
        instruction: useDogConfirmedNumbers
          ? `${sideCap}, 3rd-5th intercostal space, ventral half of the thorax.`
          : 'Landmark to be confirmed by veterinarian',
        tips: DEFAULT_TECHNIQUE_TIPS,
        position: { fromRib: 3, toRib: 5, dorsoventral: 0.68 }
      },
      {
        id: `${speciesKey}_lung_${side}_mid_dorsal`,
        label: `Mid Dorsal (${sideShort})`,
        side: side,
        instruction: useDogConfirmedNumbers
          ? `${sideCap}, 6th-8th intercostal space, dorsal half of the thorax.`
          : 'Landmark to be confirmed by veterinarian',
        tips: DEFAULT_TECHNIQUE_TIPS,
        position: { fromRib: 6, toRib: 8, dorsoventral: 0.32 }
      },
      {
        id: `${speciesKey}_lung_${side}_mid_ventral`,
        label: `Mid Ventral (${sideShort})`,
        side: side,
        instruction: useDogConfirmedNumbers
          ? `${sideCap}, 6th-8th intercostal space, ventral half of the thorax.`
          : 'Landmark to be confirmed by veterinarian',
        tips: DEFAULT_TECHNIQUE_TIPS,
        position: { fromRib: 6, toRib: 8, dorsoventral: 0.68 }
      },
      {
        id: `${speciesKey}_lung_${side}_caudal_dorsal`,
        label: `Caudal Dorsal (${sideShort})`,
        side: side,
        instruction: useDogConfirmedNumbers
          ? `${sideCap}, 9th-11th intercostal space, dorsal half of the thorax.`
          : 'Landmark to be confirmed by veterinarian',
        tips: DEFAULT_TECHNIQUE_TIPS,
        position: { fromRib: 9, toRib: 11, dorsoventral: 0.32 }
      },
      {
        id: `${speciesKey}_lung_${side}_caudal_ventral`,
        label: `Caudal Ventral (${sideShort})`,
        side: side,
        instruction: useDogConfirmedNumbers
          ? `${sideCap}, 9th-11th intercostal space, ventral half of the thorax.`
          : 'Landmark to be confirmed by veterinarian',
        tips: DEFAULT_TECHNIQUE_TIPS,
        position: { fromRib: 9, toRib: 11, dorsoventral: 0.68 }
      }
    );
  });

  return sites;
}

const ANATOMY_DATA = {
  Dog: {
    id: 'Dog',
    name: 'Dog',
    clinicalLabel: 'Canine (Canis lupus familiaris)',
    subtitle: '13 ribs · Standard small animal thoracic & tracheal protocol',
    ribCount: 13,
    svgPath: 'assets/animals/dog.svg',
    ribLayout: {
      firstRibX: 308,
      lastRibX: 484,
      topY: 194,
      bottomY: 304,
      curveBend: 14,
      slopeX: 16
    },
    neckLayout: {
      startX: 215,
      endX: 295,
      topY: 155,
      bottomY: 238
    },
    targets: [
      {
        id: 'Lungs',
        label: 'Lungs',
        defaultSide: 'left',
        supportedSides: ['left', 'right'],
        summary: 'Cranial (3rd-5th), Mid (6th-8th), and Caudal (9th-11th) intercostal spaces across dorsal and ventral fields.',
        sites: createStandardLungSites('dog', true)
      },
      {
        id: 'Heart',
        label: 'Heart',
        defaultSide: 'left',
        supportedSides: ['left', 'right'],
        summary: 'Left 3rd-6th ICS (Pulmonic, Aortic, Mitral valve areas) and Right 3rd-4th ICS (Tricuspid valve area).',
        sites: [
          {
            id: 'dog_heart_pulmonic',
            label: 'Pulmonic Valve (L 3rd ICS)',
            side: 'left',
            instruction: 'Left side, 3rd intercostal space, lower third of the thorax (pulmonic valve area, within 3rd-6th ICS cardiac region).',
            tips: [
              'Draw the left forelimb slightly cranially to expose the 3rd intercostal space',
              'Part hair and maintain firm contact at the sternal border',
              'Keep the patient standing or sternal with mouth closed if possible'
            ],
            position: { fromRib: 3, toRib: 4, dorsoventral: 0.78 }
          },
          {
            id: 'dog_heart_aortic',
            label: 'Aortic Valve (L 4th ICS)',
            side: 'left',
            instruction: 'Left side, 4th intercostal space, lower third of the thorax just dorsal to the costochondral junction (aortic valve area).',
            tips: [
              'Move one intercostal space caudal and slightly dorsal from the pulmonic area',
              'Part the hair coat thoroughly for clean acoustic coupling',
              'Simultaneously palpate the femoral pulse to time S1 and S2'
            ],
            position: { fromRib: 4, toRib: 5, dorsoventral: 0.66 }
          },
          {
            id: 'dog_heart_mitral',
            label: 'Mitral Valve (L 5th ICS)',
            side: 'left',
            instruction: 'Left side, 5th intercostal space at the costochondral junction, lower third of the thorax (mitral valve apex).',
            tips: [
              'Palpate the left apical impulse (PMI) at the 5th ICS costochondral junction',
              'Apply steady diaphragm pressure over the cardiac apex',
              'Keep the patient still to isolate systolic murmurs'
            ],
            position: { fromRib: 5, toRib: 6, dorsoventral: 0.80 }
          },
          {
            id: 'dog_heart_tricuspid',
            label: 'Tricuspid Valve (R 3rd-4th ICS)',
            side: 'right',
            instruction: 'Right side, 3rd-4th intercostal space, lower third of the thorax (tricuspid valve area).',
            tips: [
              'Position stethoscope on the right hemithorax at the 3rd-4th intercostal space',
              'Part hair and maintain firm contact in the ventral third',
              'Compare murmur intensity against the left cardiac apex'
            ],
            position: { fromRib: 3, toRib: 4.5, dorsoventral: 0.74 }
          }
        ]
      },
      {
        id: 'Trachea',
        label: 'Trachea',
        defaultSide: 'ventral',
        supportedSides: ['ventral', 'left', 'right'],
        summary: 'Ventral neck midline across Larynx, Mid-cervical, and Thoracic inlet landmarks.',
        sites: TRACHEA_SITES.map((s) => ({ ...s, id: `dog_${s.id}` }))
      }
    ]
  },

  Cat: {
    id: 'Cat',
    name: 'Cat',
    clinicalLabel: 'Feline (Felis catus)',
    subtitle: '13 ribs · Compact feline thoracic & upper airway protocol',
    ribCount: 13,
    svgPath: 'assets/animals/cat.svg',
    ribLayout: {
      firstRibX: 318,
      lastRibX: 482,
      topY: 192,
      bottomY: 294,
      curveBend: 12,
      slopeX: 14
    },
    neckLayout: {
      startX: 222,
      endX: 298,
      topY: 164,
      bottomY: 236
    },
    targets: [
      {
        id: 'Lungs',
        label: 'Lungs',
        defaultSide: 'left',
        supportedSides: ['left', 'right'],
        summary: 'Bilateral feline pulmonary fields (Cranial, Mid, Caudal dorsal and ventral zones).',
        sites: createStandardLungSites('cat', false)
      },
      {
        id: 'Heart',
        label: 'Heart',
        defaultSide: 'left',
        supportedSides: ['left', 'right'],
        summary: 'Feline parasternal and apical cardiac listening windows.',
        sites: [
          {
            id: 'cat_heart_left_base',
            label: 'Left Cardiac Base (L)',
            side: 'left',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 3, toRib: 4.5, dorsoventral: 0.72 }
          },
          {
            id: 'cat_heart_left_apex',
            label: 'Left Parasternal / Apex (L)',
            side: 'left',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 4.5, toRib: 6, dorsoventral: 0.82 }
          },
          {
            id: 'cat_heart_right_parasternal',
            label: 'Right Parasternal (R)',
            side: 'right',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 3.5, toRib: 5, dorsoventral: 0.76 }
          }
        ]
      },
      {
        id: 'Trachea',
        label: 'Trachea',
        defaultSide: 'ventral',
        supportedSides: ['ventral', 'left', 'right'],
        summary: 'Ventral neck midline across Larynx, Mid-cervical, and Thoracic inlet landmarks.',
        sites: TRACHEA_SITES.map((s) => ({ ...s, id: `cat_${s.id}` }))
      }
    ]
  },

  Horse: {
    id: 'Horse',
    name: 'Horse',
    clinicalLabel: 'Equine (Equus caballus)',
    subtitle: '18 ribs · Equine thoracic, tracheal & 4-quadrant GI protocol',
    ribCount: 18,
    svgPath: 'assets/animals/horse.svg',
    ribLayout: {
      firstRibX: 306,
      lastRibX: 548,
      topY: 180,
      bottomY: 288,
      curveBend: 16,
      slopeX: 18
    },
    neckLayout: {
      startX: 196,
      endX: 292,
      topY: 136,
      bottomY: 222
    },
    targets: [
      {
        id: 'Lungs',
        label: 'Lungs',
        defaultSide: 'left',
        supportedSides: ['left', 'right'],
        summary: 'Equine bilateral pulmonary fields across cranial, mid, and caudodorsal lung borders.',
        sites: [
          {
            id: 'horse_lung_left_cranial_dorsal',
            label: 'Cranial Dorsal (L)',
            side: 'left',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 4, toRib: 7, dorsoventral: 0.34 }
          },
          {
            id: 'horse_lung_left_cranial_ventral',
            label: 'Cranial Ventral (L)',
            side: 'left',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 4, toRib: 7, dorsoventral: 0.68 }
          },
          {
            id: 'horse_lung_left_mid_dorsal',
            label: 'Mid Dorsal (L)',
            side: 'left',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 8, toRib: 12, dorsoventral: 0.32 }
          },
          {
            id: 'horse_lung_left_mid_ventral',
            label: 'Mid Ventral (L)',
            side: 'left',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 8, toRib: 12, dorsoventral: 0.66 }
          },
          {
            id: 'horse_lung_left_caudal_dorsal',
            label: 'Caudal Dorsal (L)',
            side: 'left',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 13, toRib: 16, dorsoventral: 0.30 }
          },
          {
            id: 'horse_lung_right_cranial_dorsal',
            label: 'Cranial Dorsal (R)',
            side: 'right',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 4, toRib: 7, dorsoventral: 0.34 }
          },
          {
            id: 'horse_lung_right_mid_dorsal',
            label: 'Mid Dorsal (R)',
            side: 'right',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 8, toRib: 12, dorsoventral: 0.32 }
          },
          {
            id: 'horse_lung_right_caudal_dorsal',
            label: 'Caudal Dorsal (R)',
            side: 'right',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 13, toRib: 16, dorsoventral: 0.30 }
          }
        ]
      },
      {
        id: 'Heart',
        label: 'Heart',
        defaultSide: 'left',
        supportedSides: ['left', 'right'],
        summary: 'Equine cardiac auscultation deep to the triceps mass on left and right hemithorax.',
        sites: [
          {
            id: 'horse_heart_left_base',
            label: 'Left Heart Base (L)',
            side: 'left',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 3, toRib: 5, dorsoventral: 0.66 }
          },
          {
            id: 'horse_heart_left_apex',
            label: 'Left Cardiac Apex (L)',
            side: 'left',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 5, toRib: 6, dorsoventral: 0.78 }
          },
          {
            id: 'horse_heart_right',
            label: 'Right Cardiac Area (R)',
            side: 'right',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 3, toRib: 5, dorsoventral: 0.74 }
          }
        ]
      },
      {
        id: 'Trachea',
        label: 'Trachea',
        defaultSide: 'ventral',
        supportedSides: ['ventral', 'left', 'right'],
        summary: 'Ventral neck midline across Larynx, Mid-cervical, and Thoracic inlet landmarks.',
        sites: TRACHEA_SITES.map((s) => ({ ...s, id: `horse_${s.id}` }))
      },
      {
        id: 'Abdomen',
        label: 'Abdomen / GI',
        defaultSide: 'left',
        supportedSides: ['left', 'right'],
        summary: 'Four abdominal quadrants: Left Dorsal, Left Ventral, Right Dorsal (cecal base), and Right Ventral.',
        sites: [
          {
            id: 'horse_gi_left_dorsal',
            label: 'Left Dorsal Quadrant (L)',
            side: 'left',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 15, toRib: 18, dorsoventral: 0.34 }
          },
          {
            id: 'horse_gi_left_ventral',
            label: 'Left Ventral Quadrant (L)',
            side: 'left',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 14, toRib: 17.5, dorsoventral: 0.74 }
          },
          {
            id: 'horse_gi_right_dorsal',
            label: 'Right Dorsal / Cecal (R)',
            side: 'right',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 15, toRib: 18, dorsoventral: 0.34 }
          },
          {
            id: 'horse_gi_right_ventral',
            label: 'Right Ventral Quadrant (R)',
            side: 'right',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 14, toRib: 17.5, dorsoventral: 0.74 }
          }
        ]
      }
    ]
  },

  Cattle: {
    id: 'Cattle',
    name: 'Cattle',
    clinicalLabel: 'Bovine (Bos taurus)',
    subtitle: '13 ribs · Bovine cardiopulmonary & ruminal motility protocol',
    ribCount: 13,
    svgPath: 'assets/animals/cattle.svg',
    ribLayout: {
      firstRibX: 308,
      lastRibX: 486,
      topY: 162,
      bottomY: 304,
      curveBend: 14,
      slopeX: 16
    },
    neckLayout: {
      startX: 196,
      endX: 292,
      topY: 172,
      bottomY: 242
    },
    targets: [
      {
        id: 'Lungs',
        label: 'Lungs',
        defaultSide: 'left',
        supportedSides: ['left', 'right'],
        summary: 'Bovine cranioventral and caudodorsal lung fields.',
        sites: createStandardLungSites('cattle', false)
      },
      {
        id: 'Heart',
        label: 'Heart',
        defaultSide: 'left',
        supportedSides: ['left', 'right'],
        summary: 'Bovine cardiac window medial to the elbow.',
        sites: [
          {
            id: 'cattle_heart_left_base',
            label: 'Left Cardiac Area (L)',
            side: 'left',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 3, toRib: 4.5, dorsoventral: 0.74 }
          },
          {
            id: 'cattle_heart_left_apex',
            label: 'Left Ventral Apex (L)',
            side: 'left',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 4, toRib: 5.5, dorsoventral: 0.82 }
          },
          {
            id: 'cattle_heart_right',
            label: 'Right Cardiac Area (R)',
            side: 'right',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 3, toRib: 4.5, dorsoventral: 0.76 }
          }
        ]
      },
      {
        id: 'Trachea',
        label: 'Trachea',
        defaultSide: 'ventral',
        supportedSides: ['ventral', 'left', 'right'],
        summary: 'Ventral neck midline across Larynx, Mid-cervical, and Thoracic inlet landmarks.',
        sites: TRACHEA_SITES.map((s) => ({ ...s, id: `cattle_${s.id}` }))
      },
      {
        id: 'Rumen',
        label: 'Rumen / GI',
        defaultSide: 'left',
        supportedSides: ['left', 'right'],
        summary: 'Left paralumbar fossa ruminal contractions and right abdominal viscus.',
        sites: [
          {
            id: 'cattle_rumen_dorsal_sac',
            label: 'Left Paralumbar / Dorsal Rumen (L)',
            side: 'left',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: [
              'Place diaphragm firmly in the left paralumbar fossa',
              'Evaluate primary and secondary ruminal contraction frequency over 2-3 minutes',
              'Part coarse hair coat to minimize background rustle'
            ],
            position: { fromRib: 11, toRib: 13, dorsoventral: 0.35 }
          },
          {
            id: 'cattle_rumen_ventral_sac',
            label: 'Left Ventral Rumen Sac (L)',
            side: 'left',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 10, toRib: 12.5, dorsoventral: 0.72 }
          },
          {
            id: 'cattle_gi_right_flank',
            label: 'Right Paralumbar / Abomasal-Cecal (R)',
            side: 'right',
            instruction: 'Landmark to be confirmed by veterinarian',
            tips: DEFAULT_TECHNIQUE_TIPS,
            position: { fromRib: 10, toRib: 13, dorsoventral: 0.45 }
          }
        ]
      }
    ]
  }
};

// Geometry conversion utilities: maps relative rib/dorsoventral positions into SVG viewBox (0 0 800 500) coordinates
const AnatomyGeometry = {
  /**
   * Computes the SVG (x, y) coordinate for a given rib number (1..ribCount) and dorsoventral ratio (0..1)
   * Ribs curve and slope caudoventrally as they descend from dorsal spine to ventral sternum.
   */
  ribToSvgPoint(speciesConfig, ribNumber, dorsoventral) {
    const layout = speciesConfig.ribLayout;
    const totalRibs = speciesConfig.ribCount;
    const clampedRib = Math.max(1, Math.min(totalRibs + 3, ribNumber));
    const tRib = (clampedRib - 1) / Math.max(1, totalRibs - 1);

    const topX = layout.firstRibX + tRib * (layout.lastRibX - layout.firstRibX);
    const dv = Math.max(0, Math.min(1, dorsoventral));

    // Quadratic Bezier interpolation along the curved rib sloping caudoventrally
    const startX = topX;
    const startY = layout.topY;
    const endX = topX + layout.slopeX * (1 - 0.15 * tRib);
    const endY = layout.bottomY - tRib * 12; // Caudal costal arch rises slightly
    const ctrlX = topX + layout.curveBend + layout.slopeX * 0.65;
    const ctrlY = startY + (endY - startY) * 0.52;

    const oneMinusT = 1 - dv;
    const x = oneMinusT * oneMinusT * startX + 2 * oneMinusT * dv * ctrlX + dv * dv * endX;
    const y = oneMinusT * oneMinusT * startY + 2 * oneMinusT * dv * ctrlY + dv * dv * endY;

    return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
  },

  /**
   * Converts a site's relative position { fromRib, toRib, dorsoventral, isNeck } into SVG (x, y)
   */
  siteToSvgPoint(speciesConfig, sitePosition) {
    if (sitePosition.isNeck) {
      const neck = speciesConfig.neckLayout;
      const t = (sitePosition.fromRib + sitePosition.toRib) / 2;
      const x = neck.startX + t * (neck.endX - neck.startX);
      const y = neck.topY + sitePosition.dorsoventral * (neck.bottomY - neck.topY);
      return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    }
    const midRib = (sitePosition.fromRib + sitePosition.toRib) / 2;
    return this.ribToSvgPoint(speciesConfig, midRib, sitePosition.dorsoventral);
  },

  /**
   * Generates SVG path data and intercostal space number badges for all ribs of a species
   */
  generateRibOverlayData(speciesConfig) {
    const ribs = [];
    const spaces = [];
    const totalRibs = speciesConfig.ribCount;

    for (let r = 1; r <= totalRibs; r++) {
      const top = this.ribToSvgPoint(speciesConfig, r, 0);
      const mid = this.ribToSvgPoint(speciesConfig, r, 0.5);
      const bottom = this.ribToSvgPoint(speciesConfig, r, 1);
      // Reconstruct control point so quadratic curve passes through mid
      const ctrlX = 2 * mid.x - 0.5 * (top.x + bottom.x);
      const ctrlY = 2 * mid.y - 0.5 * (top.y + bottom.y);
      ribs.push({
        ribNumber: r,
        path: `M ${top.x} ${top.y} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${bottom.x} ${bottom.y}`,
        top,
        bottom
      });

      if (r < totalRibs) {
        const spacePos = this.ribToSvgPoint(speciesConfig, r + 0.5, 0.16);
        spaces.push({
          spaceNumber: r,
          x: spacePos.x,
          y: spacePos.y
        });
      }
    }

    return { ribs, spaces };
  },

  /**
   * Computes a smooth highlighted region polygon/box around all sites of the active target & side
   */
  computeTargetRegionBounds(speciesConfig, sites) {
    if (!sites || sites.length === 0) return null;
    const pts = sites.map((s) => this.siteToSvgPoint(speciesConfig, s.position));
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const padX = 28;
    const padY = 24;
    const minX = Math.min(...xs) - padX;
    const maxX = Math.max(...xs) + padX;
    const minY = Math.min(...ys) - padY;
    const maxY = Math.max(...ys) + padY;
    return {
      x: minX,
      y: minY,
      width: Math.max(56, maxX - minX),
      height: Math.max(48, maxY - minY),
      rx: 22
    };
  }
};

window.ANATOMY_DATA = ANATOMY_DATA;
window.AnatomyGeometry = AnatomyGeometry;
