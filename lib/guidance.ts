import type { FarmContext } from "@/lib/questions";

export type Guidance = {
  topic: string;
  answer: string;
  steps: string[];
  followUp: string;
  contextSummary: string;
  locationNote: string;
  cropNote?: string;
  sources: { label: string; url: string }[];
};

type Rule = {
  topic: string;
  matches: RegExp;
  answer: (crop: string) => string;
  steps: string[];
  followUp: string;
};

const rules: Rule[] = [
  {
    topic: "Pesticide and spray safety",
    matches: /pesticide|insecticide|fungicide|herbicide|spray|chemical|dosage|dose|mix(ing)? rate|பூச்சிக்கொல்லி|தெளி|மருந்து/i,
    answer: (crop) => `Before applying anything${crop ? ` to ${crop}` : ""}, identify the pest, disease, or weed first. A wrong product or dose can damage the crop, harm people and beneficial insects, and leave unsafe residues. I can help narrow down what to check, but I can’t safely recommend a chemical dose from this description.`,
    steps: ["Check several affected and healthy plants, including leaf undersides and stems, and note how widely the problem has spread.", "Take a clear close-up and a whole-plant photo; record the crop stage and recent sprays.", "Ask a local agricultural officer or KVK to confirm the cause. If a product is recommended, follow its label, protective equipment, and re-entry instructions exactly."],
    followUp: "What crop is affected, what do you see on the plant, and what product (if any) has already been applied?",
  },
  {
    topic: "Water and irrigation",
    matches: /water|irrigat|drain|flood|drought|wilting|wilt|dry soil|waterlog|நீர்|பாசனம்|வாடுகிறது|வறட்சி/i,
    answer: (crop) => `Start by checking moisture in the root zone${crop ? ` around your ${crop}` : ""}, rather than relying only on the surface. Both too much and too little water can stress plants, and the right irrigation interval depends on soil, crop, and growth stage.`,
    steps: ["Check soil moisture a few centimetres below the surface in more than one part of the field.", "Look for standing water, blocked drainage, or plants wilting during the cooler part of the day.", "Adjust irrigation only after checking local crop guidance and the field’s drainage; avoid a large change based on one plant."],
    followUp: "Which crop and growth stage is this, and is the soil currently dry, moist, or holding standing water?",
  },
  {
    topic: "Yellow leaves and plant nutrition",
    matches: /yellow|pale|chlorosis|nutrient|nitrogen|deficien|fertili[sz]|manure|மஞ்சள|ஊட்டச்சத்து|உரம்/i,
    answer: (crop) => `Yellowing${crop ? ` in ${crop}` : ""} is a symptom, not a diagnosis. It can be related to water stress, nutrient availability, root damage, pests, or disease. The pattern and which leaves changed first are useful clues; avoid adding fertilizer until you check them.`,
    steps: ["Compare older leaves with the newest growth and note whether yellowing is even, between veins, at the edges, or in patches.", "Check soil moisture and inspect roots, leaf undersides, and nearby plants for insects or spots.", "If the pattern is spreading or field-wide, get a soil or plant test and consult a local agricultural officer before changing fertilizer."],
    followUp: "Did the older leaves or new leaves turn yellow first, and is the change uniform or patchy?",
  },
  {
    topic: "Leaf spots and possible disease",
    matches: /spot|lesion|blight|rot|mildew|fung|disease|mould|mold|rust|streak|புள்ளி|நோய்|துரு/i,
    answer: (crop) => `Spots or lesions${crop ? ` on ${crop}` : ""} can have several causes, including disease, insects, or physical damage. Their shape, location, and spread matter, so a short description alone is not enough to identify the cause reliably.`,
    steps: ["Photograph both sides of an affected leaf and include one healthy leaf for comparison.", "Check whether spots have a halo, powder, concentric rings, or a water-soaked edge; note recent rain and whether the issue is spreading.", "Avoid spraying until the cause is checked. Remove or handle affected material only according to local crop guidance."],
    followUp: "What crop is it, where on the plant did the spots begin, and how quickly are they spreading?",
  },
  {
    topic: "Pests and insects",
    matches: /pest|insect|bug|worm|caterpillar|aphid|borer|whitefl|hopper|mite|chew|holes in|பூச்சி|புழு/i,
    answer: (crop) => `First confirm what is feeding on the plant${crop ? ` and affecting your ${crop}` : ""}. Leaf holes, curling, and yellowing can have different causes, and some insects present in a field may be beneficial rather than harmful.`,
    steps: ["Inspect several plants, especially leaf undersides, new shoots, stems, and the edge of damaged areas.", "Look for the insect, eggs, webbing, droppings, or fresh feeding damage; note how many plants are affected.", "Take a clear photo and ask a local extension officer to identify it before using any pesticide."],
    followUp: "Can you describe or photograph the insect or damage, and roughly how many plants are affected?",
  },
  {
    topic: "Soil health",
    matches: /soil|ph\b|salin|alkalin|acidic|compaction|organic matter|soil test|மண்|மண்ணின்/i,
    answer: (crop) => `A soil test is the most useful starting point${crop ? ` for planning inputs for ${crop}` : ""}. Soil texture, pH, salinity, drainage, and nutrient levels can vary within a field, so a visual check alone cannot determine which amendment is needed.`,
    steps: ["Collect a representative soil sample using your local agriculture department’s sampling instructions.", "Keep samples from visibly different parts of the field separate and label their locations.", "Use the lab report and local recommendations to choose amendments; avoid applying lime, gypsum, or fertilizer without test results."],
    followUp: "What crop are you growing, and do you have a recent soil-test result or a specific soil symptom?",
  },
  {
    topic: "Seed selection and germination",
    matches: /seed|germinat|variety|cultivar|sowing|planting material|விதை|விதைப்பு|முளை/i,
    answer: (crop) => `Choose seed for the crop and conditions in your area${crop ? `, including your ${crop} season` : ""}. A locally recommended variety, reliable source, and suitable sowing window are more useful than selecting by yield claims alone.`,
    steps: ["Check the variety’s recommended season, duration, and local suitability with your agriculture department or KVK.", "Buy labelled seed from a reliable source and check the lot, germination information, and expiry details.", "If the seed is already on hand, test a small sample for germination before sowing the whole field."],
    followUp: "Which crop, district, and sowing season are you planning for?",
  },
  {
    topic: "Weather and field planning",
    matches: /weather|rain|rainfall|forecast|wind|temperature|heat|cold|storm|வானிலை|மழை|காற்று/i,
    answer: () => "Plan field work using a current local forecast and conditions in your own field. Nearby areas can receive different rainfall, and this app does not have a live weather feed.",
    steps: ["Check the latest IMD or local agriculture advisory for your district.", "Compare the forecast with soil moisture, drainage, and the crop’s growth stage before irrigating or spraying.", "Avoid spraying in strong wind or when rain is expected soon; follow the product label and local safety guidance."],
    followUp: "Which village or district and crop should the advisory relate to?",
  },
  {
    topic: "Harvest timing",
    matches: /harvest|matur|ripe|ready to cut|cutting time|அறுவடை|முதிர்/i,
    answer: (crop) => `Harvest timing depends on crop variety, intended use, and maturity signs${crop ? ` for ${crop}` : ""}. Calendar days alone can be misleading, so check the crop and grain or fruit directly.`,
    steps: ["Check maturity indicators recommended for your crop and variety, such as colour, firmness, or grain moisture.", "Inspect plants from several parts of the field rather than relying on one sample.", "Check the local forecast and harvest guidance to reduce losses during drying, transport, or storage."],
    followUp: "Which crop and variety is it, and what maturity signs are you seeing?",
  },
];

