import { motion } from 'framer-motion';
import { ParliamentGrid } from '../components/ParliamentGrid';
import { ElectionInsights } from '../components/ElectionInsights';
import { useState, useRef } from 'react';
import { ArrowLeft, Map as MapIcon, BarChart2, MessageSquare, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import electionDataRaw from '../data/election-2023.json';

// Type Definitions
interface PartyStats {
    name: string;
    name_th: string;
    seats: number;
    seatsConstituency: number;
    seatsPartyList: number;
    votes: string;
    rawVotes: number;
    color: string;
    leader: string;
    slogan: string;
    slogan_th: string;
    logo: string;
}

interface BreakdownItem {
    party: string;
    name_th: string;
    votes: number;
    percent: string;
    color: string;
    logo: string;
}

interface Candidate {
    name: string;
    party: string;
    party_th: string;
    votes: number;
    color: string;
    logo: string;
}

interface District {
    id: number;
    winner: string;
    winner_th: string;
    party: string;
    color: string;
    votes: number;
    logo: string;
    top5: Candidate[];
}

interface ProvinceData {
    province: string;
    name_th?: string; // Optional if not in JSON yet, but good to have
    region: string;
    grid: { r: number; c: number };
    winner: string;
    totalVotes: string;
    color: string;
    voteBreakdown: BreakdownItem[];
    seatBreakdown: { party: string; name_th: string; seats: number; color: string; logo: string }[];
    districts: District[];
}

interface NationalData {
    totalVotes: string;
    turnout: string;
    parties: PartyStats[];
}

interface ElectionData {
    national: NationalData;
    provinces: ProvinceData[];
}

const electionData = electionDataRaw as ElectionData;

export default function ThaiElectionPage() {
    const [selectedProvince, setSelectedProvince] = useState<ProvinceData | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
    const containerRef = useRef(null);



    // Group provinces by region
    const regions = [
        ["Bangkok", electionData.provinces.filter(p => p.region === "Bangkok")],
        ["Central", electionData.provinces.filter(p => p.region === "Central")],
        ["North", electionData.provinces.filter(p => p.region === "North")],
        ["Northeast", electionData.provinces.filter(p => p.region === "Northeast")],
        ["East", electionData.provinces.filter(p => p.region === "East")],
        ["West", electionData.provinces.filter(p => p.region === "West")],
        ["South", electionData.provinces.filter(p => p.region === "South")],
    ] as [string, ProvinceData[]][];

    console.log("Election Data Loaded:", electionData.national.parties);

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white font-sans selection:bg-primary selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center mix-blend-difference">
                <Link to="/" className="flex items-center gap-2 text-[#F47524] font-bold uppercase tracking-widest hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Back to Portfolio
                </Link>
                <div className="text-sm font-mono text-gray-400">SYNTHESIZING SIAM // 2023</div>
            </nav>

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1596627622879-19816158c736?q=80&w=2070&auto=format&fit=crop"
                        alt="Democracy Monument"
                        className="w-full h-full object-cover opacity-50 grayscale"
                    />
                </div>

                <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm mb-6">
                            <BarChart2 className="w-4 h-4 text-[#F47524]" />
                            <span className="text-sm font-medium text-gray-300 uppercase tracking-wider">Data Visualization & Storytelling Showcase</span>
                        </div>

                        <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-6 leading-none">
                            Thai Election <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F47524] to-[#E30613]">2023</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light mb-10">
                            An interactive deep dive into the historic "Orange Wave" that reshaped Thailand's political landscape.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-10 left-0 right-0 flex justify-center"
                >
                    <div className="animate-bounce text-white/50">
                        <Users className="w-8 h-8" />
                    </div>
                </motion.div>
            </section>

            {/* Party Performance Section - Bar Chart */}
            <section className="py-32 bg-black relative z-10">
                <div className="container mx-auto px-4">
                    <div className="mb-20">
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 flex items-center gap-4">
                            <BarChart2 className="w-12 h-12 text-[#F47524]" />
                            National Results
                        </h2>

                        {/* Parliament Grid Summary */}
                        <div className="mb-12">
                            <ParliamentGrid parties={electionData.national.parties} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {electionData.national.parties.map((party, index) => (
                                <motion.div
                                    key={party.name}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors group"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden ${['Pheu Thai', 'Thai Sang Thai'].includes(party.name) ? 'bg-white' : 'bg-white/10'}`} style={{ color: party.color }}>
                                            {party.logo ? (
                                                <img
                                                    src={party.logo}
                                                    alt={party.name}
                                                    className="w-full h-full object-contain p-2"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                        (e.target as HTMLImageElement).parentElement!.innerText = party.name.substring(0, 1);
                                                    }}
                                                />
                                            ) : (
                                                party.name.substring(0, 1)
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="text-5xl font-black" style={{ color: party.color }}>{party.seats}</div>
                                            <div className="text-sm text-gray-500 uppercase tracking-widest">Seats</div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1">{party.name}</h3>
                                        <h4 className="text-lg text-white/60 font-thai mb-2">{party.name_th}</h4>
                                        <div className="text-sm text-gray-400 mb-1 italic">"{party.slogan}"</div>
                                        <div className="text-sm text-gray-500 font-thai mb-4">"{party.slogan_th}"</div>

                                        <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-2">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${(party.rawVotes / 40000000) * 100}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="h-full"
                                                style={{ backgroundColor: party.color }}
                                            ></motion.div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 font-mono">
                                            <span>{party.votes} Votes</span>
                                            <span>{(party.rawVotes / parseInt(electionData.national.totalVotes.replace(/,/g, '')) * 100).toFixed(1)}%</span>
                                        </div>
                                        <div className="pt-2 mt-2 border-t border-white/5">
                                            <div className="flex justify-between text-xs text-white/40">
                                                <span>Constituency: {party.seatsConstituency}</span>
                                                <span>Party List: {party.seatsPartyList}</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Insights Section */}
            <ElectionInsights
                nationalParties={electionData.national.parties}
                provinces={electionData.provinces}
            />

            {/* Digital Kingdom - Grid Map */}
            <section className="py-32 bg-black border-t border-white/10 relative">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        {/* Map Area */}
                        <div className="lg:w-2/3">
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12 flex items-center gap-4">
                                <MapIcon className="w-12 h-12 text-primary" />
                                Digital Kingdom
                            </h2>
                            <p className="text-gray-400 mb-8">Explore the results by region. Each cell represents a province.</p>

                            <div className="space-y-12">
                                {regions.map(([regionName, provinces]) => (
                                    <div key={regionName}>
                                        <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-widest border-b border-gray-800 pb-1">{regionName}</h3>
                                        <div className="space-y-4">
                                            {provinces.map((province) => (
                                                <div key={province.province}>
                                                    <div className="flex items-end gap-2 mb-2">
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase">{province.province}</h4>
                                                        <span className="text-[10px] text-gray-600 font-mono">{province.districts.length} Districts</span>
                                                    </div>
                                                    <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1">
                                                        {province.districts.map((district) => (
                                                            <motion.button
                                                                key={`${province.province}-${district.id}`}
                                                                whileHover={{ scale: 1.2, zIndex: 10 }}
                                                                onClick={() => {
                                                                    setSelectedProvince(province);
                                                                    setSelectedDistrict(district);
                                                                }}
                                                                className={`aspect-square rounded-sm relative group overflow-hidden border transition-all ${selectedDistrict?.id === district.id && selectedProvince?.province === province.province ? 'ring-2 ring-white z-10 scale-125 shadow-xl' : 'border-gray-900'} ${['Pheu Thai', 'Thai Sang Thai'].includes(district.winner) ? 'hover:border-current' : 'hover:border-white'}`}
                                                                style={{
                                                                    backgroundColor: ['Pheu Thai', 'Thai Sang Thai'].includes(district.winner) ? '#FFFFFF' : district.color,
                                                                    borderColor: ['Pheu Thai', 'Thai Sang Thai'].includes(district.winner) ? district.color : undefined,
                                                                    borderWidth: ['Pheu Thai', 'Thai Sang Thai'].includes(district.winner) ? '2px' : undefined,
                                                                    color: district.color
                                                                }}
                                                            >
                                                                <div className="absolute inset-0 flex items-center justify-center transition-opacity">
                                                                    {district.logo ? (
                                                                        <img src={district.logo} alt={district.winner} className="w-3/4 h-3/4 object-contain drop-shadow-md" />
                                                                    ) : (
                                                                        <span className={`text-[8px] font-bold drop-shadow-md ${['Pheu Thai', 'Thai Sang Thai'].includes(district.winner) ? '' : 'text-white'}`}>{district.winner.substring(0, 1)}</span>
                                                                    )}
                                                                </div>
                                                                {/* Tooltip */}
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] bg-black border border-white/20 p-2 rounded text-xs pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50">
                                                                    <div className="font-bold text-white">{province.province}</div>
                                                                    <div className="text-white">District {district.id}</div>
                                                                    <div className="text-[#F47524] mt-1">{district.winner}</div>
                                                                </div>
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Detail Panel - Sticky */}
                        <div className="lg:w-1/3 sticky top-24 h-fit">
                            <motion.div
                                layout
                                className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl"
                            >
                                {selectedProvince ? (
                                    <motion.div
                                        key={selectedProvince.province}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <div className="text-sm text-[#F47524] font-mono uppercase tracking-widest mb-2">{selectedProvince.region}</div>
                                                <h3 className="text-4xl font-black mb-1">{selectedProvince.province}</h3>
                                                {selectedDistrict && (
                                                    <div className="text-xl text-white font-bold">District {selectedDistrict.id}</div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => { setSelectedProvince(null); setSelectedDistrict(null); }}
                                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                            >
                                                <ArrowLeft className="w-6 h-6" />
                                            </button>
                                        </div>

                                        {selectedDistrict ? (
                                            // District Detail View
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-4 mb-6 p-4 bg-black/40 rounded-xl border border-gray-800">
                                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden shrink-0 ${['Pheu Thai', 'Thai Sang Thai'].includes(selectedDistrict.winner) ? 'bg-white' : 'bg-white/10'}`} style={{ backgroundColor: ['Pheu Thai', 'Thai Sang Thai'].includes(selectedDistrict.winner) ? 'white' : selectedDistrict.color }}>
                                                        {selectedDistrict.logo ? (
                                                            <img src={selectedDistrict.logo} alt={selectedDistrict.winner} className="w-full h-full object-contain p-2" />
                                                        ) : (
                                                            <span className="text-2xl font-bold">{selectedDistrict.winner.substring(0, 1)}</span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-gray-400 uppercase tracking-widest">Winner</div>
                                                        <div className="text-xl font-bold text-white">{selectedDistrict.winner}</div>
                                                        <div className="text-sm text-white/60 font-thai">{selectedDistrict.winner_th}</div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">Top 5 Candidates</h4>
                                                    <div className="space-y-3">
                                                        {selectedDistrict.top5.map((candidate, idx) => (
                                                            <div key={idx} className="relative">
                                                                <div className="flex items-center justify-between z-10 relative">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold bg-white/10 text-white/60">
                                                                            {idx + 1}
                                                                        </div>
                                                                        <div>
                                                                            <div className="text-sm font-bold">{candidate.name}</div>
                                                                            <div className="text-xs text-white/50 flex items-center gap-1">
                                                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: candidate.color }}></div>
                                                                                {candidate.party}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-sm font-mono text-white/60">{candidate.votes.toLocaleString()}</div>
                                                                </div>
                                                                <div className="absolute bottom-0 left-0 h-0.5 bg-white/10 w-full mt-2">
                                                                    <div
                                                                        className="h-full opacity-50"
                                                                        style={{
                                                                            width: `${(candidate.votes / selectedDistrict!.votes) * 100}%`,
                                                                            backgroundColor: candidate.color
                                                                        }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            // Province Summary View (Fallback or Initial)
                                            <div className="space-y-6">
                                                <div className="flex items-center gap-2 mb-6 p-4 bg-black/40 rounded-xl border border-gray-800">
                                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedProvince.color }}></div>
                                                    <span className="text-lg font-bold text-white">{selectedProvince.winner} Wins Province</span>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 mb-8">
                                                    <div className="bg-black/40 p-4 rounded-xl">
                                                        <div className="text-gray-500 text-xs uppercase">Total Votes</div>
                                                        <div className="text-xl font-bold text-white">{selectedProvince.totalVotes}</div>
                                                    </div>
                                                    <div className="bg-black/40 p-4 rounded-xl">
                                                        <div className="text-gray-500 text-xs uppercase">Districts</div>
                                                        <div className="text-xl font-bold text-white">{selectedProvince.districts.length}</div>
                                                    </div>
                                                </div>

                                                <div className="text-center text-sm text-gray-500">
                                                    Select a specific district in the grid to see candidate rankings.
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <div className="h-[400px] flex flex-col items-center justify-center text-center text-gray-500">
                                        <MapIcon className="w-16 h-16 mb-4 opacity-20" />
                                        <p>Select a district from the grid<br />to analyze local results.</p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Methodology Modal */}
            <MethodologyModal />
        </div>
    );
}

function MethodologyModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-50 bg-white text-black px-6 py-3 rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform flex items-center gap-2"
            >
                <Users className="w-4 h-4" /> Behind the Code
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsOpen(false)}></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-gray-900 border border-gray-700 rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white"
                        >
                            ✕
                        </button>

                        <h2 className="text-3xl font-black mb-2 text-white">Synthesizing Siam</h2>
                        <p className="text-[#F47524] font-mono text-sm mb-8 uppercase tracking-widest">Project Methodology</p>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                    <MapIcon className="text-[#F47524] w-5 h-5" /> 1. The Visualization
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    This interactive experience is built using <strong>React</strong> and <strong>Framer Motion</strong> to bring the 2023 Election data to life. The 'Digital Kingdom' map is a custom-built grid system that abstracts Thailand's geography into a pixelated, data-dense interface. Each cell represents a district, color-coded by the winning party. The "Neon/Dark" aesthetic is implemented with <strong>Tailwind CSS</strong>, utilizing dynamic lighting effects and glassmorphism to create an immersive, futuristic atmosphere that invites exploration.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                    <BarChart2 className="text-[#F47524] w-5 h-5" /> 2. The Data
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    The dataset is meticulously curated from the <strong>Election Commission of Thailand (ECT)</strong>'s official 2023 report. We processed over 40 million votes across 400 constituencies. The raw data was cleaned, normalized, and structured into a hierarchical JSON format, linking candidates, parties, and vote counts to their respective districts and provinces. This granular level of data allows for deep-diving into specific local results while maintaining a high-level national overview.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                    <MessageSquare className="text-[#F47524] w-5 h-5" /> 3. The AI Analyst
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    At the core of the insights engine is <strong>Google's Gemini 2.5 Flash</strong>. This isn't just pre-written text; the system dynamically constructs prompts based on your current interaction—whether you're looking at the national overview or a specific province like Chiang Mai. It feeds real-time data context (vote margins, party dominance, regional trends) to the LLM, which then synthesizes a narrative explanation. This allows the application to function not just as a dashboard, but as an intelligent analyst that explains the <em>story</em> behind the numbers.
                                </p>
                            </div>

                            <div className="pt-6 border-t border-gray-800">
                                <p className="text-xs text-gray-500 font-mono text-center">
                                    DESIGNED & DEVELOPED BY WUTCHARIN • 2025
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </>
    );
}
