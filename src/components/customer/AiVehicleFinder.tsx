import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MaterialType, VehicleType } from '../../types';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Truck, 
  HelpCircle, 
  ArrowRight, 
  Layers, 
  Scale, 
  RotateCcw,
  Zap,
  Info
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

export const AiVehicleFinder: React.FC = () => {
  const { vehicles, startBookingFlow, setActiveTab } = useApp();

  const [promptInput, setPromptInput] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>('Sand');
  const [quantityInput, setQuantityInput] = useState('5 Tons');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    recommendedCategory: VehicleType;
    recommendedVehicleName: string;
    reason: string;
    payloadAnalysis: string;
    estimatedTrips: number;
    estimatedCostRange: string;
    alternativeOptions: { category: VehicleType; reason: string }[];
    matchingVehicleId?: string;
  } | null>(null);

  const materials: MaterialType[] = [
    'Sand',
    'Bricks',
    'Gravel',
    'Cement',
    'Construction Waste',
    'Soil',
    'Steel & Rebar',
    'Other'
  ];

  const presets = [
    {
      title: 'Move 5 tons of river sand from Vijayawada to Gannavaram',
      material: 'Sand' as MaterialType,
      qty: '5 Tons'
    },
    {
      title: 'Transport 8,000 clay bricks for 2-floor house masonry',
      material: 'Bricks' as MaterialType,
      qty: '8,000 Bricks (~16 Tons)'
    },
    {
      title: 'Clear 15 tons of broken concrete and foundation rubble from demolition',
      material: 'Construction Waste' as MaterialType,
      qty: '15 Tons'
    },
    {
      title: 'Deliver 50 bags of cement and tile boxes into congested downtown street',
      material: 'Cement' as MaterialType,
      qty: '2.5 Tons (50 Bags)'
    }
  ];

  const handleRunAi = async (overridePrompt?: string, overrideMat?: MaterialType, overrideQty?: string) => {
    const input = overridePrompt || promptInput;
    const mat = overrideMat || selectedMaterial;
    const qty = overrideQty || quantityInput;

    if (!input.trim()) return;

    setIsLoading(true);

    try {
      // Try calling Gemini API if env key is available
      const apiKey = process.env.GEMINI_API_KEY || (window as any).GEMINI_API_KEY;
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are an expert civil engineering logistics dispatch advisor for BuildHaul India.
The contractor provided this site requirement:
Job description: "${input}"
Material: "${mat}"
Approximate Quantity: "${qty}"

Available vehicle categories in our fleet:
1. Heavy Tipper Truck (10 to 16 Ton payload)
2. Heavy Duty Tractor (3 to 5 Ton payload trailer)
3. Mini Truck Carrier (1 to 1.5 Ton payload like Tata Ace)
4. Wheel Loader (Bulk stockpile loading & muck excavation)

Provide your recommendation strictly in the following JSON format without markdown ticks:
{
  "recommendedCategory": "Heavy Tipper Truck" | "Heavy Duty Tractor" | "Mini Truck Carrier" | "Wheel Loader",
  "recommendedVehicleName": "Short descriptive model name",
  "reason": "1-2 concise professional sentences explaining why this category is best suited for this payload and distance",
  "payloadAnalysis": "Precise payload math e.g. material density and capacity suitability",
  "estimatedTrips": 1,
  "estimatedCostRange": "₹X,XXX - ₹Y,YYY per day",
  "alternativeOptions": [
    { "category": "Heavy Duty Tractor", "reason": "Alternative if access roads are unpaved or mud-prone" }
  ]
}`
        });

        const text = response.text || '';
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        // Find matching vehicle from fleet
        const match = vehicles.find(v => v.type === parsed.recommendedCategory) || vehicles[0];

        setRecommendation({
          recommendedCategory: parsed.recommendedCategory,
          recommendedVehicleName: parsed.recommendedVehicleName || match.name,
          reason: parsed.reason,
          payloadAnalysis: parsed.payloadAnalysis,
          estimatedTrips: parsed.estimatedTrips || 1,
          estimatedCostRange: parsed.estimatedCostRange || `₹${match.pricePerDay} - ₹${match.pricePerDay + 1000}/day`,
          alternativeOptions: parsed.alternativeOptions || [],
          matchingVehicleId: match.id
        });
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Gemini API call skipped or fell back to deterministic rule engine:', err);
    }

    // High quality deterministic rule engine fallback
    setTimeout(() => {
      let recCategory: VehicleType = 'Heavy Duty Tractor';
      let recName = 'Mahindra 575 DI Heavy Tractor & Trailer';
      let reason = 'Suitable for transporting materials over regional distances with versatile hydraulic tipping.';
      let payloadAnalysis = 'Safe load distribution within legal axle limits for state roads.';
      let trips = 1;
      let costRange = '₹1,800 - ₹2,500/day';
      let alternatives = [
        { category: 'Mini Truck Carrier' as VehicleType, reason: 'Faster for tight residential alleys and light loads' }
      ];

      const lowInput = input.toLowerCase();
      const lowMat = mat.toLowerCase();

      if (lowInput.includes('sand') || lowMat === 'sand' || lowInput.includes('5 ton') || lowInput.includes('10 ton') || lowInput.includes('gravel') || lowInput.includes('waste') || lowInput.includes('demolition')) {
        recCategory = 'Heavy Tipper Truck';
        recName = 'BharatBenz 2823R Heavy Tipper (14 Ton)';
        reason = `Suitable for transporting approximately ${qty} of bulk ${mat.toLowerCase()} with high-speed hydraulic bed discharge.`;
        payloadAnalysis = `${qty} of ${mat.toLowerCase()} occupies ~3.5 to 10 cubic meters. A 10-wheeler 14-ton tipper moves the entire volume in 1 trip without overloading chassis.`;
        trips = 1;
        costRange = '₹4,800 - ₹5,600/day';
        alternatives = [
          { category: 'Heavy Duty Tractor' as VehicleType, reason: 'Lower cost alternative (₹1,800/d) if jobsite has soft soil or tight turns, but requires 2 round trips.' }
        ];
      } else if (lowInput.includes('cement') || lowInput.includes('pipes') || lowInput.includes('small') || lowInput.includes('bags') || lowInput.includes('tight') || lowInput.includes('market') || lowMat === 'cement') {
        recCategory = 'Mini Truck Carrier';
        recName = 'Tata Ace Gold High Deck Mini Truck';
        reason = `Best suited for urban deliveries, narrow residential lanes, and fast payload discharge up to 1.2 tons.`;
        payloadAnalysis = `High deck dimensions allow stacking up to 25–40 cement bags or packed building finishes without risking low bridge clearance.`;
        trips = 1;
        costRange = '₹1,200 - ₹1,700/day';
        alternatives = [
          { category: 'Heavy Duty Tractor' as VehicleType, reason: 'Use if delivery destination is an unpaved construction field.' }
        ];
      } else if (lowInput.includes('excavat') || lowInput.includes('dig') || lowInput.includes('loader') || lowInput.includes('leveling') || lowInput.includes('cellar')) {
        recCategory = 'Wheel Loader';
        recName = 'JCB 432ZX Heavy Wheel Loader';
        reason = `Engineered for continuous site clearing, muck scooping, stockpile transfer, and foundation trench backfilling.`;
        payloadAnalysis = `1.8 Cu.M high-breakout bucket handles up to 3.5 tons per scoop cycle, loading standard tipper trucks in under 4 minutes.`;
        trips = 1;
        costRange = '₹6,500 - ₹7,500/day';
        alternatives = [
          { category: 'Heavy Tipper Truck' as VehicleType, reason: 'Combine with Tipper for hauling material offsite to landfill.' }
        ];
      } else {
        recCategory = 'Heavy Duty Tractor';
        recName = 'Mahindra 575 DI Heavy Tractor & Trailer';
        reason = `Universal workhorse for multi-trip brick, soil, and gravel carting on unpaved site approaches.`;
        payloadAnalysis = `Reinforced 4-ton steel bed allows easy manual or tipping unloading on active site pads.`;
        trips = 2;
        costRange = '₹1,800 - ₹2,400/day';
        alternatives = [
          { category: 'Heavy Tipper Truck' as VehicleType, reason: 'Upgrade to 14-ton tipper if daily carting volume exceeds 20 tons.' }
        ];
      }

      const match = vehicles.find(v => v.type === recCategory) || vehicles[0];

      setRecommendation({
        recommendedCategory: recCategory,
        recommendedVehicleName: recName,
        reason,
        payloadAnalysis,
        estimatedTrips: trips,
        estimatedCostRange: costRange,
        alternativeOptions: alternatives,
        matchingVehicleId: match.id
      });
      setIsLoading(false);
    }, 600);
  };

  const matchedVehicle = vehicles.find(v => v.id === recommendation?.matchingVehicleId) || vehicles[0];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      
      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent Construction Fleet Sizing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Tell us what work you need to do
        </h1>

        <p className="text-sm text-neutral-400">
          Describe your site requirement in natural language. Our engineering advisor calculates material weight, transit logistics, and recommends the optimal vehicle.
        </p>
      </div>

      {/* Input Box & Material Selector */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6">
        
        {/* Natural Language Prompt */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-2">
            Job Description & Destination Route
          </label>
          <div className="relative">
            <textarea
              rows={3}
              placeholder="e.g. I need to move 5 tons of sand from Vijayawada to Gannavaram."
              value={promptInput}
              onChange={e => setPromptInput(e.target.value)}
              className="w-full p-4 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <div className="text-xs text-neutral-400 font-medium mb-2">
            Or try one of these common job requirements:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {presets.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setPromptInput(preset.title);
                  setSelectedMaterial(preset.material);
                  setQuantityInput(preset.qty);
                  handleRunAi(preset.title, preset.material, preset.qty);
                }}
                className="text-left p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 hover:border-amber-500/50 hover:bg-neutral-950 text-xs text-neutral-300 transition-colors flex items-start gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span className="truncate">{preset.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Material Selection Grid */}
        <div>
          <label className="block text-xs font-bold text-neutral-300 mb-2">
            Material Classification
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {materials.map(mat => (
              <button
                key={mat}
                type="button"
                onClick={() => setSelectedMaterial(mat)}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-colors ${
                  selectedMaterial === mat
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                }`}
              >
                {mat}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity Field */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-300 mb-1.5">
              Approximate Quantity or Volume
            </label>
            <input
              type="text"
              placeholder="e.g. 5 Tons, 3000 bricks, 2 brass"
              value={quantityInput}
              onChange={e => setQuantityInput(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              disabled={isLoading || !promptInput.trim()}
              onClick={() => handleRunAi()}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing Site Workload...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze & Recommend Machine</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* AI RECOMMENDATION RESULT CARD */}
      {recommendation && (
        <div className="mt-8 bg-neutral-900 border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>AI SITE SIZING RESULT</span>
          </div>

          {/* Recommended Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
            <div>
              <div className="text-xs text-neutral-400">Recommended Category:</div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5 mt-1">
                <Truck className="w-7 h-7 text-amber-500" />
                <span>{recommendation.recommendedCategory}</span>
              </h3>
              <p className="text-sm text-neutral-300 mt-1 font-medium">
                Target Model: <span className="text-amber-400">{recommendation.recommendedVehicleName}</span>
              </p>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-xs text-neutral-400">Estimated Rate Range:</div>
              <div className="text-xl font-black text-white font-mono">{recommendation.estimatedCostRange}</div>
              <div className="text-[11px] text-emerald-400 font-medium">
                {recommendation.estimatedTrips} Single Trip Completion
              </div>
            </div>
          </div>

          {/* Reason Section */}
          <div className="py-5 space-y-4">
            <div>
              <h4 className="text-xs font-bold text-white tracking-wider mb-1.5 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-500" />
                LOGISTICS REASONING
              </h4>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed bg-neutral-950/80 p-3.5 rounded-xl border border-neutral-800">
                {recommendation.reason}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white tracking-wider mb-1.5 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-amber-500" />
                PAYLOAD & DENSITY BREAKDOWN
              </h4>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed bg-neutral-950/80 p-3.5 rounded-xl border border-neutral-800 font-mono">
                {recommendation.payloadAnalysis}
              </p>
            </div>

            {/* Alternative Options */}
            {recommendation.alternativeOptions.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-white tracking-wider mb-2">
                  ALTERNATIVE SITE OPTIONS
                </h4>
                <div className="space-y-2">
                  {recommendation.alternativeOptions.map((alt, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-start gap-2.5 text-xs">
                      <Truck className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-white">{alt.category}: </span>
                        <span className="text-neutral-400">{alt.reason}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Direct Matching Vehicle Fleet Card & CTA */}
          <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={matchedVehicle.image}
                alt={matchedVehicle.name}
                className="w-16 h-12 rounded-lg object-cover border border-neutral-700"
              />
              <div>
                <div className="text-xs text-neutral-400">Available in Nearby Depot:</div>
                <div className="text-sm font-bold text-white">{matchedVehicle.name}</div>
                <div className="text-xs text-amber-400 font-mono">₹{matchedVehicle.pricePerDay}/day · {matchedVehicle.location}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => startBookingFlow(matchedVehicle)}
                className="flex-1 sm:flex-none px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-lg shadow-amber-500/20 whitespace-nowrap flex items-center justify-center gap-2"
              >
                <span>Book This Machine</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