const cropParts: Array<{ matches: RegExp; name: string; parts: string }> = [
  { matches: /paddy|rice|நெல்|அரிசி/i, name: "rice", parts: "leaf blades, tillers, and panicles" },
  { matches: /tomato/i, name: "tomato", parts: "leaves, stems, flowers, and fruits" },
  { matches: /maize|corn/i, name: "maize", parts: "the whorl, leaves, stalk, and developing ears" },
  { matches: /cotton/i, name: "cotton", parts: "leaves, squares, flowers, and bolls" },
  { matches: /banana|plantain/i, name: "banana", parts: "leaves, pseudostem, and bunch" },
  { matches: /wheat|கோதுமை/i, name: "wheat", parts: "tillers, flag leaves, and heads" },
  { matches: /groundnut|peanut/i, name: "groundnut", parts: "leaves, stems, and the plant base where pegs enter the soil" },
  { matches: /coconut/i, name: "coconut", parts: "fronds, crown, and developing nuts" },
  { matches: /sugar\s*cane|cane|கரும்பு/i, name: "sugarcane", parts: "leaf blades, leaf sheaths, and jointed stalk internodes" },
];

function sugarcaneStageCheck(stage: string) {
  if (/plant|germinat|emergence|sett/i.test(stage)) return "During planting and establishment, check sett sprouting and emergence across the field, and compare gaps and moisture in several rows.";
  if (/tiller/i.test(stage)) return "During tillering, compare the number and vigour of shoots across the field; check for gaps, weeds, and uneven moisture before changing inputs.";
  if (/grand growth|elongat|stem growth/i.test(stage)) return "During grand growth and stalk elongation, inspect the newest leaves and stalks, and compare internode development and growth across healthy and affected areas.";
  if (/matur|harvest|ripen/i.test(stage)) return "Near sugarcane maturity, use local variety and harvest guidance and assess representative stalks; maturity and harvest timing depend on variety and local conditions.";
  if (/ratoon/i.test(stage)) return "For a ratoon crop, compare regrowth and gaps after harvest, and inspect stubble, drainage, and early shoot emergence across the field.";
  return stageCheck(stage);
}

function wheatStageCheck(stage: string) {
  if (/tiller/i.test(stage)) return "During wheat tillering, compare the number and vigour of shoots across the field, and check for gaps, weeds, and uneven moisture.";
  if (/stem elongat|jointing|boot/i.test(stage)) return "During stem elongation or booting, inspect the newest leaves and developing stems, and compare affected plants with healthy ones across the field.";
  if (/heading|ear emergence/i.test(stage)) return "At wheat heading, check whether ears are emerging evenly and inspect them for visible damage or disease symptoms.";
  if (/flower|anthesis/i.test(stage)) return "At flowering, inspect wheat ears and nearby leaves for symptoms and note whether flowering is uniform across affected and healthy areas.";
  if (/grain fill|grain filling/i.test(stage)) return "During grain filling, inspect the ears and flag leaves, and compare grain development and leaf changes in several parts of the field.";
  return stageCheck(stage);
}

