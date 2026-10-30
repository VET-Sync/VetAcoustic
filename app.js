// VetAcoustics - Phase 1 Clinical Frontend Application (Vanilla JavaScript)
// Structured with a clean DataService layer ready for Phase 2 Flask + Database backend swap.

(function () {
  'use strict';

  // =========================================================================
  // 1. SPECIES-AWARE CLINICAL ACOUSTIC LOOKUP TABLE (12+ Combinations)
  // =========================================================================
  const CLINICAL_LOOKUP_TABLE = [
    {
      species: 'Dog',
      target: 'Heart',
      predictedSound: 'Grade III/VI Left Apical Holosystolic Murmur',
      status: 'Abnormal',
      attentionBand: '180–620 Hz · Systolic Band',
      attentionBox: { leftPct: 24, widthPct: 38 },
      summary: 'Plateau-shaped holosystolic murmur maximal over the left 5th intercostal space at the costochondral junction (mitral valve area).',
      differentials: [
        { name: 'Myxomatous Mitral Valve Disease (MMVD / ACVIM Stage B1–B2)', probability: 'High (78%)', note: 'Classic signalment and left apical point of maximal intensity.' },
        { name: 'Infective Endocarditis (Mitral Valve)', probability: 'Moderate (14%)', note: 'Consider if accompanied by fever, lameness, or acute onset.' },
        { name: 'Dilated Cardiomyopathy (DCM) with Secondary Annular Dilation', probability: 'Low (8%)', note: 'More prevalent in large-breed dogs; evaluate chamber dimensions.' }
      ],
      recommendedTests: [
        { title: 'Two-Dimensional & Doppler Echocardiography', reason: 'Quantify LA:Ao ratio, LVIDdN, and mitral regurgitant jet velocity.' },
        { title: 'Thoracic Radiographs (3-View)', reason: 'Assess vertebral heart score (VHS) and screen for cardiogenic pulmonary edema.' },
        { title: 'Serum NT-proBNP & Blood Pressure', reason: 'Evaluate myocardial wall stress and rule out systemic hypertension.' }
      ]
    },
    {
      species: 'Dog',
      target: 'Lungs',
      predictedSound: 'Coarse Late-Inspiratory Crackles',
      status: 'Abnormal',
      attentionBand: '320–980 Hz · Late Inspiration',
      attentionBox: { leftPct: 32, widthPct: 34 },
      summary: 'Discontinuous, non-musical explosive adventitious sounds detected between 320 Hz and 980 Hz during late inspiration.',
      differentials: [
        { name: 'Canine Chronic Bronchitis / Bronchiectasis', probability: 'High (68%)', note: 'Airway secretions and sudden reopening of small airways.' },
        { name: 'Cardiogenic Pulmonary Edema', probability: 'Moderate (22%)', note: 'Correlate with left apical auscultation and resting respiratory rate.' },
        { name: 'Bronchopneumonia / Aspiration Pneumonia', probability: 'Low (10%)', note: 'Especially if localized to cranioventral lung lobes.' }
      ],
      recommendedTests: [
        { title: '3-View Thoracic Radiographs (Inspiratory/Expiratory)', reason: 'Differentiate bronchial, interstitial, and alveolar pulmonary patterns.' },
        { title: 'Complete Blood Count (CBC) & C-Reactive Protein', reason: 'Evaluate for inflammatory leukogram or systemic infection.' },
        { title: 'Pulse Oximetry (SpO2) or Arterial Blood Gas', reason: 'Assess oxygenation efficiency at rest.' }
      ]
    },
    {
      species: 'Dog',
      target: 'Trachea',
      predictedSound: 'High-Pitched Inspiratory Goose-Honk Stridor',
      status: 'Abnormal',
      attentionBand: '450–1350 Hz · Cervical Inlet',
      attentionBox: { leftPct: 20, widthPct: 42 },
      summary: 'Monophonic high-frequency turbulent airflow sound localized over the mid-cervical trachea and thoracic inlet.',
      differentials: [
        { name: 'Dynamic Tracheal Collapse (Cervical / Thoracic Inlet)', probability: 'High (76%)', note: 'Classic luminal narrowing during dynamic phase.' },
        { name: 'Laryngeal Paralysis', probability: 'Moderate (16%)', note: 'Evaluate arytenoid abduction under light sedation.' },
        { name: 'Extraluminal Cervical Compression', probability: 'Low (8%)', note: 'Rule out regional lymphadenopathy or mass effect.' }
      ],
      recommendedTests: [
        { title: 'Dynamic Fluoroscopy or Inspiratory/Expiratory Neck Radiographs', reason: 'Visualize dynamic luminal diameter collapse across respiratory phases.' },
        { title: 'Tracheobronchoscopy', reason: 'Grade tracheal ring flattening (Grade I–IV) and collect cytology.' }
      ]
    },
    {
      species: 'Cat',
      target: 'Lungs',
      predictedSound: 'Polyphonic Expiratory Wheezes',
      status: 'Abnormal',
      attentionBand: '380–1100 Hz · Expiratory Phase',
      attentionBox: { leftPct: 36, widthPct: 35 },
      summary: 'Continuous musical high-pitched adventitious sounds predominantly during expiration, consistent with lower airway bronchoconstriction.',
      differentials: [
        { name: 'Feline Lower Airway Disease / Feline Asthma', probability: 'High (74%)', note: 'Eosinophilic airway inflammation and reversible bronchospasm.' },
        { name: 'Feline Chronic Bronchitis', probability: 'Moderate (18%)', note: 'Neutrophilic airway remodeling with daily cough.' },
        { name: 'Heartworm-Associated Respiratory Disease (HARD) / Lungworm', probability: 'Low (8%)', note: 'Aelurostrongylus abstrusus or Dirofilaria immitis exposure.' }
      ],
      recommendedTests: [
        { title: 'Thoracic Radiographs (Lateral & VD)', reason: 'Check for bronchial ("donuts and tramlines") pattern and pulmonary hyperinflation.' },
        { title: 'Baermann Fecal Flotation & Heartworm Antigen/Antibody', reason: 'Screen for parasitic lower airway differentials.' },
        { title: 'Bronchoalveolar Lavage (BAL) Cytology', reason: 'Distinguish eosinophilic vs. neutrophilic airway inflammation.' }
      ]
    },
    {
      species: 'Cat',
      target: 'Heart',
      predictedSound: 'Left Parasternal Systolic Murmur with S4 Gallop',
      status: 'Abnormal',
      attentionBand: '140–520 Hz · Parasternal Window',
      attentionBox: { leftPct: 22, widthPct: 40 },
      summary: 'Dynamic systolic ejection murmur along the left sternal border accompanied by a low-frequency diastolic gallop sound.',
      differentials: [
        { name: 'Hypertrophic Cardiomyopathy (HCM) with SAM of Mitral Valve', probability: 'High (72%)', note: 'Systolic anterior motion causing dynamic LV outflow tract obstruction.' },
        { name: 'Hyperthyroid-Induced Thyrotoxic Myocardial Hypertrophy', probability: 'Moderate (20%)', note: 'Common in senior cats; check total T4.' },
        { name: 'Dynamic Right Ventricular Outflow Tract Obstruction (DRVOTO)', probability: 'Low (8%)', note: 'Benign physiological murmur triggered by sympathetic tone.' }
      ],
      recommendedTests: [
        { title: 'Feline Point-of-Care / Comprehensive Echocardiogram', reason: 'Measure LV wall thickness in diastole (<6 mm normal) and left atrial size.' },
        { title: 'Serum Total T4 & Doppler Systolic Blood Pressure', reason: 'Rule out hyperthyroidism and systemic hypertension.' },
        { title: 'Feline NT-proBNP Assay', reason: 'Assess occult myocardial stretch.' }
      ]
    },
    {
      species: 'Cat',
      target: 'Trachea',
      predictedSound: 'Normal Laminar Tracheal Breath Sounds',
      status: 'Normal',
      attentionBand: '200–750 Hz · Symmetrical Flow',
      attentionBox: { leftPct: 30, widthPct: 30 },
      summary: 'Clear tubular breath sounds across inspiration and expiration without stridor, wheezes, or superimposed purr artifact.',
      differentials: [
        { name: 'Physiological Upper Airway Patency', probability: 'High (91%)', note: 'Normal laminar-to-transitional cervical airflow.' },
        { name: 'Subclinical Mild Rhinitis', probability: 'Low (9%)', note: 'Correlate with nasal airflow if sneezing is reported.' }
      ],
      recommendedTests: [
        { title: 'Routine Clinical Monitoring', reason: 'No immediate upper airway intervention required.' },
        { title: 'Compare with Thoracic Lung Fields', reason: 'Confirm normal vesicular sounds distally.' }
      ]
    },
    {
      species: 'Horse',
      target: 'Lungs',
      predictedSound: 'End-Expiratory Wheezes & Caudodorsal Crackles',
      status: 'Abnormal',
      attentionBand: '260–890 Hz · Caudodorsal Field',
      attentionBox: { leftPct: 34, widthPct: 38 },
      summary: 'Musical end-expiratory wheezes with subtle coarse crackles over the caudodorsal lung field.',
      differentials: [
        { name: 'Severe Equine Asthma (Recurrent Airway Obstruction / Heaves)', probability: 'High (75%)', note: 'Bronchospasm and mucus accumulation in small airways.' },
        { name: 'Mild-to-Moderate Inflammatory Airway Disease (IAD)', probability: 'Moderate (17%)', note: 'Poor performance and intermittent cough.' },
        { name: 'Equine Pleuropneumonia', probability: 'Low (8%)', note: 'Evaluate ventral lung fields for fluid line attenuation.' }
      ],
      recommendedTests: [
        { title: 'Rebreathing Bag Auscultation & Endoscopic Mucus Scoring', reason: 'Accentuate subtle peripheral airway sounds and grade tracheal mucus.' },
        { title: 'Bronchoalveolar Lavage (BAL) or Transtracheal Wash (TTW)', reason: 'Quantify bronchoalveolar neutrophil/mast cell percentages.' },
        { title: 'Thoracic Ultrasonography', reason: 'Evaluate pleural surface for comet-tail artifacts or effusion.' }
      ]
    },
    {
      species: 'Horse',
      target: 'Abdomen',
      predictedSound: 'Hypermotile Fluid-Gas Cecal & Colonic Borborygmi',
      status: 'Normal',
      attentionBand: '80–420 Hz · Propulsive Mixing',
      attentionBox: { leftPct: 18, widthPct: 46 },
      summary: 'Regular progressive low-frequency mixing and propulsive cecal/ventral colon contractions (2–3 rushes per minute).',
      differentials: [
        { name: 'Normal Equine Hindgut Motility', probability: 'High (85%)', note: 'Regular coordinated haustral and propulsive contractions.' },
        { name: 'Mild Spasmodic / Gas Hypermotility', probability: 'Low (15%)', note: 'Correlate with heart rate, mucous membranes, and comfort.' }
      ],
      recommendedTests: [
        { title: '4-Quadrant Serial Auscultation Comparison', reason: 'Compare dorsal and ventral quadrants bilaterally.' },
        { title: 'Digital Pulse & Hydration Check', reason: 'Routine colic/GI wellness baseline.' }
      ]
    },
    {
      species: 'Horse',
      target: 'Heart',
      predictedSound: 'Normal S1–S2 Cadence with Physiological Second-Degree AV Block',
      status: 'Normal',
      attentionBand: '40–240 Hz · Low-Frequency Valve Closure',
      attentionBox: { leftPct: 26, widthPct: 34 },
      summary: 'Crisp S1 and S2 heart sounds at 36 bpm with occasional dropped ventricular beat preceded by S4, resolving with mild exercise.',
      differentials: [
        { name: 'Physiological High Vagal Tone (Equine 2nd-Degree AV Block)', probability: 'High (88%)', note: 'Normal finding in fit resting horses; disappears when heart rate rises.' },
        { name: 'Pathological Conduction Delay', probability: 'Low (12%)', note: 'Rule out if persistent during exercise or accompanied by weakness.' }
      ],
      recommendedTests: [
        { title: 'Post-Exercise Auscultation Check', reason: 'Verify sinus rhythm restoration upon trotting or excitement.' },
        { title: 'Base-Apex Electrocardiogram (ECG)', reason: 'Confirm P-wave morphology and PR interval consistency.' }
      ]
    },
    {
      species: 'Cattle',
      target: 'Rumen',
      predictedSound: 'Hypomotile Ruminal Contractions with High-Pitched Fluid Ping',
      status: 'Abnormal',
      attentionBand: '420–1200 Hz · Tympanic Resonance',
      attentionBox: { leftPct: 30, widthPct: 36 },
      summary: 'Reduced primary ruminal stratification rushes (<1 per 2 minutes) with a localized high-pitched metallic resonance over the left ribcage.',
      differentials: [
        { name: 'Left Displaced Abomasum (LDA)', probability: 'High (77%)', note: 'Classic tympanic ping between ribs 9 and 13 on the left side.' },
        { name: 'Ruminal Tympany / Free-Gas Bloat', probability: 'Moderate (15%)', note: 'Dorsal gas cap distension in the left paralumbar fossa.' },
        { name: 'Secondary Ruminal Stasis (Hypocalcemia / Ketosis)', probability: 'Low (8%)', note: 'Evaluate systemic metabolic status.' }
      ],
      recommendedTests: [
        { title: 'Simultaneous Percussion & Auscultation ("Ping" Mapping)', reason: 'Delineate the dorsoventral and craniocaudal boundaries of the gas-fluid interface.' },
        { title: 'Blood Beta-Hydroxybutyrate (BHB) & Ionized Calcium', reason: 'Screen for concurrent ketosis and subclinical milk fever.' },
        { title: 'Liptak Test / Ultrasound of Left Intercostal Spaces', reason: 'Confirm abomasal pH (<3.0) or pyloric displacement.' }
      ]
    },
    {
      species: 'Cattle',
      target: 'Lungs',
      predictedSound: 'Cranioventral Bronchial Breath Sounds & Pleural Friction Rub',
      status: 'Abnormal',
      attentionBand: '240–860 Hz · Cranioventral Field',
      attentionBox: { leftPct: 25, widthPct: 40 },
      summary: 'Harsh tubular breath sounds with coarse crackles localized to the cranioventral lung field.',
      differentials: [
        { name: 'Bovine Respiratory Disease (BRD) / Mannheimia haemolytica', probability: 'High (79%)', note: 'Fibrinous pleuropneumonia affecting cranioventral lobes.' },
        { name: 'Mycoplasma bovis Bronchopneumonia', probability: 'Moderate (14%)', note: 'Chronic cough, otitis, or polyarthritis association.' },
        { name: 'Parasitic Bronchitis (Dictyocaulus viviparus)', probability: 'Low (7%)', note: 'More prominent in pasture-grazed cattle (caudodorsal lobes).' }
      ],
      recommendedTests: [
        { title: 'Thoracic Ultrasonography (3rd–7th ICS)', reason: 'Detect cranioventral pulmonary consolidation and fibrinous pleural effusion.' },
        { title: 'Rectal Temperature & Wisconsin Calf/Bovine Respiratory Score', reason: 'Quantify systemic febrile response and clinical severity.' }
      ]
    },
    {
      species: 'Cattle',
      target: 'Heart',
      predictedSound: 'Muffled Heart Sounds with Pericardial Splashing Friction',
      status: 'Abnormal',
      attentionBand: '110–540 Hz · Ventral Thorax',
      attentionBox: { leftPct: 28, widthPct: 38 },
      summary: 'Attenuated S1/S2 intensity accompanied by asynchronous fluid-gas splashing sounds medial to the left elbow.',
      differentials: [
        { name: 'Traumatic Reticuloperitonitis / Pericarditis (Hardware Disease)', probability: 'High (81%)', note: 'Penetrating metallic foreign body from reticulum into pericardial sac.' },
        { name: 'Idiopathic / Lymphoma Pericardial Effusion', probability: 'Moderate (19%)', note: 'Evaluate jugular venous distension and brisket edema.' }
      ],
      recommendedTests: [
        { title: 'Thoracic & Reticular Ultrasonography', reason: 'Visualize fibrinous pericardial effusion and reticular motility.' },
        { title: 'Withers Pinch / Xiphoid Pain Test & Total Plasma Protein', reason: 'Assess cranial abdominal pain and hyperfibrinogenemia.' }
      ]
    }
  ];

  // =========================================================================
  // 2. DATA LAYER: DataService (All visit & analysis operations go through here)
  // =========================================================================
  const STORAGE_KEYS = {
    VISITS: 'vetacoustics_visits_v1',
    WAV_COUNTER: 'vetacoustics_wav_counter_v1',
    THEME: 'vetacoustics_theme_v1',
    COLLECTION_MODE: 'vetacoustics_collection_mode_v1',
    SIM_AUDIO: 'vetacoustics_sim_audio_v1'
  };

  function createSeededDemoVisits() {
    const now = Date.now();
    return [
      {
        id: 'visit_demo_101',
        timestamp: now - 2 * 3600 * 1000, // 2h ago
        species: 'Dog',
        target: 'Heart',
        side: 'left',
        siteId: 'dog_heart_mitral',
        siteLabel: 'Mitral Valve (L 5th ICS)',
        patientName: 'Barnaby',
        patientBreed: 'Cavalier King Charles · 7y MN',
        notes: 'Resting HR 108 bpm, soft nocturnal cough reported by owner.',
        finding: 'Wheezes',
        caseId: 'CASE-2026-101',
        wavFilename: 'Dog_Heart_Left_dog_heart_mitral_Barnaby_001.wav',
        analysisResult: {
          predictedSound: 'Grade III/VI Left Apical Holosystolic Murmur',
          confidence: 88,
          status: 'Abnormal',
          attentionBand: '180–620 Hz · Systolic Band',
          attentionBox: { leftPct: 24, widthPct: 38 },
          summary: 'Plateau-shaped holosystolic murmur maximal over the left 5th intercostal space at the costochondral junction (mitral valve area).',
          differentials: CLINICAL_LOOKUP_TABLE[0].differentials,
          recommendedTests: CLINICAL_LOOKUP_TABLE[0].recommendedTests
        }
      },
      {
        id: 'visit_demo_102',
        timestamp: now - 6 * 3600 * 1000, // 6h ago
        species: 'Horse',
        target: 'Abdomen',
        side: 'left',
        siteId: 'horse_gi_left_ventral',
        siteLabel: 'Left Ventral Quadrant (L)',
        patientName: 'Apollo',
        patientBreed: 'Warmblood Gelding · 11y',
        notes: 'Post-competition wellness check. Normal appetite and manure output.',
        finding: 'Normal',
        caseId: 'CASE-2026-102',
        wavFilename: 'Horse_Abdomen_Left_horse_gi_left_ventral_Apollo_002.wav',
        analysisResult: {
          predictedSound: 'Hypermotile Fluid-Gas Cecal & Colonic Borborygmi',
          confidence: 91,
          status: 'Normal',
          attentionBand: '80–420 Hz · Propulsive Mixing',
          attentionBox: { leftPct: 18, widthPct: 46 },
          summary: 'Regular progressive low-frequency mixing and propulsive cecal/ventral colon contractions (2–3 rushes per minute).',
          differentials: CLINICAL_LOOKUP_TABLE[7].differentials,
          recommendedTests: CLINICAL_LOOKUP_TABLE[7].recommendedTests
        }
      },
      {
        id: 'visit_demo_103',
        timestamp: now - 26 * 3600 * 1000, // 1d ago
        species: 'Cat',
        target: 'Lungs',
        side: 'right',
        siteId: 'cat_lung_right_cranial_ventral',
        siteLabel: 'Cranial Ventral (R)',
        patientName: 'Milo',
        patientBreed: 'Domestic Shorthair · 4y MN',
        notes: 'Mild tachypnea in exam room; intermittent purring during capture.',
        finding: 'Purring',
        caseId: 'CASE-2026-103',
        wavFilename: 'Cat_Lungs_Right_cat_lung_right_cranial_ventral_Milo_003.wav',
        analysisResult: {
          predictedSound: 'Polyphonic Expiratory Wheezes',
          confidence: 64,
          status: 'Inconclusive',
          attentionBand: '380–1100 Hz · Expiratory Phase',
          attentionBox: { leftPct: 36, widthPct: 35 },
          summary: 'Low-confidence spectral detection due to superimposed feline purr harmonics (25–150 Hz). Rely on clinical judgment.',
          differentials: CLINICAL_LOOKUP_TABLE[3].differentials,
          recommendedTests: CLINICAL_LOOKUP_TABLE[3].recommendedTests
        }
      }
    ];
  }

  const DataService = {
    async getVisits() {
      // PHASE 2: replace with fetch('/api/visits')
      const raw = localStorage.getItem(STORAGE_KEYS.VISITS);
      if (!raw) {
        const seeded = createSeededDemoVisits();
        localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(seeded));
        if (!localStorage.getItem(STORAGE_KEYS.WAV_COUNTER)) {
          localStorage.setItem(STORAGE_KEYS.WAV_COUNTER, '3');
        }
        return seeded;
      }
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      } catch (err) {
        console.error('Error reading visits:', err);
        return [];
      }
    },

    async getVisit(id) {
      // PHASE 2: replace with fetch('/api/visits/' + encodeURIComponent(id))
      const visits = await this.getVisits();
      return visits.find((v) => v.id === id) || null;
    },

    async saveVisit(visit) {
      // PHASE 2: replace with fetch('/api/visits', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(visit) })
      const visits = await this.getVisits();
      const cleanVisit = {
        id: visit.id || 'visit_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        timestamp: visit.timestamp || Date.now(),
        species: visit.species || 'Dog',
        target: visit.target || 'Lungs',
        side: visit.side || 'left',
        siteId: visit.siteId || 'dog_lung_left_cranial_dorsal',
        siteLabel: visit.siteLabel || 'Cranial Dorsal (L)',
        patientName: (visit.patientName || 'Patient').trim(),
        patientBreed: (visit.patientBreed || '').trim(),
        notes: (visit.notes || '').trim(),
        finding: visit.finding || null,
        caseId: visit.caseId || null,
        wavFilename: visit.wavFilename || null,
        protocolRecordings: visit.protocolRecordings || [],
        analysisResult: visit.analysisResult || null
      };

      const existingIdx = visits.findIndex((v) => v.id === cleanVisit.id);
      if (existingIdx >= 0) {
        visits[existingIdx] = cleanVisit;
      } else {
        visits.unshift(cleanVisit);
      }
      localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits));
      return cleanVisit;
    },

    async analyzeAudio(blob, meta) {
      // PHASE 2: replace with fetch('/api/analyze', { method: 'POST', body: formData })
      return new Promise((resolve) => {
        setTimeout(() => {
          const species = meta.species || 'Dog';
          const target = meta.target || 'Lungs';

          // Match species + target from lookup table, or fallback to species match
          let entry = CLINICAL_LOOKUP_TABLE.find(
            (item) => item.species === species && item.target === target
          );
          if (!entry) {
            entry = CLINICAL_LOOKUP_TABLE.find((item) => item.species === species) || CLINICAL_LOOKUP_TABLE[0];
          }

          // Random confidence between 55 and 95 (or forced mode if user toggled re-run)
          let confidence;
          if (typeof meta.forceLowConfidence === 'boolean') {
            confidence = meta.forceLowConfidence
              ? Math.floor(56 + Math.random() * 13) // 56 - 68% (<70% Inconclusive)
              : Math.floor(74 + Math.random() * 21); // 74 - 94% (Confident)
          } else {
            confidence = Math.floor(55 + Math.random() * 41); // 55 - 95%
          }

          const isInconclusive = confidence < 70;
          const finalStatus = isInconclusive ? 'Inconclusive' : entry.status;

          resolve({
            predictedSound: entry.predictedSound,
            confidence: confidence,
            status: finalStatus,
            attentionBand: entry.attentionBand,
            attentionBox: entry.attentionBox,
            summary: entry.summary,
            differentials: entry.differentials,
            recommendedTests: entry.recommendedTests
          });
        }, 3000); // 3-second clinical scanning state per Section A item 8
      });
    }
  };

  window.DataService = DataService;

  // =========================================================================
  // 3. APPLICATION STATE
  // =========================================================================
  const AppState = {
    currentView: 'dashboard',
    guidedStep: 1, // 1: Species, 2: Target & Landmarks, 3: Placement & Capture
    selectedSpecies: 'Dog',
    selectedTarget: 'Lungs',
    selectedSide: 'left',
    selectedSiteId: 'dog_lung_left_cranial_dorsal',
    showRibOverlay: true,
    manualSelectionOpen: false,

    // Guided Protocol Mode
    fullProtocolMode: false,
    completedSiteIds: new Set(),
    protocolRecordings: [],

    // Settings
    collectionMode: localStorage.getItem(STORAGE_KEYS.COLLECTION_MODE) === 'true',
    simAudioMode: localStorage.getItem(STORAGE_KEYS.SIM_AUDIO) === 'true',
    themePref: localStorage.getItem(STORAGE_KEYS.THEME) || 'system',

    // Audio Recording & Playback State
    isRecording: false,
    recordingStartTime: 0,
    recordingDurationSec: 0,
    recordingTimerInterval: null,
    visualizerAnimId: null,
    audioContext: null,
    analyserNode: null,
    mediaStream: null,
    mediaRecorder: null,
    recordedChunks: [],
    pcmFallbackSamples: [],
    pcmSampleRate: 44100,
    simNodes: null,

    // In-memory Recorded Audio & Decoded Buffer
    lastWavBlob: null,
    lastWavUrl: null,
    lastWavFilename: '',
    lastAudioBuffer: null,
    audioElement: new Audio(),
    playbackRafId: null,

    // Active Visit & Analysis Results
    currentAnalysisResult: null,
    currentVisitDraftId: null,
    nextRerunLowConfidence: false,

    // History Filters
    historySearchQuery: '',
    historySpeciesFilter: 'All',

    // Cached SVG Inner Markup per Species
    svgCache: {}
  };

  // =========================================================================
  // 4. UTILITY HELPERS (Time, Sanitization, WAV Counter, Toasts, Theme)
  // =========================================================================
  function sanitizeForFilename(str) {
    return String(str || 'Unknown')
      .trim()
      .replace(/[^a-zA-Z0-9_-]+/g, '_')
      .replace(/^_+|_+$/g, '') || 'Item';
  }

  function peekNextWavCounter() {
    const current = parseInt(localStorage.getItem(STORAGE_KEYS.WAV_COUNTER) || '3', 10);
    return current + 1;
  }

  function incrementWavCounter() {
    const next = peekNextWavCounter();
    localStorage.setItem(STORAGE_KEYS.WAV_COUNTER, String(next));
    return String(next).padStart(3, '0');
  }

  function formatCounterPad(num) {
    return String(num).padStart(3, '0');
  }

  function buildExpectedWavFilename(counterStr) {
    const species = sanitizeForFilename(AppState.selectedSpecies);
    const target = sanitizeForFilename(AppState.selectedTarget);
    const sideCap = sanitizeForFilename(
      AppState.selectedSide.charAt(0).toUpperCase() + AppState.selectedSide.slice(1)
    );
    const siteId = sanitizeForFilename(AppState.selectedSiteId);
    const patientInput = document.getElementById('input-patient-name');
    const patientName = sanitizeForFilename(patientInput ? patientInput.value : 'Patient');

    if (AppState.collectionMode) {
      const findingSelect = document.getElementById('select-collection-finding');
      const caseInput = document.getElementById('input-collection-case-id');
      const finding = sanitizeForFilename(findingSelect ? findingSelect.value : 'Normal');
      const caseId = sanitizeForFilename(caseInput ? caseInput.value : 'CASE');
      return `${species}_${target}_${sideCap}_${siteId}_${patientName}_${finding}_${caseId}_${counterStr}.wav`;
    }
    return `${species}_${target}_${sideCap}_${siteId}_${patientName}_${counterStr}.wav`;
  }

  function formatTimer(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${tenths}`;
  }

  function formatRelativeTime(timestamp) {
    const diffSec = Math.max(1, Math.floor((Date.now() - timestamp) / 1000));
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDays = Math.floor(diffHr / 24);
    return `${diffDays}d ago`;
  }

  function getPatientInitials(name) {
    const parts = String(name || 'P').trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return String(parts[0] || 'P').slice(0, 2).toUpperCase();
  }

  function showToast(title, message, type = 'teal') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const accentColor =
      type === 'amber'
        ? 'border-amber-500/40 bg-amber-500/15 text-amber-900 dark:text-amber-200'
        : type === 'emerald'
        ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-900 dark:text-emerald-200'
        : 'border-primary-500/40 bg-primary-500/15 text-slate-900 dark:text-slate-100';

    toast.className = `pointer-events-auto glass-card-elevated p-4 border ${accentColor} shadow-xl transition-all duration-200 translate-y-2 opacity-0`;
    toast.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="type-14 font-semibold">${title}</p>
          <p class="type-12 text-slate-600 dark:text-slate-300 mt-0.5">${message}</p>
        </div>
      </div>
    `;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 240);
    }, 3600);
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // =========================================================================
  // 5. THEME MANAGEMENT (System Default + Manual Override in localStorage)
  // =========================================================================
  function applyTheme(pref) {
    AppState.themePref = pref;
    localStorage.setItem(STORAGE_KEYS.THEME, pref);

    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = pref === 'dark' || (pref === 'system' && prefersDark);

    document.documentElement.classList.toggle('dark', isDark);

    // Update Settings segmented control active state
    document.querySelectorAll('#settings-theme-selector [data-theme-pref]').forEach((btn) => {
      btn.classList.toggle('active', btn.getAttribute('data-theme-pref') === pref);
    });
  }

  function toggleThemeQuick() {
    const isCurrentlyDark = document.documentElement.classList.contains('dark');
    applyTheme(isCurrentlyDark ? 'light' : 'dark');
    showToast(
      isCurrentlyDark ? 'Light Clinical Theme' : 'Dark Slate Theme',
      'Display preference saved to workstation.',
      'teal'
    );
  }

  // =========================================================================
  // 6. SPA VIEW ROUTER (Dashboard, New Visit, Results, History)
  // =========================================================================
  const VIEW_METADATA = {
    dashboard: {
      title: 'VetAcoustics',
      subtitle: 'Digital Stethoscope & Landmark Protocol'
    },
    'new-visit': {
      title: 'New Auscultation Visit',
      subtitle: 'Guided Species Landmark Selection & WAV Capture'
    },
    results: {
      title: 'Acoustic Analysis Report',
      subtitle: 'Spectral Attention & Clinical Differential Support'
    },
    history: {
      title: 'Clinical Visit History',
      subtitle: 'Recorded Auscultations & Dataset Export'
    }
  };

  function navigateToView(viewName) {
    if (!VIEW_METADATA[viewName]) return;
    AppState.currentView = viewName;

    // Update Header Title & Subtitle
    const titleEl = document.getElementById('header-title');
    const subEl = document.getElementById('header-subtitle');
    if (titleEl) titleEl.textContent = VIEW_METADATA[viewName].title;
    if (subEl) subEl.textContent = VIEW_METADATA[viewName].subtitle;

    // Update Sidebar & Mobile Bottom Tab Active States
    document.querySelectorAll('[data-nav]').forEach((btn) => {
      const target = btn.getAttribute('data-nav');
      const isActive = target === viewName;
      if (btn.classList.contains('nav-item')) {
        btn.className = isActive
          ? 'nav-item w-full touch-target px-4 py-3 rounded-xl flex items-center gap-3.5 type-16 font-semibold bg-primary-600 text-white shadow-md shadow-primary-600/25 transition-all text-left'
          : 'nav-item w-full touch-target px-4 py-3 rounded-xl flex items-center gap-3.5 type-16 font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-all text-left';
      } else if (btn.classList.contains('mobile-nav-item')) {
        btn.className = isActive
          ? 'mobile-nav-item flex flex-col items-center justify-center gap-1 touch-target text-primary-600 dark:text-primary-400 font-semibold'
          : 'mobile-nav-item flex flex-col items-center justify-center gap-1 touch-target text-slate-500 dark:text-slate-400';
      }
    });

    // Show/Hide SPA views with fade + 8px translateY transition
    const allViews = {
      dashboard: document.getElementById('view-dashboard'),
      'new-visit': document.getElementById('view-new-visit'),
      results: document.getElementById('view-results'),
      history: document.getElementById('view-history')
    };

    Object.entries(allViews).forEach(([key, el]) => {
      if (!el) return;
      if (key === viewName) {
        el.classList.add('view-visible');
        requestAnimationFrame(() => {
          el.classList.add('view-active');
        });
      } else {
        el.classList.remove('view-active');
        el.classList.remove('view-visible');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'dashboard') {
      renderDashboard();
    } else if (viewName === 'history') {
      renderHistoryView();
    } else if (viewName === 'new-visit') {
      updateFilenamePreview();
      drawIdleVisualizer();
    }
  }

  // =========================================================================
  // 7. DASHBOARD VIEW RENDERING
  // =========================================================================
  function updateDashboardGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Good morning, Dr. Vance';
    if (hour >= 12 && hour < 17) {
      greeting = 'Good afternoon, Dr. Vance';
    } else if (hour >= 17 || hour < 4) {
      greeting = 'Good evening, Dr. Vance';
    }
    const greetingEl = document.getElementById('dashboard-greeting');
    if (greetingEl) greetingEl.textContent = greeting;

    const dateLabel = document.getElementById('dashboard-date-label');
    if (dateLabel) {
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      }).format(new Date());
      dateLabel.textContent = `${formattedDate} · iPad Auscultation Workstation`;
    }
  }

  function createStatusBadgeHTML(status, confidence) {
    if (status === 'Normal') {
      return `
        <span class="inline-flex items-center gap-1.5 type-12 font-semibold text-emerald-700 dark:text-emerald-300">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Normal (${confidence}%)</span>
        </span>
      `;
    }
    if (status === 'Inconclusive') {
      return `
        <span class="inline-flex items-center gap-1.5 type-12 font-semibold text-amber-700 dark:text-amber-300">
          <span class="w-2 h-2 rounded-full bg-amber-500"></span>
          <span>Inconclusive (${confidence}%)</span>
        </span>
      `;
    }
    return `
      <span class="inline-flex items-center gap-1.5 type-12 font-semibold text-rose-700 dark:text-rose-300">
        <span class="w-2 h-2 rounded-full bg-rose-500"></span>
        <span>Abnormal (${confidence}%)</span>
      </span>
    `;
  }

  async function renderDashboard() {
    updateDashboardGreeting();
    const visits = await DataService.getVisits();

    // Update Stat Tiles
    const totalEl = document.getElementById('stat-total-recordings');
    const weekEl = document.getElementById('stat-this-week');
    const counterEl = document.getElementById('stat-next-counter');

    const oneWeekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    const thisWeekCount = visits.filter((v) => v.timestamp >= oneWeekAgo).length;

    if (totalEl) totalEl.textContent = String(visits.length);
    if (weekEl) weekEl.textContent = String(thisWeekCount);
    if (counterEl) counterEl.textContent = '#' + formatCounterPad(peekNextWavCounter());

    // Render Recent Visits List (Top 5)
    const listContainer = document.getElementById('dashboard-recent-visits');
    if (!listContainer) return;

    if (visits.length === 0) {
      listContainer.innerHTML = `
        <div class="glass-card p-8 text-center space-y-3">
          <p class="type-16 font-medium text-slate-700 dark:text-slate-300">No auscultation visits recorded yet</p>
          <p class="type-14 text-slate-500 dark:text-slate-400">Tap "Start New Auscultation" above to begin your first guided recording.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = visits
      .slice(0, 5)
      .map((visit, idx) => {
        const res = visit.analysisResult || {
          predictedSound: 'Recorded WAV Signal',
          confidence: 80,
          status: 'Normal'
        };
        const sideLabel = visit.side ? visit.side.charAt(0).toUpperCase() + visit.side.slice(1) : 'Left';
        return `
          <div
            class="glass-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary-600/50 cursor-pointer stagger-item"
            style="animation-delay: ${idx * 45}ms"
            data-open-visit-id="${visit.id}"
            role="button"
            tabindex="0"
          >
            <div class="flex items-start sm:items-center gap-4 min-w-0">
              <div class="w-12 h-12 rounded-2xl bg-primary-600/15 text-primary-700 dark:text-primary-300 font-semibold type-16 flex items-center justify-center shrink-0">
                ${getPatientInitials(visit.patientName)}
              </div>
              <div class="min-w-0 space-y-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="type-16 font-semibold text-slate-900 dark:text-slate-100">${visit.patientName}</span>
                  ${visit.patientBreed ? `<span class="type-12 text-slate-500 dark:text-slate-400">· ${visit.patientBreed}</span>` : ''}
                  ${visit.caseId ? `<span class="type-12 font-mono text-primary-700 dark:text-primary-400">· ${visit.caseId}</span>` : ''}
                </div>
                <p class="type-14 font-medium text-slate-700 dark:text-slate-200 truncate">
                  ${res.predictedSound}
                </p>
                <div class="flex flex-wrap items-center gap-1.5 type-12 text-slate-500 dark:text-slate-400">
                  <span class="font-medium text-slate-700 dark:text-slate-300">${visit.species}</span>
                  <span>·</span>
                  <span>${visit.target}</span>
                  <span>·</span>
                  <span>${sideLabel} Side</span>
                  <span>·</span>
                  <span>${visit.siteLabel || visit.siteId}</span>
                </div>
              </div>
            </div>

            <div class="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-2.5 sm:pt-0 hairline-border">
              ${createStatusBadgeHTML(res.status, res.confidence)}
              <span class="type-12 text-slate-500 dark:text-slate-400 tabular-nums">${formatRelativeTime(visit.timestamp)}</span>
            </div>
          </div>
        `;
      })
      .join('');

    // Attach click handlers to open visit report
    listContainer.querySelectorAll('[data-open-visit-id]').forEach((card) => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-open-visit-id');
        openSavedVisitInResults(id);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openSavedVisitInResults(card.getAttribute('data-open-visit-id'));
        }
      });
    });
  }

  // =========================================================================
  // 8. SECTION B: GUIDED 3-STEP SPECIES & AUSCULTATION SITE SELECTOR
  // =========================================================================
  async function loadSpeciesSvgInner(speciesKey) {
    if (AppState.svgCache[speciesKey]) {
      return AppState.svgCache[speciesKey];
    }
    const config = window.ANATOMY_DATA[speciesKey];
    if (!config) return '';
    try {
      const response = await fetch(config.svgPath);
      const svgText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');
      const inner = svgEl ? svgEl.innerHTML : '';
      AppState.svgCache[speciesKey] = inner;
      return inner;
    } catch (err) {
      console.error('Failed to load SVG:', err);
      return '';
    }
  }

  function getActiveSpeciesConfig() {
    return window.ANATOMY_DATA[AppState.selectedSpecies] || window.ANATOMY_DATA.Dog;
  }

  function getActiveTargetConfig() {
    const speciesCfg = getActiveSpeciesConfig();
    return (
      speciesCfg.targets.find((t) => t.id === AppState.selectedTarget) || speciesCfg.targets[0]
    );
  }

  function getFilteredSitesForActiveTargetAndSide() {
    const targetCfg = getActiveTargetConfig();
    if (!targetCfg) return [];
    if (targetCfg.id === 'Trachea') {
      return targetCfg.sites;
    }
    const matchingSide = targetCfg.sites.filter((s) => s.side === AppState.selectedSide);
    return matchingSide.length > 0 ? matchingSide : targetCfg.sites;
  }

  function getActiveSiteConfig() {
    const targetCfg = getActiveTargetConfig();
    if (!targetCfg) return null;
    return (
      targetCfg.sites.find((s) => s.id === AppState.selectedSiteId) ||
      getFilteredSitesForActiveTargetAndSide()[0] ||
      targetCfg.sites[0]
    );
  }

  // STEP 1: Render Full-Screen Grid of Illustrated Species Cards
  function renderSpeciesStepCards() {
    const grid = document.getElementById('species-cards-grid');
    if (!grid) return;

    const speciesList = Object.values(window.ANATOMY_DATA);
    grid.innerHTML = speciesList
      .map((sp) => {
        const isSelected = sp.id === AppState.selectedSpecies;
        const targetNames = sp.targets.map((t) => t.label).join(' · ');
        return `
          <button
            type="button"
            data-select-species="${sp.id}"
            class="species-card glass-card-elevated p-6 text-left flex flex-col justify-between gap-4 hover:border-primary-600 transition-all duration-300 cursor-pointer group ${
              isSelected ? 'ring-2 ring-primary-600' : ''
            }"
          >
            <div class="flex items-start justify-between gap-3 w-full">
              <div>
                <span class="type-24 font-semibold text-slate-900 dark:text-slate-100 block">${sp.name}</span>
                <span class="type-12 text-slate-500 dark:text-slate-400 block">${sp.clinicalLabel}</span>
              </div>
              <span class="px-3 py-1 rounded-full bg-primary-500/15 text-primary-700 dark:text-primary-300 type-12 font-semibold tabular-nums">
                ${sp.ribCount} Ribs
              </span>
            </div>

            <div class="w-full h-44 rounded-2xl bg-slate-100/80 dark:bg-slate-900/70 border hairline-border flex items-center justify-center p-3 overflow-hidden">
              <img
                src="${sp.svgPath}"
                alt="${sp.name} lateral anatomical silhouette"
                class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div class="w-full flex items-center justify-between pt-1 border-t hairline-border">
              <span class="type-12 font-medium text-slate-600 dark:text-slate-300">${targetNames}</span>
              <span class="type-14 font-semibold text-primary-700 dark:text-primary-400 inline-flex items-center gap-1">
                <span>Select</span>
                <i data-lucide="arrow-right" class="w-4 h-4"></i>
              </span>
            </div>
          </button>
        `;
      })
      .join('');

    refreshIcons();

    grid.querySelectorAll('[data-select-species]').forEach((card) => {
      card.addEventListener('click', () => {
        const spId = card.getAttribute('data-select-species');
        // Animate selected card slightly before transitioning to Step 2
        card.classList.add('scale-[1.02]', 'ring-2', 'ring-primary-500');
        setTimeout(() => {
          selectSpecies(spId, true);
        }, 180);
      });
    });
  }

  function setGuidedStep(stepNum) {
    AppState.guidedStep = stepNum;
    const step1El = document.getElementById('guided-step-1');
    const step2El = document.getElementById('guided-step-2');

    if (stepNum === 1) {
      if (step1El) step1El.classList.remove('hidden');
      if (step2El) step2El.classList.add('hidden');
    } else {
      if (step1El) step1El.classList.add('hidden');
      if (step2El) step2El.classList.remove('hidden');
      renderInteractiveAnatomyStage();
    }

    // Update stepper buttons
    [1, 2, 3].forEach((n) => {
      const btn = document.getElementById(`step-tab-${n}`);
      if (!btn) return;
      btn.classList.toggle('active', n === stepNum || (stepNum === 2 && n === 2));
    });

    if (stepNum === 3) {
      const recStudio = document.getElementById('recording-studio-card');
      if (recStudio) {
        recStudio.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function selectSpecies(speciesId, advanceToStep2 = false) {
    if (!window.ANATOMY_DATA[speciesId]) return;
    AppState.selectedSpecies = speciesId;
    const spCfg = getActiveSpeciesConfig();

    // Ensure valid target
    if (!spCfg.targets.some((t) => t.id === AppState.selectedTarget)) {
      AppState.selectedTarget = spCfg.targets[0].id;
    }

    const targetCfg = getActiveTargetConfig();
    AppState.selectedSide = targetCfg.defaultSide || 'left';

    const sites = getFilteredSitesForActiveTargetAndSide();
    if (sites.length > 0) {
      AppState.selectedSiteId = sites[0].id;
    }

    AppState.completedSiteIds.clear();
    AppState.protocolRecordings = [];

    syncManualSelectionDropdowns();
    renderSpeciesStepCards();
    if (advanceToStep2) {
      setGuidedStep(2);
    } else {
      renderInteractiveAnatomyStage();
    }
    updateRecordingContextBanner();
  }

  function selectTarget(targetId) {
    const spCfg = getActiveSpeciesConfig();
    const targetCfg = spCfg.targets.find((t) => t.id === targetId);
    if (!targetCfg) return;

    AppState.selectedTarget = targetId;
    if (targetId === 'Trachea') {
      AppState.selectedSide = 'ventral';
    } else if (AppState.selectedSide === 'ventral') {
      AppState.selectedSide = targetCfg.defaultSide || 'left';
    }

    const sites = getFilteredSitesForActiveTargetAndSide();
    if (sites.length > 0) {
      AppState.selectedSiteId = sites[0].id;
    }

    syncManualSelectionDropdowns();
    renderInteractiveAnatomyStage();
    updateRecordingContextBanner();
  }

  function selectSide(side) {
    AppState.selectedSide = side;
    const sites = getFilteredSitesForActiveTargetAndSide();
    if (sites.length > 0 && !sites.some((s) => s.id === AppState.selectedSiteId)) {
      AppState.selectedSiteId = sites[0].id;
    }
    syncManualSelectionDropdowns();
    renderInteractiveAnatomyStage();
    updateRecordingContextBanner();
  }

  function selectSite(siteId) {
    const targetCfg = getActiveTargetConfig();
    const found = targetCfg.sites.find((s) => s.id === siteId);
    if (!found) return;

    AppState.selectedSiteId = found.id;
    if (found.side && found.side !== AppState.selectedSide) {
      AppState.selectedSide = found.side;
    }

    syncManualSelectionDropdowns();
    renderInteractiveAnatomyStage();
    updateRecordingContextBanner();
  }

  // Render Step 2 & Step 3: Interactive SVG Silhouette, Computed Rib Overlay, Target Glow, Stethoscope Markers & Instructions
  async function renderInteractiveAnatomyStage() {
    const spCfg = getActiveSpeciesConfig();
    const targetCfg = getActiveTargetConfig();
    const activeSite = getActiveSiteConfig();
    const filteredSites = getFilteredSitesForActiveTargetAndSide();

    // Update top stage labels
    const titleEl = document.getElementById('stage-species-title');
    const ribCountEl = document.getElementById('stage-species-ribcount');
    if (titleEl) titleEl.textContent = `${spCfg.name} — ${targetCfg.label}`;
    if (ribCountEl) {
      const sideLabel =
        AppState.selectedSide.charAt(0).toUpperCase() + AppState.selectedSide.slice(1);
      ribCountEl.textContent = `${spCfg.ribCount} Ribs · ${sideLabel} View`;
    }

    // Update Side Segmented Buttons
    ['left', 'right', 'ventral'].forEach((s) => {
      const btn = document.getElementById(`btn-side-${s}`);
      if (!btn) return;
      btn.classList.toggle('active', AppState.selectedSide === s);
    });

    // Update Orientation Badge
    const orientBadge = document.getElementById('svg-orientation-badge');
    const transformGroup = document.getElementById('svg-animal-transform-group');
    const isRightView = AppState.selectedSide === 'right';
    if (orientBadge) {
      orientBadge.textContent = isRightView
        ? 'Caudal (Tail) ← · → Cranial (Head) · Right Hemithorax'
        : AppState.selectedSide === 'ventral'
        ? 'Cranial (Head) ← · → Caudal (Tail) · Ventral Neck Midline'
        : 'Cranial (Head) ← · → Caudal (Tail) · Left Hemithorax';
    }
    if (transformGroup) {
      transformGroup.setAttribute(
        'transform',
        isRightView ? 'translate(800, 0) scale(-1, 1)' : 'translate(0, 0) scale(1, 1)'
      );
    }

    // 1. Load & Inject Base Animal Silhouette SVG
    const baseLayer = document.getElementById('svg-base-silhouette');
    if (baseLayer) {
      const svgInner = await loadSpeciesSvgInner(spCfg.id);
      baseLayer.innerHTML = svgInner;
    }

    // 2. Render Computed Curved Ribs & Numbered Intercostal Spaces from ribLayout
    const ribLayer = document.getElementById('svg-rib-overlay-layer');
    if (ribLayer) {
      if (AppState.showRibOverlay) {
        const { ribs, spaces } = window.AnatomyGeometry.generateRibOverlayData(spCfg);
        const ribPathsHtml = ribs
          .map(
            (r) => `
            <path
              d="${r.path}"
              stroke="#4F5BF5"
              stroke-width="2"
              stroke-opacity="0.42"
              fill="none"
              stroke-linecap="round"
            />
          `
          )
          .join('');

        // Keep intercostal numbers upright even when right side flips the animal horizontally
        const spaceLabelsHtml = spaces
          .map((sp) => {
            const textTransform = isRightView
              ? `transform="translate(${sp.x * 2}, 0) scale(-1, 1)"`
              : '';
            return `
              <g ${textTransform}>
                <circle cx="${sp.x}" cy="${sp.y}" r="8" fill="#0F1430" fill-opacity="0.72" />
                <text
                  x="${sp.x}"
                  y="${sp.y + 3}"
                  text-anchor="middle"
                  fill="#8FF3E3"
                  font-size="9"
                  font-weight="600"
                  font-family="Inter, sans-serif"
                >${sp.spaceNumber}</text>
              </g>
            `;
          })
          .join('');

        ribLayer.innerHTML = ribPathsHtml + spaceLabelsHtml;
      } else {
        ribLayer.innerHTML = '';
      }
    }

    // 3. Render Soft Pulsing Teal Region Highlight for the Active Target
    const regionLayer = document.getElementById('svg-target-region-layer');
    if (regionLayer) {
      const bounds = window.AnatomyGeometry.computeTargetRegionBounds(spCfg, filteredSites);
      if (bounds) {
        regionLayer.innerHTML = `
          <rect
            x="${bounds.x}"
            y="${bounds.y}"
            width="${bounds.width}"
            height="${bounds.height}"
            rx="${bounds.rx}"
            fill="#2DE2C8"
            stroke="#4F5BF5"
            stroke-width="2"
            stroke-dasharray="5 4"
            class="anatomy-region-glow"
          />
        `;
      } else {
        regionLayer.innerHTML = '';
      }
    }

    // 4. Render Interactive Stethoscope Markers for Each Site
    const markersLayer = document.getElementById('svg-markers-layer');
    if (markersLayer) {
      markersLayer.innerHTML = filteredSites
        .map((site, idx) => {
          const pt = window.AnatomyGeometry.siteToSvgPoint(spCfg, site.position);
          const isSelected = activeSite && activeSite.id === site.id;
          const isCompleted = AppState.completedSiteIds.has(site.id);
          const unflipTransform = isRightView
            ? `transform="translate(${pt.x * 2}, 0) scale(-1, 1)"`
            : '';

          const fillHex = isCompleted
            ? '#059669'
            : isSelected
            ? '#4F5BF5'
            : '#1B2152';
          const strokeHex = isSelected ? '#C3CAFF' : '#F8FAFC';

          return `
            <g
              class="cursor-pointer"
              data-svg-site-id="${site.id}"
              ${unflipTransform}
            >
              ${
                isSelected
                  ? `<circle cx="${pt.x}" cy="${pt.y}" r="16" fill="none" stroke="#2DE2C8" stroke-width="2.5" class="marker-pulse-ring" />`
                  : ''
              }
              <circle
                cx="${pt.x}"
                cy="${pt.y}"
                r="${isSelected ? 14 : 11}"
                fill="${fillHex}"
                stroke="${strokeHex}"
                stroke-width="2.5"
              />
              ${
                isCompleted
                  ? `<path d="M ${pt.x - 4.5} ${pt.y} L ${pt.x - 1} ${pt.y + 3.5} L ${pt.x + 5} ${pt.y - 3.5}" stroke="#FFFFFF" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round" />`
                  : `<text x="${pt.x}" y="${pt.y + 3.5}" text-anchor="middle" fill="#FFFFFF" font-size="10" font-weight="600" font-family="Inter, sans-serif">${idx + 1}</text>`
              }
            </g>
          `;
        })
        .join('');

      markersLayer.querySelectorAll('[data-svg-site-id]').forEach((markerEl) => {
        markerEl.addEventListener('click', (e) => {
          e.stopPropagation();
          const sId = markerEl.getAttribute('data-svg-site-id');
          selectSite(sId);
        });
      });
    }

    // 5. Trachea Neck Close-Up Inset (Visible when Trachea target is selected)
    const neckInset = document.getElementById('trachea-neck-inset');
    const neckInsetSvg = document.getElementById('trachea-inset-svg');
    if (neckInset && neckInsetSvg) {
      if (targetCfg.id === 'Trachea') {
        neckInset.classList.remove('hidden');
        const svgInner = await loadSpeciesSvgInner(spCfg.id);
        const markersHtml = filteredSites
          .map((site, i) => {
            const pt = window.AnatomyGeometry.siteToSvgPoint(spCfg, site.position);
            const active = activeSite && activeSite.id === site.id;
            return `
              <circle cx="${pt.x}" cy="${pt.y}" r="${active ? 8 : 6}" fill="${active ? '#2DE2C8' : '#0F1430'}" stroke="#FFFFFF" stroke-width="1.5" />
              <text x="${pt.x + 11}" y="${pt.y + 3}" fill="#8FF3E3" font-size="8" font-weight="600">${i + 1}. ${site.label}</text>
            `;
          })
          .join('');
        neckInsetSvg.innerHTML = svgInner + markersHtml;
      } else {
        neckInset.classList.add('hidden');
      }
    }

    // 6. Render Target Option Chips
    const targetChipsContainer = document.getElementById('target-chips-container');
    const targetSummaryHint = document.getElementById('target-summary-hint');
    if (targetSummaryHint) {
      targetSummaryHint.textContent = `${spCfg.targets.length} anatomical targets`;
    }
    if (targetChipsContainer) {
      targetChipsContainer.innerHTML = spCfg.targets
        .map((t) => {
          const active = t.id === AppState.selectedTarget;
          return `
            <button
              type="button"
              data-chip-target="${t.id}"
              class="chip-btn ${active ? 'active' : ''}"
            >
              <span>${t.label}</span>
            </button>
          `;
        })
        .join('');

      targetChipsContainer.querySelectorAll('[data-chip-target]').forEach((btn) => {
        btn.addEventListener('click', () => {
          selectTarget(btn.getAttribute('data-chip-target'));
        });
      });
    }

    // 7. Render Site Selector Chips
    const siteChipsContainer = document.getElementById('site-chips-container');
    const siteCountLabel = document.getElementById('site-count-label');
    if (siteCountLabel) {
      siteCountLabel.textContent = `${filteredSites.length} placement sites`;
    }
    if (siteChipsContainer) {
      siteChipsContainer.innerHTML = filteredSites
        .map((s, idx) => {
          const active = activeSite && activeSite.id === s.id;
          const done = AppState.completedSiteIds.has(s.id);
          return `
            <button
              type="button"
              data-chip-site="${s.id}"
              class="chip-btn type-12 px-3.5 min-h-[42px] ${active ? 'active' : ''}"
            >
              <span class="w-5 h-5 rounded-full ${
                done
                  ? 'bg-emerald-500 text-white'
                  : active
                  ? 'bg-white/25 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
              } flex items-center justify-center type-12 tabular-nums">
                ${done ? '✓' : idx + 1}
              </span>
              <span>${s.label}</span>
            </button>
          `;
        })
        .join('');

      siteChipsContainer.querySelectorAll('[data-chip-site]').forEach((btn) => {
        btn.addEventListener('click', () => {
          selectSite(btn.getAttribute('data-chip-site'));
        });
      });
    }

    // 8. Update Step 3 Placement Instructions Card
    if (activeSite) {
      const siteTitleEl = document.getElementById('instruction-site-title');
      const siteMetaEl = document.getElementById('instruction-site-meta');
      const textBodyEl = document.getElementById('instruction-text-body');
      const tipsListEl = document.getElementById('instruction-tips-list');

      const sideDisplay =
        AppState.selectedSide.charAt(0).toUpperCase() + AppState.selectedSide.slice(1);
      const ribRangeText = activeSite.position.isNeck
        ? 'Ventral Cervical Midline'
        : `Rib ${activeSite.position.fromRib}–${activeSite.position.toRib}`;

      if (siteTitleEl) siteTitleEl.textContent = activeSite.label;
      if (siteMetaEl) {
        siteMetaEl.textContent = `${spCfg.name} · ${targetCfg.label} · ${sideDisplay} Side · ${ribRangeText}`;
      }
      if (textBodyEl) textBodyEl.textContent = activeSite.instruction;

      if (tipsListEl) {
        const tips = activeSite.tips || [
          'Part the hair coat to minimize friction artifact',
          'Maintain firm, steady diaphragm contact',
          'Keep the patient standing or sternal and still'
        ];
        tipsListEl.innerHTML = tips
          .map(
            (tip) => `
            <li class="flex items-start gap-2.5">
              <span class="w-5 h-5 rounded-full bg-primary-500/15 text-primary-700 dark:text-primary-300 flex items-center justify-center shrink-0 mt-0.5 type-12 font-bold">✓</span>
              <span>${tip}</span>
            </li>
          `
          )
          .join('');
      }
    }

    updateProtocolProgressUI();
    updateFilenamePreview();
  }

  // =========================================================================
  // 9. GUIDED PROTOCOL MODE & MANUAL DROPDOWN FALLBACK SYNC
  // =========================================================================
  function getAllSitesForProtocol() {
    const targetCfg = getActiveTargetConfig();
    return targetCfg ? targetCfg.sites : [];
  }

  function updateProtocolProgressUI() {
    const card = document.getElementById('protocol-progress-card');
    const summaryCaption = document.getElementById('protocol-summary-caption');
    const ringCircle = document.getElementById('protocol-ring-circle');
    const ringText = document.getElementById('protocol-ring-text');
    const stepSub = document.getElementById('protocol-step-subtitle');
    const advanceBtn = document.getElementById('btn-protocol-advance-after-rec');

    const allSites = getAllSitesForProtocol();
    const total = allSites.length;
    const completed = allSites.filter((s) => AppState.completedSiteIds.has(s.id)).length;

    if (summaryCaption) {
      summaryCaption.textContent = AppState.fullProtocolMode
        ? `${completed}/${total} sites completed`
        : 'Single site mode';
    }

    if (card) {
      card.classList.toggle('hidden', !AppState.fullProtocolMode);
    }
    if (advanceBtn) {
      advanceBtn.classList.toggle('hidden', !AppState.fullProtocolMode);
    }

    if (ringText) {
      ringText.textContent = `${completed}/${total}`;
    }
    if (ringCircle) {
      const circumference = 144.5;
      const ratio = total > 0 ? completed / total : 0;
      ringCircle.style.strokeDashoffset = String(circumference * (1 - ratio));
    }

    if (stepSub) {
      const currentIdx = allSites.findIndex((s) => s.id === AppState.selectedSiteId);
      stepSub.textContent =
        currentIdx >= 0
          ? `Site ${currentIdx + 1} of ${total}: ${allSites[currentIdx].label}`
          : `Walk through all ${total} sites`;
    }
  }

  function stepProtocolSite(delta) {
    const allSites = getAllSitesForProtocol();
    if (allSites.length === 0) return;
    const currIdx = allSites.findIndex((s) => s.id === AppState.selectedSiteId);
    const nextIdx = (currIdx + delta + allSites.length) % allSites.length;
    const nextSite = allSites[nextIdx];
    selectSite(nextSite.id);
    showToast(
      `Protocol Site ${nextIdx + 1}/${allSites.length}`,
      `${nextSite.label} (${nextSite.side.toUpperCase()}) selected.`,
      'teal'
    );
  }

  function syncManualSelectionDropdowns() {
    const spSelect = document.getElementById('manual-species');
    const targetSelect = document.getElementById('manual-target');
    const sideSelect = document.getElementById('manual-side');
    const siteSelect = document.getElementById('manual-site');

    const spCfg = getActiveSpeciesConfig();
    if (spSelect) spSelect.value = spCfg.id;

    if (targetSelect) {
      targetSelect.innerHTML = spCfg.targets
        .map((t) => `<option value="${t.id}">${t.label}</option>`)
        .join('');
      targetSelect.value = AppState.selectedTarget;
    }

    if (sideSelect) {
      sideSelect.value = AppState.selectedSide;
    }

    if (siteSelect) {
      const sites = getFilteredSitesForActiveTargetAndSide();
      siteSelect.innerHTML = sites
        .map((s) => `<option value="${s.id}">${s.label}</option>`)
        .join('');
      siteSelect.value = AppState.selectedSiteId;
    }
  }

  function updateRecordingContextBanner() {
    const spCfg = getActiveSpeciesConfig();
    const targetCfg = getActiveTargetConfig();
    const activeSite = getActiveSiteConfig();
    if (!activeSite) return;

    const sideCap =
      AppState.selectedSide.charAt(0).toUpperCase() + AppState.selectedSide.slice(1);
    const headingEl = document.getElementById('recording-context-heading');
    const landmarkEl = document.getElementById('recording-context-landmark');

    if (headingEl) {
      headingEl.textContent = `${spCfg.name} · ${targetCfg.label} · ${sideCap} Side — ${activeSite.label}`;
    }
    if (landmarkEl) {
      landmarkEl.textContent = activeSite.instruction;
    }
    updateFilenamePreview();
  }

  function updateFilenamePreview() {
    const nextPad = formatCounterPad(peekNextWavCounter());
    const expected = buildExpectedWavFilename(nextPad);
    const previewEl = document.getElementById('preview-wav-filename');
    if (previewEl) previewEl.textContent = expected;
  }

  // =========================================================================
  // 10. WEB AUDIO API RECORDING, SAFARI MIME DETECTION & 16-BIT PCM WAV EXPORT
  // =========================================================================
  function detectSupportedMimeType() {
    if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
      return '';
    }
    // Safari iPadOS priority: audio/mp4 first, never hardcode webm
    const candidates = [
      'audio/mp4',
      'audio/aac',
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus'
    ];
    for (const mime of candidates) {
      if (MediaRecorder.isTypeSupported(mime)) {
        return mime;
      }
    }
    return '';
  }

  /**
   * Encodes an AudioBuffer (or Float32 mono sample array) into a real 16-bit PCM Mono WAV Blob
   */
  function encodeMono16BitWavFromSamples(float32Samples, sampleRate) {
    const numSamples = float32Samples.length;
    const bytesPerSample = 2; // 16-bit PCM
    const numChannels = 1; // Mono
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = numSamples * bytesPerSample;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    function writeAscii(offset, text) {
      for (let i = 0; i < text.length; i++) {
        view.setUint8(offset + i, text.charCodeAt(i));
      }
    }

    // RIFF identifier
    writeAscii(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeAscii(8, 'WAVE');

    // fmt subchunk
    writeAscii(12, 'fmt ');
    view.setUint32(16, 16, true); // PCM chunk size
    view.setUint16(20, 1, true); // AudioFormat 1 = Linear PCM
    view.setUint16(22, numChannels, true); // 1 channel = Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, 16, true); // 16 bits per sample

    // data subchunk
    writeAscii(36, 'data');
    view.setUint32(40, dataSize, true);

    // Write 16-bit signed integer samples
    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      const clamped = Math.max(-1, Math.min(1, float32Samples[i]));
      const int16 = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
      view.setInt16(offset, int16, true);
      offset += 2;
    }

    return new Blob([buffer], { type: 'audio/wav' });
  }

  function downmixAudioBufferToMono(audioBuffer) {
    const length = audioBuffer.length;
    const channels = audioBuffer.numberOfChannels;
    if (channels === 1) {
      return new Float32Array(audioBuffer.getChannelData(0));
    }
    const mono = new Float32Array(length);
    for (let ch = 0; ch < channels; ch++) {
      const chData = audioBuffer.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        mono[i] += chData[i] / channels;
      }
    }
    return mono;
  }

  /**
   * Creates a realistic synthesized clinical auscultation stream (heart beats + vesicular breath cycle)
   * when testing without physical microphone hardware or when Simulated Signal Mode is toggled ON.
   */
  function createSynthesizedAuscultationStream(audioCtx) {
    const dest = audioCtx.createMediaStreamDestination();
    const masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.45;

    // 1. Filtered pink/white noise for vesicular/bronchial breath airflow
    const bufferSize = audioCtx.sampleRate * 4;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / audioCtx.sampleRate;
      // Respiratory envelope (0.35 Hz breathing cycle) + rhythmic S1/S2 cardiac thumps (1.5 Hz)
      const breathEnv = 0.25 + 0.55 * Math.pow(Math.max(0, Math.sin(2 * Math.PI * 0.35 * t)), 1.6);
      const heartPhase = (t * 1.45) % 1;
      const s1 = Math.exp(-Math.pow((heartPhase - 0.12) / 0.028, 2)) * Math.sin(2 * Math.PI * 95 * t);
      const s2 = 0.7 * Math.exp(-Math.pow((heartPhase - 0.36) / 0.022, 2)) * Math.sin(2 * Math.PI * 135 * t);
      const wheezeComponent = 0.22 * breathEnv * Math.sin(2 * Math.PI * 440 * t + 1.5 * Math.sin(2 * Math.PI * 4 * t));
      const airflowNoise = (Math.random() * 2 - 1) * 0.28 * breathEnv;
      output[i] = Math.max(-0.95, Math.min(0.95, s1 * 0.65 + s2 * 0.5 + wheezeComponent + airflowNoise));
    }

    const source = audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const bandpass = audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = 380;
    bandpass.Q.value = 0.9;

    source.connect(bandpass);
    bandpass.connect(masterGain);
    masterGain.connect(dest);
    source.start();

    return {
      stream: dest.stream,
      sourceNode: bandpass,
      stop() {
        try {
          source.stop();
          source.disconnect();
          masterGain.disconnect();
        } catch (e) {
          // ignore
        }
      }
    };
  }

  async function startAuscultationRecording() {
    if (AppState.isRecording) return;

    // Create and resume AudioContext directly inside user's tap handler (iOS Safari requirement)
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AppState.audioContext) {
      AppState.audioContext = new AudioCtx();
    }
    if (AppState.audioContext.state === 'suspended') {
      await AppState.audioContext.resume();
    }

    const audioCtx = AppState.audioContext;
    AppState.pcmSampleRate = audioCtx.sampleRate || 44100;
    AppState.pcmFallbackSamples = [];
    AppState.recordedChunks = [];

    let stream = null;
    let sourceNode = null;
    let usingSimFallback = AppState.simAudioMode;

    if (!usingSimFallback && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false
          }
        });
        sourceNode = audioCtx.createMediaStreamSource(stream);
      } catch (err) {
        usingSimFallback = true;
        showToast(
          'Simulated Stethoscope Active',
          'Microphone permission unavailable — synthesizing clinical cardiopulmonary signal.',
          'amber'
        );
      }
    } else {
      usingSimFallback = true;
    }

    if (usingSimFallback) {
      const sim = createSynthesizedAuscultationStream(audioCtx);
      AppState.simNodes = sim;
      stream = sim.stream;
      sourceNode = sim.sourceNode;
    }

    AppState.mediaStream = stream;

    // Configure AnalyserNode for live mirrored bars & live signal quality checks
    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.78;
    sourceNode.connect(analyser);
    AppState.analyserNode = analyser;

    // Capture raw PCM chunks in parallel so 16-bit WAV export & FFT spectrogram always have crystal-clear samples
    const scriptNode = audioCtx.createScriptProcessor(4096, 1, 1);
    const silentGain = audioCtx.createGain();
    silentGain.gain.value = 0;
    sourceNode.connect(scriptNode);
    scriptNode.connect(silentGain);
    silentGain.connect(audioCtx.destination);
    scriptNode.onaudioprocess = (event) => {
      if (!AppState.isRecording) return;
      const input = event.inputBuffer.getChannelData(0);
      AppState.pcmFallbackSamples.push(new Float32Array(input));
    };
    AppState.scriptProcessorNode = scriptNode;

    // Start MediaRecorder with detected Safari-safe mimeType
    const detectedMime = detectSupportedMimeType();
    const mimeBadge = document.getElementById('recording-mime-badge');
    if (mimeBadge) {
      mimeBadge.textContent = `· ${detectedMime || 'audio/wav'} → 16-bit PCM WAV`;
    }

    if (typeof MediaRecorder !== 'undefined' && stream) {
      try {
        const options = detectedMime ? { mimeType: detectedMime } : {};
        const recorder = new MediaRecorder(stream, options);
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            AppState.recordedChunks.push(e.data);
          }
        };
        recorder.start(250);
        AppState.mediaRecorder = recorder;
      } catch (recErr) {
        console.warn('MediaRecorder fallback to PCM capture:', recErr);
      }
    }

    // Update UI Recording State
    AppState.isRecording = true;
    AppState.recordingStartTime = performance.now();
    AppState.recordingDurationSec = 0;

    updateRecordingButtonsUI(true, usingSimFallback);

    // Start Timer & 10-Second Progress Ring Updater
    AppState.recordingTimerInterval = setInterval(() => {
      const elapsedSec = (performance.now() - AppState.recordingStartTime) / 1000;
      AppState.recordingDurationSec = elapsedSec;
      const timerEl = document.getElementById('recording-timer');
      if (timerEl) timerEl.textContent = formatTimer(elapsedSec);
      updateMinimumDurationRing(elapsedSec);
    }, 100);

    // Start Live Mirrored Audio Visualizer & Signal Quality Loop
    startLiveVisualizerLoop();
  }

  async function stopAuscultationRecording() {
    if (!AppState.isRecording) return;
    AppState.isRecording = false;

    if (AppState.recordingTimerInterval) {
      clearInterval(AppState.recordingTimerInterval);
      AppState.recordingTimerInterval = null;
    }
    if (AppState.visualizerAnimId) {
      cancelAnimationFrame(AppState.visualizerAnimId);
      AppState.visualizerAnimId = null;
    }

    // Stop MediaRecorder and collect Blob
    let recordedBlob = null;
    if (AppState.mediaRecorder && AppState.mediaRecorder.state !== 'inactive') {
      await new Promise((resolve) => {
        AppState.mediaRecorder.onstop = resolve;
        try {
          AppState.mediaRecorder.stop();
        } catch (e) {
          resolve();
        }
      });
      const mimeType = AppState.mediaRecorder.mimeType || detectSupportedMimeType() || 'audio/mp4';
      if (AppState.recordedChunks.length > 0) {
        recordedBlob = new Blob(AppState.recordedChunks, { type: mimeType });
      }
    }

    // Clean up streams & script nodes
    if (AppState.scriptProcessorNode) {
      try {
        AppState.scriptProcessorNode.disconnect();
      } catch (e) {
        // ignore
      }
      AppState.scriptProcessorNode = null;
    }
    if (AppState.simNodes) {
      AppState.simNodes.stop();
      AppState.simNodes = null;
    }
    if (AppState.mediaStream) {
      AppState.mediaStream.getTracks().forEach((track) => track.stop());
      AppState.mediaStream = null;
    }

    updateRecordingButtonsUI(false, false);

    // Decode recorded audio with AudioContext.decodeAudioData (Section A Item 6)
    const audioCtx = AppState.audioContext;
    let decodedAudioBuffer = null;

    if (recordedBlob && recordedBlob.size > 0 && audioCtx) {
      try {
        const arrayBuf = await recordedBlob.arrayBuffer();
        decodedAudioBuffer = await audioCtx.decodeAudioData(arrayBuf.slice(0));
      } catch (decodeErr) {
        console.warn('decodeAudioData fallback to captured PCM buffer:', decodeErr);
      }
    }

    // Fallback or reconstruct AudioBuffer from captured raw PCM chunks if needed
    if (!decodedAudioBuffer && AppState.pcmFallbackSamples.length > 0 && audioCtx) {
      const totalLen = AppState.pcmFallbackSamples.reduce((acc, arr) => acc + arr.length, 0);
      const merged = new Float32Array(totalLen);
      let offset = 0;
      for (const chunk of AppState.pcmFallbackSamples) {
        merged.set(chunk, offset);
        offset += chunk.length;
      }
      decodedAudioBuffer = audioCtx.createBuffer(1, merged.length, AppState.pcmSampleRate);
      decodedAudioBuffer.getChannelData(0).set(merged);
    }

    // Ensure at least 2 seconds of synthesized buffer if user tapped start/stop instantaneously
    if (!decodedAudioBuffer && audioCtx) {
      const sr = 44100;
      const len = sr * 3;
      decodedAudioBuffer = audioCtx.createBuffer(1, len, sr);
      const ch = decodedAudioBuffer.getChannelData(0);
      for (let i = 0; i < len; i++) {
        const t = i / sr;
        ch[i] = 0.35 * Math.sin(2 * Math.PI * 220 * t) * Math.exp(-((t % 0.7) * 5));
      }
    }

    AppState.lastAudioBuffer = decodedAudioBuffer;

    // Encode real 16-bit PCM mono WAV file
    const monoSamples = downmixAudioBufferToMono(decodedAudioBuffer);
    const wavBlob = encodeMono16BitWavFromSamples(monoSamples, decodedAudioBuffer.sampleRate);
    AppState.lastWavBlob = wavBlob;

    if (AppState.lastWavUrl) {
      URL.revokeObjectURL(AppState.lastWavUrl);
    }
    AppState.lastWavUrl = URL.createObjectURL(wavBlob);

    // Build sanitized filename with auto-incremented localStorage counter
    const counterStr = incrementWavCounter();
    const filename = buildExpectedWavFilename(counterStr);
    AppState.lastWavFilename = filename;

    // Trigger automatic download of the .wav file
    triggerWavDownload(AppState.lastWavUrl, filename);

    // Prepare in-app Audio Player
    AppState.audioElement.pause();
    AppState.audioElement.src = AppState.lastWavUrl;
    AppState.audioElement.currentTime = 0;

    // Show Post-Recording Panel & Compute Real FFT Spectrogram
    const postPanel = document.getElementById('post-recording-panel');
    const exportedNameEl = document.getElementById('exported-wav-filename');
    const totalTimeEl = document.getElementById('player-total-time');

    if (postPanel) postPanel.classList.remove('hidden');
    if (exportedNameEl) exportedNameEl.textContent = filename;
    if (totalTimeEl) totalTimeEl.textContent = formatTimer(decodedAudioBuffer.duration);

    // Render Real FFT Spectrogram onto the recording canvas
    renderRealSpectrogramOnCanvas('recording-spectrogram-canvas', decodedAudioBuffer);
    updateFilenamePreview();

    // Mark site completed if Full Protocol Mode is active
    if (AppState.fullProtocolMode) {
      AppState.completedSiteIds.add(AppState.selectedSiteId);
      AppState.protocolRecordings.push({
        siteId: AppState.selectedSiteId,
        side: AppState.selectedSide,
        target: AppState.selectedTarget,
        wavFilename: filename,
        durationSec: Math.round(decodedAudioBuffer.duration * 10) / 10
      });
      renderInteractiveAnatomyStage();
    }

    showToast(
      '16-Bit PCM Mono WAV Exported',
      `Saved as ${filename} (${decodedAudioBuffer.duration.toFixed(1)}s).`,
      'emerald'
    );
  }

  function triggerWavDownload(url, filename) {
    if (!url || !filename) return;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  }

  function updateRecordingButtonsUI(isRecording, isSimulated) {
    const recBtn = document.getElementById('btn-record-toggle');
    const recCaption = document.getElementById('record-btn-caption');
    const recStateLabel = document.getElementById('rec-state-label');
    const recLiveDot = document.getElementById('rec-live-indicator');
    const micPillDot = document.getElementById('mic-status-dot');
    const micPillText = document.getElementById('mic-status-text');

    if (recBtn) {
      recBtn.classList.toggle('recording-pulse-active', isRecording);
      recBtn.innerHTML = isRecording
        ? '<i data-lucide="square" class="w-7 h-7 fill-current"></i>'
        : '<i data-lucide="mic" class="w-8 h-8"></i>';
    }
    if (recCaption) {
      recCaption.textContent = isRecording
        ? 'Recording live signal — Tap square to stop & export WAV'
        : 'Tap to start auscultation capture';
    }
    if (recStateLabel) {
      recStateLabel.textContent = isRecording
        ? isSimulated
          ? 'Capturing Simulated Clinical Stream'
          : 'Capturing Live Stethoscope Audio'
        : 'Ready to Capture';
    }
    if (recLiveDot) {
      recLiveDot.className = isRecording
        ? 'w-2.5 h-2.5 rounded-full bg-red-500 animate-ping'
        : 'w-2.5 h-2.5 rounded-full bg-slate-500';
    }
    if (micPillDot && micPillText) {
      micPillDot.className = isRecording
        ? 'w-2.5 h-2.5 rounded-full bg-red-500'
        : 'w-2.5 h-2.5 rounded-full bg-emerald-500';
      micPillText.textContent = isRecording ? 'Recording WAV' : 'Mic ready';
    }
    refreshIcons();
  }

  function updateMinimumDurationRing(elapsedSec) {
    const ring = document.getElementById('min-duration-ring');
    const label = document.getElementById('min-duration-ring-label');
    const status = document.getElementById('min-duration-status');
    const circumference = 119.38;
    const clamped = Math.min(10, elapsedSec);
    const offset = circumference * (1 - clamped / 10);

    if (ring) {
      ring.style.strokeDashoffset = String(offset);
      ring.setAttribute('stroke', elapsedSec >= 10 ? '#2DE2C8' : '#4F5BF5');
    }
    if (label) {
      label.textContent = `${Math.floor(elapsedSec)}s`;
    }
    if (status) {
      status.textContent =
        elapsedSec >= 10 ? '10s+ clinical quality reached' : 'Target: 10s+ capture';
    }
  }

  // =========================================================================
  // 11. LIVE MIRRORED AUDIO VISUALIZER & SIGNAL QUALITY INDICATOR (Section C 16)
  // =========================================================================
  function drawIdleVisualizer() {
    const canvas = document.getElementById('live-visualizer-canvas');
    if (!canvas || AppState.isRecording) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Center horizon line
    ctx.strokeStyle = 'rgba(20, 184, 166, 0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h / 2);
    ctx.lineTo(w, h / 2);
    ctx.stroke();

    // Subtle idle mirrored bars
    const barCount = 64;
    const gap = 4;
    const barWidth = (w - (barCount - 1) * gap) / barCount;
    ctx.fillStyle = 'rgba(13, 148, 136, 0.28)';
    for (let i = 0; i < barCount; i++) {
      const halfH = 3 + Math.sin(i * 0.35) * 2;
      const x = i * (barWidth + gap);
      ctx.fillRect(x, h / 2 - halfH, barWidth, halfH * 2);
    }
  }

  function updateSignalQualityChips(rms, peak, highFreqRatio) {
    const chipQuiet = document.getElementById('sig-chip-quiet');
    const chipGood = document.getElementById('sig-chip-good');
    const chipClip = document.getElementById('sig-chip-clipping');
    const noisyWarn = document.getElementById('noisy-env-warning');

    const baseClass =
      'px-3.5 py-1.5 rounded-full type-12 font-medium border hairline-border bg-slate-200/50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 transition-all';

    if (chipQuiet) chipQuiet.className = baseClass;
    if (chipGood) chipGood.className = baseClass;
    if (chipClip) chipClip.className = baseClass;

    if (peak > 0.92 || rms > 0.55) {
      if (chipClip) {
        chipClip.className =
          'px-3.5 py-1.5 rounded-full type-12 font-semibold border border-red-500 bg-red-500/20 text-red-700 dark:text-red-300 shadow-sm transition-all';
      }
    } else if (rms < 0.025) {
      if (chipQuiet) {
        chipQuiet.className =
          'px-3.5 py-1.5 rounded-full type-12 font-semibold border border-amber-500 bg-amber-500/20 text-amber-800 dark:text-amber-300 shadow-sm transition-all';
      }
    } else {
      if (chipGood) {
        chipGood.className =
          'px-3.5 py-1.5 rounded-full type-12 font-semibold border border-emerald-500 bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 shadow-sm transition-all';
      }
    }

    if (noisyWarn) {
      if (highFreqRatio > 0.42 && rms > 0.04) {
        noisyWarn.classList.remove('hidden');
        noisyWarn.classList.add('inline-flex');
      } else {
        noisyWarn.classList.add('hidden');
        noisyWarn.classList.remove('inline-flex');
      }
    }
  }

  function startLiveVisualizerLoop() {
    const canvas = document.getElementById('live-visualizer-canvas');
    if (!canvas || !AppState.analyserNode) return;
    const ctx = canvas.getContext('2d');
    const analyser = AppState.analyserNode;

    const freqData = new Uint8Array(analyser.frequencyBinCount);
    const timeData = new Uint8Array(analyser.fftSize);

    function renderFrame() {
      if (!AppState.isRecording) return;
      AppState.visualizerAnimId = requestAnimationFrame(renderFrame);

      analyser.getByteFrequencyData(freqData);
      analyser.getByteTimeDomainData(timeData);

      // Compute RMS and Peak from time-domain waveform
      let sumSq = 0;
      let peak = 0;
      for (let i = 0; i < timeData.length; i++) {
        const norm = (timeData[i] - 128) / 128;
        const abs = Math.abs(norm);
        sumSq += norm * norm;
        if (abs > peak) peak = abs;
      }
      const rms = Math.sqrt(sumSq / timeData.length);

      // Compute high-frequency energy ratio for noisy-environment detector
      let lowEnergy = 1;
      let highEnergy = 0;
      for (let i = 2; i < 48; i++) lowEnergy += freqData[i];
      for (let i = 48; i < 180; i++) highEnergy += freqData[i];
      const highFreqRatio = highEnergy / (lowEnergy + highEnergy);

      updateSignalQualityChips(rms, peak, highFreqRatio);

      // Draw Mirrored Animated Bars
      const w = canvas.width;
      const h = canvas.height;
      const midY = h / 2;
      ctx.clearRect(0, 0, w, h);

      // Center axis line
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      ctx.stroke();

      const barCount = 64;
      const gap = 4;
      const barWidth = (w - (barCount - 1) * gap) / barCount;

      for (let i = 0; i < barCount; i++) {
        const binIndex = Math.floor((i / barCount) * 96) + 1;
        const val = freqData[binIndex] / 255;
        const barHalfHeight = Math.max(3, val * (midY - 10));
        const x = i * (barWidth + gap);

        // Sonar roles: indigo base, aqua mid-level, coral peaks
        if (val > 0.85) {
          ctx.fillStyle = '#FF5A6E';
        } else if (val > 0.5) {
          ctx.fillStyle = '#2DE2C8';
        } else {
          ctx.fillStyle = '#6270FF';
        }

        // Rounded mirrored bar (top and bottom from center line)
        ctx.beginPath();
        ctx.roundRect(x, midY - barHalfHeight, barWidth, barHalfHeight * 2, 3);
        ctx.fill();
      }
    }

    renderFrame();
  }

  // =========================================================================
  // 12. REAL FFT SPECTROGRAM COMPUTATION & PLAYBACK CURSOR (Section C Item 15)
  // =========================================================================
  /**
   * In-place Radix-2 Cooley-Tukey Fast Fourier Transform (FFT)
   */
  function computeRadix2FFT(real, imag) {
    const n = real.length;
    let j = 0;
    for (let i = 0; i < n; i++) {
      if (i < j) {
        const tr = real[i];
        real[i] = real[j];
        real[j] = tr;
        const ti = imag[i];
        imag[i] = imag[j];
        imag[j] = ti;
      }
      let m = n >> 1;
      while (m >= 1 && j >= m) {
        j -= m;
        m >>= 1;
      }
      j += m;
    }

    for (let len = 2; len <= n; len <<= 1) {
      const halfLen = len >> 1;
      const angleStep = (-2 * Math.PI) / len;
      for (let i = 0; i < n; i += len) {
        for (let k = 0; k < halfLen; k++) {
          const angle = angleStep * k;
          const cosA = Math.cos(angle);
          const sinA = Math.sin(angle);
          const idx1 = i + k;
          const idx2 = i + k + halfLen;
          const tre = real[idx2] * cosA - imag[idx2] * sinA;
          const tim = real[idx2] * sinA + imag[idx2] * cosA;
          real[idx2] = real[idx1] - tre;
          imag[idx2] = imag[idx1] - tim;
          real[idx1] += tre;
          imag[idx1] += tim;
        }
      }
    }
  }

  /**
   * Maps normalized dB intensity [0..1] to a clinical Teal-to-Yellow RGB color
   */
  function spectrogramColorRamp(t) {
    // Ink -> indigo -> violet -> coral -> warm white (magma-style, on-brand)
    const stops = [[0,[7,10,24]],[0.25,[40,38,130]],[0.5,[104,66,214]],[0.72,[255,90,110]],[1,[255,236,190]]];
    const v = Math.max(0, Math.min(1, t));
    for (let i = 1; i < stops.length; i++) {
      if (v <= stops[i][0]) {
        const [t0, c0] = stops[i - 1], [t1, c1] = stops[i], k = (v - t0) / (t1 - t0);
        return [0, 1, 2].map((j) => Math.round(c0[j] + (c1[j] - c0[j]) * k));
      }
    }
    return stops[stops.length - 1][1];
  }

  /**
   * Computes a real Short-Time Fourier Transform (STFT) from the AudioBuffer and renders
   * a clinical Teal-to-Yellow spectrogram heatmap on the specified canvas ID.
   */
  function renderRealSpectrogramOnCanvas(canvasId, audioBuffer) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#070A18';
    ctx.fillRect(0, 0, width, height);

    let samples;
    let sampleRate = 44100;

    if (audioBuffer && audioBuffer.length > 0) {
      samples = downmixAudioBufferToMono(audioBuffer);
      sampleRate = audioBuffer.sampleRate;
    } else {
      // Generate representative clinical acoustic signal for seeded demo visits
      sampleRate = 44100;
      samples = new Float32Array(sampleRate * 4);
      for (let i = 0; i < samples.length; i++) {
        const t = i / sampleRate;
        const env = 0.3 + 0.6 * Math.pow(Math.max(0, Math.sin(2 * Math.PI * 0.45 * t)), 2);
        const harmonic1 = Math.sin(2 * Math.PI * 340 * t);
        const harmonic2 = 0.6 * Math.sin(2 * Math.PI * 680 * t);
        const pulse = Math.exp(-Math.pow(((t * 1.6) % 1 - 0.2) / 0.04, 2)) * Math.sin(2 * Math.PI * 120 * t);
        samples[i] = (harmonic1 + harmonic2) * env * 0.35 + pulse * 0.55 + (Math.random() * 2 - 1) * 0.08;
      }
    }

    const fftSize = 512;
    const maxFreqHz = 2000; // Clinical auscultation focus band (0 - 2000 Hz)
    const maxBin = Math.min(
      fftSize / 2,
      Math.max(32, Math.floor((maxFreqHz / sampleRate) * fftSize) * 4)
    );

    // Precompute Hann window
    const hann = new Float32Array(fftSize);
    for (let i = 0; i < fftSize; i++) {
      hann[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (fftSize - 1)));
    }

    const numCols = Math.min(width, 220);
    const colWidth = width / numCols;
    const rowHeight = height / maxBin;

    const real = new Float32Array(fftSize);
    const imag = new Float32Array(fftSize);

    for (let col = 0; col < numCols; col++) {
      const startSample = Math.floor((col / numCols) * Math.max(1, samples.length - fftSize));
      for (let i = 0; i < fftSize; i++) {
        real[i] = (samples[startSample + i] || 0) * hann[i];
        imag[i] = 0;
      }
      computeRadix2FFT(real, imag);

      for (let bin = 1; bin < maxBin; bin++) {
        const mag = Math.sqrt(real[bin] * real[bin] + imag[bin] * imag[bin]) / (fftSize * 0.25);
        const db = 20 * Math.log10(mag + 1e-5);
        // Normalize [-72 dB .. -6 dB] to [0 .. 1]
        const norm = (db + 72) / 66;
        const [r, g, b] = spectrogramColorRamp(norm);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        const y = height - (bin / maxBin) * height;
        ctx.fillRect(col * colWidth, y - rowHeight, Math.ceil(colWidth), Math.ceil(rowHeight) + 1);
      }
    }

    // Draw subtle frequency calibration gridlines & labels
    ctx.strokeStyle = 'rgba(241, 245, 249, 0.12)';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.85)';
    ctx.font = '11px Inter, monospace';
    ctx.lineWidth = 1;

    [500, 1000, 1500].forEach((freq) => {
      const y = height - (freq / maxFreqHz) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      ctx.fillText(`${freq} Hz`, 8, y - 4);
    });
  }

  // Sync Audio Playback with Moving Spectrogram Cursor
  function toggleAudioPlayback() {
    const audio = AppState.audioElement;
    if (!audio.src) {
      showToast('Demo Playback Synthesized', 'Generating clinical acoustic sample for playback.', 'teal');
      // Synthesize a 4s WAV for demo visits if user hasn't recorded yet
      const sr = 22050;
      const samples = new Float32Array(sr * 4);
      for (let i = 0; i < samples.length; i++) {
        const t = i / sr;
        const heartPhase = (t * 1.5) % 1;
        const s1 = Math.exp(-Math.pow((heartPhase - 0.15) / 0.03, 2)) * Math.sin(2 * Math.PI * 105 * t);
        const murmur =
          heartPhase > 0.16 && heartPhase < 0.42
            ? 0.28 * Math.sin(2 * Math.PI * 340 * t) * (0.5 + 0.5 * Math.random())
            : 0;
        const s2 = 0.75 * Math.exp(-Math.pow((heartPhase - 0.45) / 0.025, 2)) * Math.sin(2 * Math.PI * 145 * t);
        samples[i] = (s1 * 0.7 + murmur + s2 * 0.55) * 0.8;
      }
      const wavBlob = encodeMono16BitWavFromSamples(samples, sr);
      if (AppState.lastWavUrl) URL.revokeObjectURL(AppState.lastWavUrl);
      AppState.lastWavUrl = URL.createObjectURL(wavBlob);
      audio.src = AppState.lastWavUrl;
    }

    if (audio.paused) {
      audio.play().catch((err) => console.warn('Audio play blocked:', err));
      setPlayButtonsState(true);
      startPlaybackCursorLoop();
    } else {
      audio.pause();
      setPlayButtonsState(false);
    }
  }

  function setPlayButtonsState(isPlaying) {
    const recPlayLabel = document.getElementById('play-recorded-label');
    const resPlayLabel = document.getElementById('results-play-label');
    if (recPlayLabel) recPlayLabel.textContent = isPlaying ? 'Pause' : 'Play Recording';
    if (resPlayLabel) resPlayLabel.textContent = isPlaying ? 'Pause' : 'Play Recording';
  }

  function startPlaybackCursorLoop() {
    if (AppState.playbackRafId) cancelAnimationFrame(AppState.playbackRafId);
    const audio = AppState.audioElement;
    const recCursor = document.getElementById('recording-spectrogram-cursor');
    const resCursor = document.getElementById('results-spectrogram-cursor');
    const slider = document.getElementById('player-seek-slider');
    const currTimeEl = document.getElementById('player-current-time');

    function step() {
      const dur = audio.duration || (AppState.lastAudioBuffer ? AppState.lastAudioBuffer.duration : 4);
      const pct = dur > 0 ? Math.min(100, (audio.currentTime / dur) * 100) : 0;

      if (recCursor) recCursor.style.left = `${pct}%`;
      if (resCursor) resCursor.style.left = `${pct}%`;
      if (slider) slider.value = String(pct);
      if (currTimeEl) currTimeEl.textContent = formatTimer(audio.currentTime || 0);

      if (!audio.paused && !audio.ended) {
        AppState.playbackRafId = requestAnimationFrame(step);
      } else if (audio.ended) {
        setPlayButtonsState(false);
      }
    }

    step();
  }

  // =========================================================================
  // 13. AI ANALYSIS & RESULTS SCREEN (Section A Item 8 + Section C Item 15)
  // =========================================================================
  async function runClinicalAiAnalysis(forceLowConfidenceOption) {
    navigateToView('results');

    const loadingEl = document.getElementById('results-loading-state');
    const contentEl = document.getElementById('results-content-wrapper');
    if (loadingEl) loadingEl.classList.remove('hidden');
    if (contentEl) contentEl.classList.add('hidden');

    const meta = {
      species: AppState.selectedSpecies,
      target: AppState.selectedTarget,
      side: AppState.selectedSide,
      siteId: AppState.selectedSiteId,
      forceLowConfidence: forceLowConfidenceOption
    };

    const result = await DataService.analyzeAudio(AppState.lastWavBlob, meta);
    AppState.currentAnalysisResult = result;

    if (loadingEl) loadingEl.classList.add('hidden');
    if (contentEl) contentEl.classList.remove('hidden');

    const activeSite = getActiveSiteConfig();
    const patientName = (document.getElementById('input-patient-name')?.value || 'Barnaby').trim();
    const patientBreed = (document.getElementById('input-patient-breed')?.value || '').trim();

    populateResultsScreen({
      species: AppState.selectedSpecies,
      target: AppState.selectedTarget,
      side: AppState.selectedSide,
      siteId: AppState.selectedSiteId,
      siteLabel: activeSite ? activeSite.label : AppState.selectedSiteId,
      patientName,
      patientBreed,
      timestamp: Date.now(),
      analysisResult: result
    });
  }

  function animateConfidenceCountUp(targetPct, isInconclusive) {
    const numEl = document.getElementById('res-confidence-number');
    const barEl = document.getElementById('res-confidence-bar');
    if (!numEl || !barEl) return;

    barEl.style.width = '0%';
    barEl.className = isInconclusive
      ? 'h-full rounded-full bg-amber-500 transition-all duration-700 ease-out'
      : 'h-full rounded-full bg-primary-600 transition-all duration-700 ease-out';

    numEl.className = isInconclusive
      ? 'type-32 font-semibold tabular-nums text-amber-600 dark:text-amber-400'
      : 'type-32 font-semibold tabular-nums text-primary-700 dark:text-primary-300';

    requestAnimationFrame(() => {
      barEl.style.width = `${targetPct}%`;
    });

    const startTime = performance.now();
    const duration = 650;

    function tick(now) {
      const progress = Math.min(1, (now - startTime) / duration);
      const currentVal = Math.round(progress * targetPct);
      numEl.textContent = `${currentVal}%`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }
    requestAnimationFrame(tick);
  }

  function populateResultsScreen(visitObj) {
    const res = visitObj.analysisResult;
    if (!res) return;

    const sideCap =
      (visitObj.side || 'left').charAt(0).toUpperCase() + (visitObj.side || 'left').slice(1);

    document.getElementById('res-meta-species').textContent = visitObj.species;
    document.getElementById('res-meta-target').textContent = visitObj.target;
    document.getElementById('res-meta-side').textContent = `${sideCap} Side`;
    document.getElementById('res-meta-site').textContent = visitObj.siteLabel || visitObj.siteId;
    document.getElementById('res-meta-timestamp').textContent = formatRelativeTime(visitObj.timestamp);
    document.getElementById('res-patient-heading').textContent = `${visitObj.patientName} — Acoustic Analysis Report`;

    const isInconclusive = res.confidence < 70;
    const inconclusiveBanner = document.getElementById('res-inconclusive-banner');
    const inconclusivePct = document.getElementById('res-inconclusive-pct');
    const predictedSoundEl = document.getElementById('res-predicted-sound');
    const summaryEl = document.getElementById('res-clinical-summary');
    const statusDotEl = document.getElementById('res-status-dot');
    const statusLabelEl = document.getElementById('res-status-label');
    const confTierEl = document.getElementById('res-confidence-tier');

    if (isInconclusive) {
      if (inconclusiveBanner) inconclusiveBanner.classList.remove('hidden');
      if (inconclusivePct) inconclusivePct.textContent = `${res.confidence}%`;
      if (predictedSoundEl) {
        predictedSoundEl.textContent = 'Inconclusive - rely on clinical judgment';
      }
      if (summaryEl) {
        summaryEl.textContent = `Candidate signal pattern (${res.predictedSound}) detected below the 70% diagnostic certainty threshold. Direct veterinary auscultation and clinical correlation required.`;
      }
      if (statusDotEl) statusDotEl.className = 'w-3 h-3 rounded-full bg-amber-500';
      if (statusLabelEl) statusLabelEl.textContent = 'Low Confidence (<70%) · Clinical Judgment Required';
      if (confTierEl) confTierEl.textContent = 'Below 70% threshold (Inconclusive)';
    } else {
      if (inconclusiveBanner) inconclusiveBanner.classList.add('hidden');
      if (predictedSoundEl) predictedSoundEl.textContent = res.predictedSound;
      if (summaryEl) summaryEl.textContent = res.summary;
      if (statusDotEl) {
        statusDotEl.className =
          res.status === 'Normal'
            ? 'w-3 h-3 rounded-full bg-emerald-500'
            : 'w-3 h-3 rounded-full bg-rose-500';
      }
      if (statusLabelEl) {
        statusLabelEl.textContent =
          res.status === 'Normal'
            ? 'Acoustic Classification · Normal Pattern'
            : 'Acoustic Classification · Adventitious / Murmur Detected';
      }
      if (confTierEl) confTierEl.textContent = 'Confident clinical range (70–95%)';
    }

    animateConfidenceCountUp(res.confidence, isInconclusive);

    // Render Spectrogram on Results Canvas + Position "AI attention (Demo)" Highlight Overlay
    renderRealSpectrogramOnCanvas('results-spectrogram-canvas', AppState.lastAudioBuffer);
    const attentionOverlay = document.getElementById('ai-attention-overlay');
    const attentionBandLabel = document.getElementById('ai-attention-band-label');
    if (attentionOverlay && res.attentionBox) {
      attentionOverlay.style.left = `${res.attentionBox.leftPct}%`;
      attentionOverlay.style.width = `${res.attentionBox.widthPct}%`;
    }
    if (attentionBandLabel) {
      attentionBandLabel.textContent = res.attentionBand || '250–900 Hz · Peak Energy';
    }

    // Populate Ranked Differential Diagnoses
    const diffContainer = document.getElementById('res-differentials-list');
    if (diffContainer) {
      diffContainer.innerHTML = (res.differentials || [])
        .map(
          (d, idx) => `
          <div class="p-4 rounded-xl bg-slate-200/50 dark:bg-slate-800/60 border hairline-border space-y-1">
            <div class="flex items-center justify-between gap-2">
              <span class="type-14 font-semibold text-slate-900 dark:text-slate-100">${idx + 1}. ${d.name}</span>
              <span class="type-12 font-semibold text-primary-700 dark:text-primary-300 tabular-nums shrink-0">${d.probability}</span>
            </div>
            <p class="type-12 text-slate-600 dark:text-slate-400">${d.note}</p>
          </div>
        `
        )
        .join('');
    }

    // Populate 2-3 Recommended Diagnostic Tests
    const testsContainer = document.getElementById('res-tests-list');
    if (testsContainer) {
      testsContainer.innerHTML = (res.recommendedTests || [])
        .map(
          (t) => `
          <div class="p-4 rounded-xl bg-slate-200/50 dark:bg-slate-800/60 border hairline-border space-y-1">
            <span class="type-14 font-semibold text-slate-900 dark:text-slate-100 block">${t.title}</span>
            <p class="type-12 text-slate-600 dark:text-slate-400">${t.reason}</p>
          </div>
        `
        )
        .join('');
    }
  }

  async function saveCurrentVisitFromResults() {
    const activeSite = getActiveSiteConfig();
    const patientName = (document.getElementById('input-patient-name')?.value || 'Barnaby').trim();
    const patientBreed = (document.getElementById('input-patient-breed')?.value || '').trim();
    const notes = (document.getElementById('input-visit-notes')?.value || '').trim();
    const finding = AppState.collectionMode
      ? document.getElementById('select-collection-finding')?.value || 'Normal'
      : null;
    const caseId = AppState.collectionMode
      ? document.getElementById('input-collection-case-id')?.value || 'CASE-2026'
      : null;

    const visitPayload = {
      id: AppState.currentVisitDraftId || 'visit_' + Date.now(),
      timestamp: Date.now(),
      species: AppState.selectedSpecies,
      target: AppState.selectedTarget,
      side: AppState.selectedSide,
      siteId: AppState.selectedSiteId,
      siteLabel: activeSite ? activeSite.label : AppState.selectedSiteId,
      patientName,
      patientBreed,
      notes,
      finding,
      caseId,
      wavFilename: AppState.lastWavFilename || buildExpectedWavFilename(formatCounterPad(peekNextWavCounter())),
      protocolRecordings: AppState.protocolRecordings,
      analysisResult: AppState.currentAnalysisResult
    };

    const saved = await DataService.saveVisit(visitPayload);
    AppState.currentVisitDraftId = saved.id;
    showToast(
      'Clinical Visit Saved',
      `${saved.patientName} (${saved.species} · ${saved.target}) saved to Visit History.`,
      'emerald'
    );
    renderDashboard();
  }

  async function openSavedVisitInResults(visitId) {
    const visit = await DataService.getVisit(visitId);
    if (!visit) return;

    AppState.currentVisitDraftId = visit.id;
    AppState.selectedSpecies = visit.species;
    AppState.selectedTarget = visit.target;
    AppState.selectedSide = visit.side;
    AppState.selectedSiteId = visit.siteId;
    AppState.currentAnalysisResult = visit.analysisResult;

    navigateToView('results');
    const loadingEl = document.getElementById('results-loading-state');
    const contentEl = document.getElementById('results-content-wrapper');
    if (loadingEl) loadingEl.classList.add('hidden');
    if (contentEl) contentEl.classList.remove('hidden');

    populateResultsScreen(visit);
  }

  // =========================================================================
  // 14. HISTORY VIEW & DATASET CSV EXPORT
  // =========================================================================
  async function renderHistoryView() {
    const visits = await DataService.getVisits();
    const container = document.getElementById('history-visits-container');
    if (!container) return;

    const query = AppState.historySearchQuery.toLowerCase().trim();
    const spFilter = AppState.historySpeciesFilter;

    const filtered = visits.filter((v) => {
      if (spFilter !== 'All' && v.species !== spFilter) return false;
      if (!query) return true;
      const haystack = [
        v.patientName,
        v.patientBreed,
        v.species,
        v.target,
        v.side,
        v.siteLabel,
        v.caseId,
        v.finding,
        v.notes,
        v.analysisResult?.predictedSound
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="glass-card p-10 text-center space-y-2">
          <p class="type-16 font-semibold text-slate-800 dark:text-slate-200">No matching clinical visits</p>
          <p class="type-14 text-slate-500 dark:text-slate-400">Try clearing your search query or switching the species filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered
      .map((visit, idx) => {
        const res = visit.analysisResult || {
          predictedSound: 'Recorded WAV Signal',
          confidence: 80,
          status: 'Normal'
        };
        const sideLabel = visit.side ? visit.side.charAt(0).toUpperCase() + visit.side.slice(1) : 'Left';
        return `
          <div
            class="glass-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary-600/50 cursor-pointer stagger-item"
            style="animation-delay: ${idx * 35}ms"
            data-history-visit-id="${visit.id}"
            role="button"
            tabindex="0"
          >
            <div class="flex items-start gap-4 min-w-0">
              <div class="w-12 h-12 rounded-2xl bg-primary-600/15 text-primary-700 dark:text-primary-300 font-semibold type-16 flex items-center justify-center shrink-0">
                ${getPatientInitials(visit.patientName)}
              </div>
              <div class="space-y-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="type-16 font-semibold text-slate-900 dark:text-slate-100">${visit.patientName}</span>
                  ${visit.patientBreed ? `<span class="type-12 text-slate-500 dark:text-slate-400">· ${visit.patientBreed}</span>` : ''}
                  ${visit.caseId ? `<span class="type-12 font-mono text-primary-700 dark:text-primary-400">· ${visit.caseId}</span>` : ''}
                  ${visit.finding ? `<span class="type-12 text-slate-500 dark:text-slate-400">· Label: ${visit.finding}</span>` : ''}
                </div>
                <p class="type-14 font-medium text-slate-800 dark:text-slate-200">${res.predictedSound}</p>
                <div class="flex flex-wrap items-center gap-1.5 type-12 text-slate-500 dark:text-slate-400">
                  <span class="font-medium text-slate-700 dark:text-slate-300">${visit.species}</span>
                  <span>·</span>
                  <span>${visit.target}</span>
                  <span>·</span>
                  <span>${sideLabel} Side</span>
                  <span>·</span>
                  <span>${visit.siteLabel || visit.siteId}</span>
                  ${visit.wavFilename ? `<span>·</span><code class="font-mono text-slate-500">${visit.wavFilename}</code>` : ''}
                </div>
              </div>
            </div>

            <div class="flex md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
              ${createStatusBadgeHTML(res.status, res.confidence)}
              <span class="type-12 text-slate-500 dark:text-slate-400 tabular-nums">${formatRelativeTime(visit.timestamp)}</span>
            </div>
          </div>
        `;
      })
      .join('');

    container.querySelectorAll('[data-history-visit-id]').forEach((el) => {
      el.addEventListener('click', () => {
        openSavedVisitInResults(el.getAttribute('data-history-visit-id'));
      });
    });
  }

  async function exportHistoryDatasetCsv() {
    const visits = await DataService.getVisits();
    const headers = [
      'VisitID',
      'TimestampISO',
      'PatientName',
      'Breed',
      'Species',
      'Target',
      'Side',
      'SiteID',
      'SiteLabel',
      'CollectionFinding',
      'CaseID',
      'WAVFilename',
      'PredictedSound',
      'ConfidencePct',
      'Status'
    ];
    const rows = visits.map((v) => [
      v.id,
      new Date(v.timestamp).toISOString(),
      v.patientName,
      v.patientBreed || '',
      v.species,
      v.target,
      v.side,
      v.siteId,
      v.siteLabel || '',
      v.finding || '',
      v.caseId || '',
      v.wavFilename || '',
      v.analysisResult?.predictedSound || '',
      v.analysisResult?.confidence || '',
      v.analysisResult?.status || ''
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    triggerWavDownload(url, `VetAcoustics_Clinical_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    showToast('Clinical Dataset CSV Exported', `${visits.length} visit records exported.`, 'emerald');
  }

  // =========================================================================
  // 15. SETTINGS & COLLECTION MODE UI SYNC (Section C Item 17)
  // =========================================================================
  function syncCollectionModeUI() {
    const toggleBtn = document.getElementById('toggle-collection-mode');
    const fieldsPanel = document.getElementById('collection-mode-fields');
    const sidebarBanner = document.getElementById('sidebar-collection-banner');
    const headerIndicator = document.getElementById('header-collection-indicator');

    if (toggleBtn) {
      toggleBtn.setAttribute('aria-checked', AppState.collectionMode ? 'true' : 'false');
    }
    if (fieldsPanel) {
      fieldsPanel.classList.toggle('hidden', !AppState.collectionMode);
    }
    if (sidebarBanner) {
      sidebarBanner.classList.toggle('hidden', !AppState.collectionMode);
    }
    if (headerIndicator) {
      headerIndicator.classList.toggle('hidden', !AppState.collectionMode);
    }
    updateFilenamePreview();
  }

  function openSettingsModal(open) {
    const modal = document.getElementById('settings-modal-backdrop');
    if (!modal) return;
    modal.classList.toggle('hidden', !open);
  }

  // =========================================================================
  // 16. EVENT LISTENERS & INITIALIZATION
  // =========================================================================
  function bindEvents() {
    // Navigation buttons
    document.querySelectorAll('[data-nav]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-nav');
        if (target === 'new-visit') {
          AppState.currentVisitDraftId = null;
        }
        navigateToView(target);
      });
    });

    // Dashboard Hero CTAs
    document.getElementById('btn-hero-start-auscultation')?.addEventListener('click', () => {
      AppState.currentVisitDraftId = null;
      AppState.fullProtocolMode = false;
      document.getElementById('toggle-full-protocol')?.setAttribute('aria-checked', 'false');
      setGuidedStep(1);
      navigateToView('new-visit');
    });

    document.getElementById('btn-hero-start-protocol')?.addEventListener('click', () => {
      AppState.currentVisitDraftId = null;
      AppState.fullProtocolMode = true;
      document.getElementById('toggle-full-protocol')?.setAttribute('aria-checked', 'true');
      setGuidedStep(2);
      navigateToView('new-visit');
      showToast('Full Protocol Mode Active', 'Walk through every anatomical site sequentially.', 'teal');
    });

    // Guided Stepper Tabs
    [1, 2, 3].forEach((stepNum) => {
      document.getElementById(`step-tab-${stepNum}`)?.addEventListener('click', () => {
        setGuidedStep(stepNum);
      });
    });

    document.getElementById('btn-back-to-species')?.addEventListener('click', () => {
      setGuidedStep(1);
    });

    // Side Toggle Buttons (Left / Right / Ventral)
    ['left', 'right', 'ventral'].forEach((s) => {
      document.getElementById(`btn-side-${s}`)?.addEventListener('click', () => {
        selectSide(s);
      });
    });

    // Rib & ICS Overlay Toggle
    document.getElementById('btn-toggle-ribs')?.addEventListener('click', () => {
      AppState.showRibOverlay = !AppState.showRibOverlay;
      const lbl = document.getElementById('rib-toggle-label');
      if (lbl) lbl.textContent = AppState.showRibOverlay ? 'Ribs & ICS: On' : 'Ribs & ICS: Off';
      renderInteractiveAnatomyStage();
    });

    // Full Protocol Mode Switch
    document.getElementById('toggle-full-protocol')?.addEventListener('click', (e) => {
      const btn = e.currentTarget;
      AppState.fullProtocolMode = !AppState.fullProtocolMode;
      btn.setAttribute('aria-checked', AppState.fullProtocolMode ? 'true' : 'false');
      updateProtocolProgressUI();
    });

    document.getElementById('btn-protocol-prev')?.addEventListener('click', () => stepProtocolSite(-1));
    document.getElementById('btn-protocol-next')?.addEventListener('click', () => stepProtocolSite(1));

    document.getElementById('btn-protocol-advance-after-rec')?.addEventListener('click', () => {
      stepProtocolSite(1);
      const studio = document.getElementById('guided-step-2');
      if (studio) studio.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // Manual Selection Fallback Toggle & Dropdowns
    document.getElementById('btn-toggle-manual-fallback')?.addEventListener('click', () => {
      AppState.manualSelectionOpen = !AppState.manualSelectionOpen;
      const panel = document.getElementById('manual-selection-panel');
      const label = document.getElementById('manual-fallback-btn-label');
      if (panel) panel.classList.toggle('hidden', !AppState.manualSelectionOpen);
      if (label) {
        label.textContent = AppState.manualSelectionOpen ? 'Hide manual selection' : 'Manual selection';
      }
      syncManualSelectionDropdowns();
    });

    document.getElementById('manual-species')?.addEventListener('change', (e) => {
      selectSpecies(e.target.value, false);
    });
    document.getElementById('manual-target')?.addEventListener('change', (e) => {
      selectTarget(e.target.value);
    });
    document.getElementById('manual-side')?.addEventListener('change', (e) => {
      selectSide(e.target.value);
    });
    document.getElementById('manual-site')?.addEventListener('change', (e) => {
      selectSite(e.target.value);
    });

    // Update filename preview when patient name or collection fields change
    ['input-patient-name', 'select-collection-finding', 'input-collection-case-id'].forEach((id) => {
      document.getElementById(id)?.addEventListener('input', updateFilenamePreview);
      document.getElementById(id)?.addEventListener('change', updateFilenamePreview);
    });

    // Step 3 "Start recording at this site" button
    document.getElementById('btn-proceed-to-recording')?.addEventListener('click', () => {
      setGuidedStep(3);
    });

    // Start / Stop Recording Button
    document.getElementById('btn-record-toggle')?.addEventListener('click', () => {
      if (AppState.isRecording) {
        stopAuscultationRecording();
      } else {
        startAuscultationRecording();
      }
    });

    // Re-download WAV Button
    document.getElementById('btn-redownload-wav')?.addEventListener('click', () => {
      if (AppState.lastWavUrl && AppState.lastWavFilename) {
        triggerWavDownload(AppState.lastWavUrl, AppState.lastWavFilename);
      }
    });

    // Audio Player & Spectrogram Scrubbing
    document.getElementById('btn-play-recorded-audio')?.addEventListener('click', toggleAudioPlayback);
    document.getElementById('btn-results-play-audio')?.addEventListener('click', toggleAudioPlayback);

    document.getElementById('player-seek-slider')?.addEventListener('input', (e) => {
      const pct = parseFloat(e.target.value);
      const audio = AppState.audioElement;
      if (audio.duration) {
        audio.currentTime = (pct / 100) * audio.duration;
        startPlaybackCursorLoop();
      }
    });

    ['recording-spectrogram-canvas', 'results-spectrogram-canvas'].forEach((canvasId) => {
      const c = document.getElementById(canvasId);
      if (!c) return;
      c.addEventListener('click', (e) => {
        const rect = c.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const audio = AppState.audioElement;
        if (!audio.src) {
          toggleAudioPlayback();
        }
        if (audio.duration) {
          audio.currentTime = ratio * audio.duration;
          startPlaybackCursorLoop();
        }
      });
    });

    // Run AI Analysis (Demo) Button
    document.getElementById('btn-run-ai-analysis')?.addEventListener('click', () => {
      runClinicalAiAnalysis(undefined);
    });

    // Re-run Analysis Button on Results Screen (alternates high-confidence and <70% inconclusive so vet can test both states)
    document.getElementById('btn-rerun-analysis')?.addEventListener('click', () => {
      AppState.nextRerunLowConfidence = !AppState.nextRerunLowConfidence;
      runClinicalAiAnalysis(AppState.nextRerunLowConfidence);
    });

    // Results Save Visit & Back to Dashboard
    document.getElementById('btn-results-save-visit')?.addEventListener('click', saveCurrentVisitFromResults);
    document.getElementById('btn-results-back-dashboard')?.addEventListener('click', () => {
      navigateToView('dashboard');
    });

    // History Search, Filter, & CSV Export
    document.getElementById('history-search-input')?.addEventListener('input', (e) => {
      AppState.historySearchQuery = e.target.value;
      renderHistoryView();
    });

    document.querySelectorAll('#history-species-filter [data-filter-species]').forEach((btn) => {
      btn.addEventListener('click', () => {
        AppState.historySpeciesFilter = btn.getAttribute('data-filter-species');
        document.querySelectorAll('#history-species-filter [data-filter-species]').forEach((b) => {
          b.classList.toggle('active', b === btn);
        });
        renderHistoryView();
      });
    });

    document.getElementById('btn-export-history-csv')?.addEventListener('click', exportHistoryDatasetCsv);

    // Theme & Settings Modal Controls
    document.getElementById('btn-theme-toggle-sidebar')?.addEventListener('click', toggleThemeQuick);
    document.getElementById('btn-theme-toggle-header')?.addEventListener('click', toggleThemeQuick);

    document.getElementById('btn-open-settings-sidebar')?.addEventListener('click', () => openSettingsModal(true));
    document.getElementById('btn-open-settings-header')?.addEventListener('click', () => openSettingsModal(true));
    document.getElementById('btn-close-settings')?.addEventListener('click', () => openSettingsModal(false));
    document.getElementById('btn-done-settings')?.addEventListener('click', () => openSettingsModal(false));

    document.getElementById('settings-modal-backdrop')?.addEventListener('click', (e) => {
      if (e.target.id === 'settings-modal-backdrop') openSettingsModal(false);
    });

    document.querySelectorAll('#settings-theme-selector [data-theme-pref]').forEach((btn) => {
      btn.addEventListener('click', () => {
        applyTheme(btn.getAttribute('data-theme-pref'));
      });
    });

    // Collection Mode Toggle in Settings
    document.getElementById('toggle-collection-mode')?.addEventListener('click', () => {
      AppState.collectionMode = !AppState.collectionMode;
      localStorage.setItem(STORAGE_KEYS.COLLECTION_MODE, String(AppState.collectionMode));
      syncCollectionModeUI();
      showToast(
        AppState.collectionMode ? 'Collection Mode Enabled' : 'Collection Mode Disabled',
        AppState.collectionMode
          ? 'Finding label and Case ID will be appended to WAV filenames.'
          : 'Standard WAV filename pattern restored.',
        'teal'
      );
    });

    // Simulated Audio Toggle in Settings
    const simToggle = document.getElementById('toggle-sim-audio');
    if (simToggle) {
      simToggle.setAttribute('aria-checked', AppState.simAudioMode ? 'true' : 'false');
      simToggle.addEventListener('click', () => {
        AppState.simAudioMode = !AppState.simAudioMode;
        localStorage.setItem(STORAGE_KEYS.SIM_AUDIO, String(AppState.simAudioMode));
        simToggle.setAttribute('aria-checked', AppState.simAudioMode ? 'true' : 'false');
      });
    }

    // Reset Demo Data
    document.getElementById('btn-reset-demo-data')?.addEventListener('click', async () => {
      localStorage.removeItem(STORAGE_KEYS.VISITS);
      localStorage.setItem(STORAGE_KEYS.WAV_COUNTER, '3');
      await renderDashboard();
      await renderHistoryView();
      openSettingsModal(false);
      showToast('Demo Data Restored', 'Reset to 3 clinical demo visits and counter #004.', 'teal');
    });
  }

  async function initApp() {
    applyTheme(AppState.themePref);
    syncCollectionModeUI();
    bindEvents();

    // Seed initial visits via DataService and populate views
    const visits = await DataService.getVisits();
    renderSpeciesStepCards();
    syncManualSelectionDropdowns();
    await renderInteractiveAnatomyStage();
    updateRecordingContextBanner();
    drawIdleVisualizer();

    // Pre-populate Results view with the most recent visit so navigating directly to Results is rich and functional
    if (visits.length > 0) {
      AppState.currentAnalysisResult = visits[0].analysisResult;
      populateResultsScreen(visits[0]);
    }

    await renderDashboard();
    navigateToView('dashboard');
    refreshIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();