function stageCheck(stage: string) {
  if (/not sure|unknown|unsure/i.test(stage)) return "Growth stage is uncertain, so compare the plant with a healthy one and use visible signs such as new leaves, flowering, or developing fruit/grain to identify it before making a stage-specific change.";
  if (/nursery|seedling|germinat|emergence/i.test(stage)) return "At the nursery/seedling stage, compare emergence and seedling vigour across several spots; check for gaps, damaged stems, and uneven moisture.";
  if (/transplant|establish|establishment/i.test(stage)) return "At establishment, check plant survival and gaps across the field, then inspect roots and soil moisture around affected and healthy plants.";
  if (/vegetative|tiller|branch|leaf growth/i.test(stage)) return "At vegetative growth, compare new growth and plant-to-plant differences; note whether the symptom is appearing on new or older growth.";
  if (/flower|bloom|panicle initiation|tassel|silk/i.test(stage)) return "At flowering, record whether flowers or panicles are affected and check for visible stress or damage before changing inputs.";
  if (/fruit|pod|grain fill|boll development|bunch development/i.test(stage)) return "During fruit, pod, or grain development, inspect developing structures as well as leaves and note whether the issue is reducing their formation or filling.";
  if (/matur|harvest|ripen/i.test(stage)) return "Near maturity, compare representative plants from different parts of the field and use crop-specific maturity signs rather than calendar days alone.";
  if (/land prep|preparation|before sowing|pre-sowing/i.test(stage)) return "Before sowing, check field drainage and seedbed condition, and use a soil test or local crop calendar to guide input and planting decisions.";
  return `At the ${stage} stage, record whether the symptom is on new growth, older growth, or reproductive parts, and compare affected plants with healthy ones.`;
}

function makeContext(context: FarmContext) {
  const crop = context.crop?.trim();
  const location = context.location?.trim();
  const stage = context.stage?.trim();
  const profile = crop ? cropParts.find((item) => item.matches.test(crop)) : undefined;
  const cropLabel = profile?.name || crop;
  const contextSummary = [cropLabel && `Crop: ${cropLabel}`, location && `Location: ${location}`, stage && `Growth stage: ${stage}`].filter(Boolean).join(" · ");
  const locationNote = location
    ? `Regional conditions for ${location} can change the right timing. This app does not fetch a live local forecast or district bulletin, so check the current local agricultural advisory before changing irrigation or applying inputs.`
    : "Add your village and district to make it easier to find the relevant local advisory.";
  const looksLikeIndia = /india|tamil nadu|andhra|telangana|karnataka|kerala|maharashtra|odisha|punjab|haryana|uttar pradesh|madhya pradesh|rajasthan|bihar|west bengal|assam|gujarat|thanjavur|chennai|coimbatore|இந்தியா|தமிழ்நாடு|ஆந்திர|தெலுங்கானா|கர்நாடகா|கேரளா|மகாராஷ்டிரா|பஞ்சாப்|அரியானா|தஞ்சாவூர்|சென்னை|கோயம்புத்தூர்/i.test(location || "");
  const isSugarcane = profile?.name === "sugarcane";
  const isWheat = profile?.name === "wheat";
  const sources = [
    ...(isSugarcane ? [{ label: "Sugarcane botanical overview · Wikipedia", url: "https://en.wikipedia.org/wiki/Sugarcane" }] : []),
    ...(isWheat ? [{ label: "Wheat overview · Wikipedia", url: "https://en.wikipedia.org/wiki/Wheat" }] : []),
    ...(isSugarcane && /tamil nadu|thanjavur|coimbatore|erode|salem|tiruchirappalli|cuddalore/i.test(location || "") ? [{ label: "Tamil Nadu Agricultural University · Sugarcane guide", url: "https://agritech.tnau.ac.in/agriculture/sugarcrops_sugarcane.html" }] : []),
    ...(looksLikeIndia ? [{ label: "India Meteorological Department · district and block agromet advisories", url: "https://mausam.imd.gov.in/responsive/agromet_adv_ser_block_current_en.php" }] : []),
  ];
  const cropNote = isSugarcane
    ? "Sugarcane is a perennial grass with jointed stalks; sucrose accumulates in the stalk internodes. Variety, climate, soil, and harvest timing all affect cultivation."
    : isWheat
      ? "Wheat is a cereal grass with jointed stems, narrow leaves, and a grain-bearing flower head called an ear. Check tillers, the newest leaves, stems, and ears according to the crop stage."
      : undefined;
  return {
    cropLabel,
    contextSummary: contextSummary || "Farm context not provided",
    locationNote,
    cropStep: profile ? `For ${profile.name}, inspect ${profile.parts}.` : crop ? `For ${crop}, inspect the affected plant parts at several spots and compare them with healthy plants.` : "",
    stageStep: stage ? isSugarcane ? sugarcaneStageCheck(stage) : isWheat ? wheatStageCheck(stage) : stageCheck(stage) : "",
    cropNote,
    sources,
  };
}

function getGuidanceEnglish(question: string, context: FarmContext): Guidance {
  const rule = rules.find((candidate) => candidate.matches.test(question));
  const crop = context.crop?.trim();
  const farm = makeContext(context);
  const looksLikeIndia = /india|tamil nadu|andhra|telangana|karnataka|kerala|maharashtra|odisha|punjab|haryana|uttar pradesh|madhya pradesh|rajasthan|bihar|west bengal|assam|gujarat|thanjavur|chennai|coimbatore|இந்தியா|தமிழ்நாடு|ஆந்திர|தெலுங்கானா|கர்நாடகா|கேரளா|மகாராஷ்டிரா|பஞ்சாப்|அரியானா|தஞ்சாவூர்|சென்னை|கோயம்புத்தூர்/i.test(context.location || "");
  if (looksLikeIndia && /kharif|monsoon crop|monsoon season|காரீஃப்|பருவமழை/i.test(question)) {
    const source = { label: "Kharif crop overview · Wikipedia", url: "https://en.wikipedia.org/wiki/Kharif_crop" };
    const sources = [...farm.sources, ...(farm.sources.some((item) => item.url === source.url) ? [] : [source])];
    return {
      topic: "Kharif season context",
      answer: `Kharif crops are associated with the monsoon season, but sowing and harvest timing vary by crop and region. Rainfall timing and amount also vary, so use the local crop calendar and current district advisory for decisions${crop ? ` about ${crop}` : ""}. This app does not fetch live rainfall or local crop-calendar data.`,
      steps: [farm.cropStep, farm.stageStep, "Check the crop-specific sowing window for your district with the local agriculture department or KVK.", "Use the current IMD district advisory and field soil moisture when planning work."].filter(Boolean),
      followUp: "Which crop and district are you planning for, and are you asking about sowing, rainfall, or harvest timing?",
      contextSummary: farm.contextSummary,
      locationNote: farm.locationNote,
      cropNote: farm.cropNote,
      sources,
    };
  }
  if (rule) return {
    topic: rule.topic,
    answer: `${rule.answer(farm.cropLabel || crop || "")}${farm.cropNote ? ` ${farm.cropNote}` : ""}${farm.contextSummary !== "Farm context not provided" ? ` I’ve tailored these checks to the details you gave: ${farm.contextSummary}.` : ""}`,
    steps: [farm.cropStep, farm.stageStep, ...rule.steps].filter(Boolean),
    followUp: rule.followUp,
    contextSummary: farm.contextSummary,
    locationNote: farm.locationNote,
    cropNote: farm.cropNote,
    sources: farm.sources,
  };

  if (farm.cropNote && /what is|tell me about|describe|characteristic|how does .*grow/i.test(question)) return {
    topic: `${farm.cropLabel || crop} growing context`,
    answer: farm.cropNote,
    steps: [farm.stageStep, farm.cropStep].filter(Boolean),
    followUp: `Which ${farm.cropLabel || crop} variety and growth stage are you asking about?`,
    contextSummary: farm.contextSummary,
    locationNote: farm.locationNote,
    cropNote: farm.cropNote,
    sources: farm.sources,
  };

  const cropDetail = crop ? ` for ${crop}` : "";
  return {
    topic: "Let’s narrow this down",
    answer: `I don’t have enough detail to give reliable guidance${cropDetail}. I’ve considered the crop, location, and growth stage you provided, but need the actual symptom before suggesting focused checks. I won’t guess a treatment.`,
    steps: [farm.cropStep, farm.stageStep, "Describe the visible symptom and which plant parts are affected.", "Check how many plants are affected and whether the problem is spreading.", "Note recent weather, soil moisture, and any fertilizer or spray changes."].filter(Boolean),
    followUp: "What crop is this, what exactly are you seeing, and when did it start?",
    contextSummary: farm.contextSummary,
    locationNote: farm.locationNote,
    cropNote: farm.cropNote,
    sources: farm.sources,
  };
}

const cropTamil: Record<string, string> = { rice: "நெல்", wheat: "கோதுமை", sugarcane: "கரும்பு", tomato: "தக்காளி", maize: "மக்காச்சோளம்", cotton: "பருத்தி", banana: "வாழை", groundnut: "நிலக்கடலை", coconut: "தென்னை" };
const topicTamil: Record<string, string> = {
  "Pesticide and spray safety": "பூச்சிக்கொல்லி மற்றும் தெளிப்பு பாதுகாப்பு", "Water and irrigation": "நீர் மற்றும் பாசனம்", "Yellow leaves and plant nutrition": "இலை மஞ்சளாதல் மற்றும் தாவர ஊட்டச்சத்து", "Leaf spots and possible disease": "இலைப் புள்ளிகள் மற்றும் சாத்தியமான நோய்", "Pests and insects": "பூச்சிகள்", "Soil health": "மண் ஆரோக்கியம்", "Seed selection and germination": "விதைத் தேர்வு மற்றும் முளைப்பு", "Weather and field planning": "வானிலை மற்றும் வயல் திட்டமிடல்", "Harvest timing": "அறுவடை நேரம்", "Kharif season context": "காரீஃப் பருவத் தகவல்", "Let’s narrow this down": "மேலும் விவரமாகக் கண்டறிவோம்",
};

function tamilStage(crop: string, stage: string) {
  const name = cropTamil[crop] || crop || "பயிர்";
  if (/not sure|unknown|unsure|தெரியவில்லை/i.test(stage)) return "வளர்ச்சி நிலை உறுதியாகத் தெரியவில்லை. ஆரோக்கியமான செடியுடன் ஒப்பிட்டு, புதிய இலைகள், பூத்தல் அல்லது காய்/தானிய வளர்ச்சி போன்ற அறிகுறிகளைக் கவனியுங்கள்.";
  if (crop === "sugarcane" && /tiller|தூர்/i.test(stage)) return "கரும்பில் தூர்கள் உருவாகும் நிலையில், பல வரிசைகளில் தூர் எண்ணிக்கையையும் வளர்ச்சியையும் ஒப்பிட்டு, இடைவெளி, களைகள், மண்ணின் ஈரப்பதம் ஆகியவற்றைக் கவனியுங்கள்.";
  if (crop === "sugarcane" && /grand growth|elongat|stem growth|தண்டு வளர்ச்சி/i.test(stage)) return "கரும்பின் தண்டு நீளும் வளர்ச்சி நிலையில், புதிய இலைகள், தண்டுகள் மற்றும் கணுவிடைப் பகுதிகளைப் பாதிக்கப்பட்ட மற்றும் ஆரோக்கியமான இடங்களில் ஒப்பிடுங்கள்.";
  if (crop === "sugarcane" && /matur|harvest|ripen|முதிர்|அறுவடை/i.test(stage)) return "கரும்பு முதிர்ச்சி மற்றும் அறுவடை நேரம் ரகம் மற்றும் உள்ளூர் சூழலைப் பொறுத்தது. பல பகுதிகளில் உள்ள கரும்புகளை மதிப்பிட்டு, உள்ளூர் வேளாண் பரிந்துரையைப் பின்பற்றுங்கள்.";
  if (crop === "wheat" && /tiller|தூர்/i.test(stage)) return "கோதுமையில் தூர்கள் உருவாகும் நிலையில், தூர் எண்ணிக்கை மற்றும் வளர்ச்சியை ஒப்பிட்டு, வயலில் இடைவெளி, களைகள், ஈரப்பத மாறுபாடுகளைக் கவனியுங்கள்.";
  if (crop === "wheat" && /grain fill|grain filling|தானிய நிரப்பு/i.test(stage)) return "கோதுமை தானியம் நிரம்பும் நிலையில், கதிர்களையும் கொடியிலையையும் ஆய்ந்து, வயலின் பல இடங்களில் தானிய வளர்ச்சியை ஒப்பிடுங்கள்.";
  if (/nursery|seedling|germinat|emergence|நாற்று|முளை/i.test(stage)) return `${name} நாற்று அல்லது முளைப்பு நிலையில், பல இடங்களில் முளைப்பு மற்றும் நாற்று வளர்ச்சியை ஒப்பிட்டு, இடைவெளி, சேதமடைந்த தண்டு, ஈரப்பதத்தைப் பாருங்கள்.`;
  if (/transplant|establish|நடவு/i.test(stage)) return `${name} நிலைபெறும் போது, வயலின் பல பகுதிகளில் செடிகள் உயிருடன் உள்ளனவா, இடைவெளிகள் உள்ளனவா, வேர்ப்பகுதி ஈரப்பதம் எப்படி உள்ளது எனப் பாருங்கள்.`;
  if (/flower|bloom|panicle|பூக்கும்/i.test(stage)) return `${name} பூக்கும் நிலையில், பூக்கள் அல்லது கதிர்களைப் பாதிப்பு உள்ளதா எனப் பார்த்து, உள்ளீடுகளை மாற்றுவதற்கு முன் அறிகுறிகளைப் பதிவு செய்யுங்கள்.`;
  if (/fruit|pod|grain fill|boll|காய்|தானியம்/i.test(stage)) return `${name} காய் அல்லது தானியம் வளரும் நிலையில், இலைகளுடன் வளரும் காய்/தானியத்தையும் ஆய்ந்து, அதன் உருவாக்கம் அல்லது நிரப்புதலில் பாதிப்பு உள்ளதா கவனியுங்கள்.`;
  return `${name} பயிரின் ${stage} நிலையில், புதிய வளர்ச்சி, பழைய இலைகள் அல்லது இனப்பெருக்கப் பகுதிகளில் அறிகுறி உள்ளதா பதிவு செய்து, ஆரோக்கியமான செடிகளுடன் ஒப்பிடுங்கள்.`;
}

function localizeGuidance(guidance: Guidance, context: FarmContext): Guidance {
  const crop = context.crop?.trim() || "";
  const profile = cropParts.find((item) => item.matches.test(crop));
  const cropName = profile ? cropTamil[profile.name] || profile.name : crop;
  const stage = context.stage?.trim() || "";
  const location = context.location?.trim() || "";
  const locationText = location ? `${location} பகுதியில் உள்ள சூழல் சரியான நேரத்தை மாற்றக்கூடும். இந்தச் செயலி நேரடி உள்ளூர் வானிலை அல்லது மாவட்ட அறிவிப்பைப் பெறாது; நீர்ப்பாசனம் அல்லது இடுபொருட்களை மாற்றுவதற்கு முன் தற்போதைய உள்ளூர் வேளாண் அறிவிப்பைப் பார்க்கவும்.` : "உள்ளூர் அறிவிப்பைக் கண்டறிய உங்கள் கிராமம் மற்றும் மாவட்டத்தைச் சேர்க்கவும்.";
  const contextSummary = [cropName && `பயிர்: ${cropName}`, location && `இடம்: ${location}`, stage && `வளர்ச்சி நிலை: ${stage}`].filter(Boolean).join(" · ") || "பண்ணை விவரங்கள் வழங்கப்படவில்லை";
  const topic = guidance.topic.endsWith("growing context") ? `${cropName} வளர்ச்சி தகவல்` : topicTamil[guidance.topic] || guidance.topic;
  if (/kharif|monsoon crop|monsoon season|காரீஃப்|பருவமழை/i.test(guidance.answer)) {
    return { ...guidance, topic, answer: `காரீஃப் பயிர்கள் பருவமழைக் காலத்துடன் தொடர்புடையவை. ஆனால் விதைப்பு மற்றும் அறுவடை நேரம் பயிர், பகுதி ஆகியவற்றைப் பொறுத்து மாறும். மழையின் நேரமும் அளவும் மாறக்கூடும்; ${cropName ? `${cropName} பயிருக்காக ` : ""}உள்ளூர் பயிர் கால அட்டவணை மற்றும் தற்போதைய மாவட்ட அறிவிப்பைப் பின்பற்றுங்கள். இந்தச் செயலி நேரடி மழைத் தரவு அல்லது உள்ளூர் பயிர் கால அட்டவணையைப் பெறாது.`, steps: [profile ? `${cropName} பயிரில் ${profile.name === "wheat" ? "தூர்கள், கொடியிலைகள், கதிர்கள்" : "இலைகள் மற்றும் வளர்ச்சி பகுதிகள்"} ஆகியவற்றைப் பாருங்கள்.` : "", stage ? tamilStage(profile?.name || "", stage) : "", "உங்கள் மாவட்டத்திற்கான பயிர்-சார் விதைப்பு காலத்தை உள்ளூர் வேளாண் அலுவலகம் அல்லது KVK-யிடம் சரிபார்க்கவும்.", "வேளாண் பணிகளைத் திட்டமிட தற்போதைய IMD மாவட்ட அறிவிப்பையும் வயல் மண்ணின் ஈரப்பதத்தையும் பார்க்கவும்."].filter(Boolean), followUp: "எந்தப் பயிர் மற்றும் மாவட்டம்? விதைப்பு, மழை அல்லது அறுவடை நேரம் பற்றி கேட்கிறீர்களா?", contextSummary, locationNote: locationText };
  }
  const topicInfo: Record<string, { answer: string; steps: string[]; followUp: string }> = {
    "Pesticide and spray safety": { answer: `${cropName ? `${cropName} பயிரில் ` : ""}பூச்சி, நோய் அல்லது களையை முதலில் சரியாக அடையாளம் காணுங்கள். தவறான மருந்து அல்லது அளவு பயிரையும் மனிதர்களையும் பயனுள்ள பூச்சிகளையும் பாதிக்கலாம். இந்த விவரத்தின் அடிப்படையில் பாதுகாப்பான மருந்தளவை நான் பரிந்துரைக்க முடியாது.`, steps: ["பாதிக்கப்பட்ட மற்றும் ஆரோக்கியமான செடிகளைப் பல இடங்களில் ஆய்ந்து, இலைகளின் அடிப்புறம் மற்றும் தண்டுகளையும் பாருங்கள்.", "அருகுப் படம் மற்றும் முழுச் செடியின் படத்தை எடுத்து, வளர்ச்சி நிலை மற்றும் சமீபத்திய தெளிப்புகளைப் பதிவு செய்யுங்கள்.", "பூச்சி அல்லது நோயை உள்ளூர் வேளாண் அலுவலர் அல்லது KVK-யிடம் உறுதிப்படுத்துங்கள். பரிந்துரைக்கப்பட்டால், தயாரிப்பு லேபிளையும் பாதுகாப்பு வழிமுறைகளையும் பின்பற்றுங்கள்."], followUp: "எந்தப் பயிர்? என்ன அறிகுறி தெரிகிறது? ஏற்கனவே ஏதேனும் மருந்து தெளித்தீர்களா?" },
    "Water and irrigation": { answer: `${cropName ? `${cropName} பயிரின் ` : ""}வேர் பகுதியில் மண்ணின் ஈரப்பதத்தை முதலில் சரிபாருங்கள்; மேற்பரப்பை மட்டும் நம்ப வேண்டாம். நீர் அதிகமோ குறைவோ இருந்தால் பயிர் பாதிக்கப்படும். சரியான பாசன இடைவெளி மண், பயிர் மற்றும் வளர்ச்சி நிலையைப் பொறுத்தது.`, steps: ["வயலின் ஒன்றுக்கு மேற்பட்ட இடங்களில் மேற்பரப்புக்குக் கீழே மண்ணின் ஈரத்தைச் சரிபாருங்கள்.", "தேங்கிய நீர், அடைபட்ட வடிகால் அல்லது குளிரான நேரத்திலும் வாடும் செடிகள் உள்ளனவா பாருங்கள்.", "உள்ளூர் பயிர் வழிகாட்டுதலையும் வடிகாலையும் பார்த்த பிறகே பாசனத்தை மாற்றுங்கள்."], followUp: "எந்தப் பயிர் மற்றும் வளர்ச்சி நிலை? மண் உலர்ந்ததா, ஈரமாக உள்ளதா அல்லது நீர் தேங்கியுள்ளதா?" },
    "Yellow leaves and plant nutrition": { answer: `${cropName ? `${cropName} பயிரில் ` : ""}இலை மஞ்சளாதல் ஒரு அறிகுறி மட்டுமே; அது நீர் அழுத்தம், ஊட்டச்சத்து, வேர் சேதம், பூச்சி அல்லது நோயால் ஏற்படலாம். எந்த இலை முதலில் மாறியது, மஞ்சள் பரவும் வடிவம் ஆகியவற்றைக் கவனியுங்கள். சரிபார்க்கும் முன் உரம் சேர்க்க வேண்டாம்.`, steps: ["பழைய இலைகளையும் புதிய இலைகளையும் ஒப்பிட்டு, நரம்புகளுக்கு இடையில், ஓரங்களில் அல்லது திட்டுகளாக மாறியுள்ளதா பாருங்கள்.", "மண் ஈரப்பதத்தைச் சரிபார்த்து, வேர்கள், இலை அடிப்புறம், அருகிலுள்ள செடிகளில் பூச்சி அல்லது புள்ளிகள் உள்ளனவா ஆயுங்கள்.", "பிரச்சினை பரவினால், உரத்தை மாற்றும் முன் மண்/தாவரப் பரிசோதனை செய்து உள்ளூர் வேளாண் அலுவலரிடம் ஆலோசனை பெறுங்கள்."], followUp: "முதலில் பழைய இலைகளா அல்லது புதிய இலைகளா மஞ்சளானது? மாற்றம் சீராக உள்ளதா அல்லது திட்டுத்திட்டாக உள்ளதா?" },
    "Leaf spots and possible disease": { answer: `${cropName ? `${cropName} பயிரில் ` : ""}புள்ளிகள் நோய், பூச்சி அல்லது உடல் சேதம் போன்ற பல காரணங்களால் வரலாம். அவற்றின் வடிவம், இடம், பரவும் வேகம் முக்கியம்; குறுகிய விளக்கத்தால் காரணத்தை உறுதியாகக் கூற முடியாது.`, steps: ["பாதிக்கப்பட்ட இலையின் இருபுறத்தையும், ஒப்பிட ஆரோக்கியமான இலையையும் புகைப்படம் எடுங்கள்.", "புள்ளிகளுக்கு மஞ்சள் வளையம், தூள், வட்ட வளையங்கள் அல்லது நீர் நனைந்த விளிம்பு உள்ளதா பாருங்கள்; மழை மற்றும் பரவலைப் பதிவு செய்யுங்கள்.", "காரணம் உறுதியாகும் வரை தெளிக்க வேண்டாம். பாதிக்கப்பட்ட தாவரப் பகுதிகளை கையாள உள்ளூர் ஆலோசனையைப் பின்பற்றுங்கள்."], followUp: "எந்தப் பயிர்? செடியின் எந்தப் பகுதியில் புள்ளிகள் தொடங்கின? எவ்வளவு வேகமாகப் பரவுகின்றன?" },
    "Pests and insects": { answer: `${cropName ? `${cropName} பயிரை ` : ""}பாதிப்பது எது என்பதை முதலில் உறுதிப்படுத்துங்கள். இலைத் துளை, சுருட்டல், மஞ்சளாதல் பல காரணங்களால் வரலாம்; வயலில் உள்ள சில பூச்சிகள் பயனுள்ளவையாகவும் இருக்கலாம்.`, steps: ["பல செடிகளில் இலை அடிப்புறம், புதிய தளிர்கள், தண்டுகள் மற்றும் சேதத்தின் விளிம்புகளைப் பாருங்கள்.", "பூச்சி, முட்டை, வலை, கழிவு அல்லது புதிய கடித்த சேதம் உள்ளதா கவனித்து, எத்தனை செடிகள் பாதிக்கப்பட்டுள்ளன பதிவு செய்யுங்கள்.", "பூச்சிக்கொல்லி பயன்படுத்தும் முன் தெளிவான படத்துடன் உள்ளூர் வேளாண் நிபுணரிடம் அடையாளம் காணுங்கள்."], followUp: "பூச்சி அல்லது சேதத்தை விவரிக்கவோ புகைப்படம் பகிரவோ முடியுமா? எத்தனை செடிகள் பாதிக்கப்பட்டுள்ளன?" },
    "Soil health": { answer: `${cropName ? `${cropName} பயிருக்கான ` : ""}உள்ளீடுகளைத் திட்டமிட மண் பரிசோதனை சிறந்த தொடக்கம். மண் வகை, pH, உப்புத்தன்மை, வடிகால், ஊட்டச்சத்துகள் வயலுக்குள் மாறலாம்; பார்வையால் மட்டும் திருத்தம் தேவை என்பதைத் தீர்மானிக்க முடியாது.`, steps: ["உள்ளூர் வேளாண் துறையின் வழிமுறையின்படி பிரதிநிதித்துவ மண் மாதிரியை எடுங்கள்.", "தோற்றத்தில் வேறுபடும் வயல் பகுதிகளின் மாதிரிகளைப் பிரித்து, இடத்தைக் குறியிடுங்கள்.", "ஆய்வக முடிவுகள் மற்றும் உள்ளூர் பரிந்துரைகளைப் பயன்படுத்துங்கள்; பரிசோதனை இல்லாமல் திருத்தப் பொருட்களை இட வேண்டாம்."], followUp: "எந்தப் பயிர்? சமீபத்திய மண் பரிசோதனை முடிவு அல்லது குறிப்பிட்ட மண் அறிகுறி உள்ளதா?" },
    "Seed selection and germination": { answer: `${cropName ? `${cropName} பயிருக்கு ` : ""}உங்கள் பகுதி மற்றும் பருவத்திற்குப் பொருத்தமான விதையைத் தேர்ந்தெடுங்கள். உள்ளூரில் பரிந்துரைக்கப்பட்ட ரகம், நம்பகமான விதை மூலம், சரியான விதைப்பு காலம் ஆகியவை முக்கியம்.`, steps: ["உங்கள் வேளாண் துறை அல்லது KVK-யிடம் ரகத்தின் பருவம், கால அளவு, உள்ளூர் பொருத்தத்தைச் சரிபாருங்கள்.", "லேபிள் கொண்ட விதையை நம்பகமான இடத்தில் வாங்கி, தொகுதி மற்றும் காலாவதி விவரங்களைப் பாருங்கள்.", "விதை கையில் இருந்தால், முழுவதும் விதைப்பதற்கு முன் சிறிய அளவில் முளைப்புத் திறனைச் சோதியுங்கள்."], followUp: "எந்தப் பயிர், மாவட்டம், விதைப்பு பருவம்?" },
    "Weather and field planning": { answer: "வயல் பணிகளைத் திட்டமிட தற்போதைய உள்ளூர் முன்னறிவிப்பையும் வயல் நிலைமையையும் பயன்படுத்துங்கள். அருகிலுள்ள பகுதிகளிலும் மழை மாறுபடலாம்; இந்தச் செயலியில் நேரடி வானிலைத் தரவு இல்லை.", steps: ["உங்கள் மாவட்டத்திற்கான சமீபத்திய IMD அல்லது உள்ளூர் வேளாண் அறிவிப்பைப் பாருங்கள்.", "பாசனம் அல்லது தெளிப்புக்கு முன் முன்னறிவிப்பை மண் ஈரப்பதம், வடிகால், பயிர் வளர்ச்சி நிலை ஆகியவற்றுடன் ஒப்பிடுங்கள்.", "பலத்த காற்று அல்லது விரைவில் மழை எதிர்பார்க்கப்படும் போது தெளிக்க வேண்டாம்; மருந்து லேபிள் மற்றும் பாதுகாப்பு வழிமுறைகளைப் பின்பற்றுங்கள்."], followUp: "எந்த கிராமம் அல்லது மாவட்டம் மற்றும் பயிர் குறித்து அறிவுரை தேவை?" },
    "Harvest timing": { answer: `${cropName ? `${cropName} பயிரின் ` : ""}அறுவடை நேரம் ரகம், பயன்பாடு, முதிர்ச்சி அறிகுறிகளைப் பொறுத்தது. நாட்களை மட்டும் கணக்கிடாமல், பயிருக்கு ஏற்ற முதிர்ச்சி அறிகுறிகளைச் சரிபாருங்கள்.`, steps: ["உங்கள் பயிர் மற்றும் ரகத்திற்கான நிறம், உறுதி அல்லது தானிய ஈரப்பதம் போன்ற முதிர்ச்சி அறிகுறிகளைப் பாருங்கள்.", "ஒரு செடியை மட்டும் நம்பாமல், வயலின் பல பகுதிகளில் உள்ள செடிகளை ஆயுங்கள்.", "உலர்த்தல், போக்குவரத்து, சேமிப்பு இழப்பைக் குறைக்க உள்ளூர் முன்னறிவிப்பையும் அறுவடை ஆலோசனையையும் சரிபாருங்கள்."], followUp: "எந்தப் பயிர் மற்றும் ரகம்? என்ன முதிர்ச்சி அறிகுறிகள் தெரிகின்றன?" },
  };
  const localized = topicInfo[guidance.topic];
  if (localized) return { ...guidance, topic, answer: localized.answer, steps: [...(profile ? [`${cropName} பயிரில் ${profile.name === "wheat" ? "தூர்கள், கொடியிலைகள் மற்றும் கதிர்கள்" : profile.name === "sugarcane" ? "இலைகள், இலை உறைகள் மற்றும் கணுவிடைப் பகுதிகள்" : "இலைகள் மற்றும் தண்டுகள்"} ஆகியவற்றைப் பல இடங்களில் ஆயுங்கள்.`] : []), ...(stage ? [tamilStage(profile?.name || "", stage)] : []), ...localized.steps], followUp: localized.followUp, contextSummary, locationNote: locationText };
  if (guidance.topic.endsWith("growing context")) {
    const note = profile?.name === "wheat" ? "கோதுமை என்பது தானியத்திற்காகப் பயிரிடப்படும் புல்வகை. இதன் தண்டு கணுக்களுடன் இருக்கும்; குறுகிய இலைகளும் தானியம் தரும் கதிரும் காணப்படும். பயிர் நிலைக்கேற்ப தூர்கள், புதிய இலைகள், தண்டுகள், கதிர்களைச் சரிபாருங்கள்." : "கரும்பு கணுக்கள் கொண்ட தண்டுகளையுடைய நீண்டகால புல்வகைப் பயிர். சுக்ரோஸ் தண்டின் கணுவிடைப் பகுதிகளில் சேமிக்கப்படுகிறது. ரகம், காலநிலை, மண் மற்றும் அறுவடை நேரம் பயிரிடுதலைப் பாதிக்கின்றன.";
    return { ...guidance, topic, answer: note, steps: [stage ? tamilStage(profile?.name || "", stage) : "", profile ? `${cropName} பயிரின் இலைகள், தண்டுகள் மற்றும் வளர்ச்சி பகுதிகளைப் பாருங்கள்.` : ""].filter(Boolean), followUp: `${cropName} பயிரின் எந்த ரகம் மற்றும் வளர்ச்சி நிலை பற்றி கேட்கிறீர்கள்?`, contextSummary, locationNote: locationText };
  }
  return { ...guidance, topic, answer: `${cropName ? `${cropName} பயிருக்காக ` : ""}நம்பகமான வழிகாட்டுதலை வழங்க உங்கள் கேள்வியில் இன்னும் விவரங்கள் தேவை. பயிர், இடம் மற்றும் வளர்ச்சி நிலையை கருத்தில் கொண்டுள்ளேன்; அறிகுறியை விவரித்தால் அடுத்ததாக எதைச் சரிபார்க்க வேண்டும் எனக் கூறுவேன். உறுதிப்படுத்தாத சிகிச்சையை ஊகித்துச் சொல்லமாட்டேன்.`, steps: [...(profile ? [`${cropName} பயிரின் இலைகள் மற்றும் பாதிக்கப்பட்ட பகுதிகளைப் பல இடங்களில் ஆய்ந்து, ஆரோக்கியமான செடிகளுடன் ஒப்பிடுங்கள்.`] : []), ...(stage ? [tamilStage(profile?.name || "", stage)] : []), "காணப்படும் அறிகுறியையும் பாதிக்கப்பட்ட தாவரப் பகுதிகளையும் விவரியுங்கள்.", "எத்தனை செடிகள் பாதிக்கப்பட்டுள்ளன, பிரச்சினை பரவுகிறதா எனப் பாருங்கள்.", "சமீபத்திய வானிலை, மண்ணின் ஈரப்பதம், உரம் அல்லது தெளிப்பு மாற்றங்களைப் பதிவு செய்யுங்கள்."], followUp: "எந்தப் பயிர்? சரியாக என்ன அறிகுறி தெரிகிறது, அது எப்போது தொடங்கியது?", contextSummary, locationNote: locationText };
}

export function getGuidance(question: string, context: FarmContext, language: "en" | "ta" = "en"): Guidance {
  const guidance = getGuidanceEnglish(question, context);
  return language === "ta" ? localizeGuidance(guidance, context) : guidance;
}
