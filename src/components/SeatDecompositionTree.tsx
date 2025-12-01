import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, Users, MapPin, Award } from 'lucide-react';

interface PartyStats {
    name: string;
    name_th: string;
    seats: number;
    seatsConstituency: number;
    seatsPartyList: number;
    color: string;
    logo: string;
}

interface ProvinceData {
    province: string;
    region: string;
    seatBreakdown: { party: string; name_th: string; seats: number; color: string; logo: string }[];
    districts: {
        id: number;
        winner: string;
        winner_th: string;
        party: string;
        color: string;
        votes: number;
        logo: string;
        top5: { name: string; party: string; votes: number; color: string }[];
    }[];
}

interface SeatDecompositionTreeProps {
    parties: PartyStats[];
    provinces: ProvinceData[];
}

interface TreeNodeData {
    id: string;
    label: string;
    label_th?: string;
    value: number;
    color: string;
    logo?: string;
    children?: TreeNodeData[];
    level: number;
    type: 'party' | 'seat-type' | 'region' | 'province' | 'district' | 'candidate';
}

// Tree Node Component
const TreeNode = ({ node, depth = 0 }: { node: TreeNodeData; depth?: number }) => {
    const [isExpanded, setIsExpanded] = useState(depth < 1);
    const hasChildren = node.children && node.children.length > 0;
    
    const indentPx = depth * 24;
    
    return (
        <div className="select-none">
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors group ${depth === 0 ? 'bg-white/5' : ''}`}
                style={{ marginLeft: `${indentPx}px` }}
                onClick={() => hasChildren && setIsExpanded(!isExpanded)}
            >
                {/* Expand/Collapse Icon */}
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    {hasChildren ? (
                        isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                        )
                    ) : (
                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    )}
                </div>
                
                {/* Node Icon/Logo */}
                {node.logo ? (
                    <div 
                        className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: ['เพื่อไทย', 'ไทยสร้างไทย', 'Pheu Thai', 'Thai Sang Thai'].includes(node.label) ? 'white' : node.color }}
                    >
                        <img src={node.logo} alt={node.label} className="w-full h-full object-contain p-0.5" />
                    </div>
                ) : (
                    <div 
                        className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: node.color + '30', color: node.color }}
                    >
                        {node.type === 'region' && <MapPin className="w-3 h-3" />}
                        {node.type === 'province' && <Users className="w-3 h-3" />}
                        {node.type === 'district' && <Award className="w-3 h-3" />}
                        {node.type === 'seat-type' && <span className="text-[10px] font-bold">{node.label === 'Party List' ? 'PL' : 'CS'}</span>}
                        {node.type === 'candidate' && <span className="text-[10px]">👤</span>}
                    </div>
                )}
                
                {/* Label */}
                <div className="flex-grow min-w-0">
                    <div className="flex items-baseline gap-2">
                        <span className={`font-medium truncate ${depth === 0 ? 'text-white text-base' : 'text-gray-300 text-sm'}`}>
                            {node.label}
                        </span>
                        {node.label_th && (
                            <span className="text-xs text-gray-500 font-thai truncate">{node.label_th}</span>
                        )}
                    </div>
                </div>
                
                {/* Value Badge */}
                <div 
                    className="shrink-0 px-3 py-1 rounded-full font-bold text-sm"
                    style={{ 
                        backgroundColor: node.color + '20',
                        color: node.color
                    }}
                >
                    {node.value} {node.type === 'candidate' ? 'votes' : node.value === 1 ? 'seat' : 'seats'}
                </div>
            </motion.div>
            
            {/* Children */}
            <AnimatePresence>
                {isExpanded && hasChildren && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        {/* Visual connector line */}
                        <div 
                            className="border-l-2 border-gray-800 ml-6"
                            style={{ marginLeft: `${indentPx + 14}px` }}
                        >
                            {node.children!.map((child) => (
                                <TreeNode key={child.id} node={child} depth={depth + 1} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const SeatDecompositionTree: React.FC<SeatDecompositionTreeProps> = ({ parties, provinces }) => {
    const [selectedParty, setSelectedParty] = useState<string | null>(null);
    
    // Build tree data structure
    const treeData = useMemo(() => {
        // Group provinces by region
        const regionGroups: Record<string, ProvinceData[]> = {};
        provinces.forEach(p => {
            if (!regionGroups[p.region]) regionGroups[p.region] = [];
            regionGroups[p.region].push(p);
        });
        
        // Build tree for each party
        return parties.map(party => {
            // Get regional breakdown for this party's constituency seats
            const regionNodes: TreeNodeData[] = Object.entries(regionGroups).map(([regionName, regionProvinces]) => {
                // Get provinces where this party won seats
                const provinceNodes: TreeNodeData[] = regionProvinces
                    .map(province => {
                        const partySeatData = province.seatBreakdown.find(sb => sb.party === party.name);
                        if (!partySeatData || partySeatData.seats === 0) return null;
                        
                        // Get individual districts won by this party
                        const districtNodes: TreeNodeData[] = province.districts
                            .filter(d => d.party === party.name)
                            .map(d => {
                                const candidateChildren: TreeNodeData[] = d.top5.slice(0, 3).map((c, idx) => ({
                                    id: `${party.name}-${province.province}-d${d.id}-c${idx}`,
                                    label: c.name,
                                    value: c.votes,
                                    color: c.color,
                                    level: 5,
                                    type: 'candidate' as const
                                }));
                                return {
                                    id: `${party.name}-${province.province}-d${d.id}`,
                                    label: `District ${d.id}`,
                                    label_th: d.winner_th,
                                    value: d.votes,
                                    color: party.color,
                                    level: 4,
                                    type: 'district' as const,
                                    children: candidateChildren
                                };
                            });
                        
                        return {
                            id: `${party.name}-${province.province}`,
                            label: province.province,
                            value: partySeatData.seats,
                            color: party.color,
                            level: 3,
                            type: 'province',
                            children: districtNodes.length > 0 ? districtNodes : undefined
                        } as TreeNodeData;
                    })
                    .filter((n): n is NonNullable<typeof n> => n !== null);
                
                const regionSeats = provinceNodes.reduce((sum, p) => sum + p.value, 0);
                if (regionSeats === 0) return null;
                
                return {
                    id: `${party.name}-${regionName}`,
                    label: regionName,
                    value: regionSeats,
                    color: party.color,
                    level: 2,
                    type: 'region',
                    children: provinceNodes
                } as TreeNodeData;
            }).filter((n): n is NonNullable<typeof n> => n !== null);
            
            // Build the party tree
            const partyTree: TreeNodeData = {
                id: party.name,
                label: party.name,
                label_th: party.name_th,
                value: party.seats,
                color: party.color,
                logo: party.logo,
                level: 0,
                type: 'party',
                children: [
                    {
                        id: `${party.name}-constituency`,
                        label: 'Constituency',
                        value: party.seatsConstituency,
                        color: party.color,
                        level: 1,
                        type: 'seat-type',
                        children: regionNodes
                    },
                    {
                        id: `${party.name}-partylist`,
                        label: 'Party List',
                        value: party.seatsPartyList,
                        color: party.color,
                        level: 1,
                        type: 'seat-type'
                    }
                ]
            };
            
            return partyTree;
        });
    }, [parties, provinces]);
    
    // Filter to selected party or show all
    const displayedTree = selectedParty 
        ? treeData.filter(t => t.id === selectedParty)
        : treeData;
    
    return (
        <section className="py-32 bg-black border-t border-white/10">
            <div className="container mx-auto px-4">
                <div className="mb-12">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 flex items-center gap-4">
                        <ChevronRight className="w-12 h-12 text-[#F47524]" />
                        Seat Decomposition
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl">
                        Explore how each party's seats break down: Party List vs Constituency, then by Region, Province, and District winners.
                    </p>
                </div>
                
                {/* Party Filter Pills */}
                <div className="flex flex-wrap gap-2 mb-8">
                    <button
                        onClick={() => setSelectedParty(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedParty === null 
                                ? 'bg-[#F47524] text-white' 
                                : 'bg-white/10 text-gray-400 hover:bg-white/20'
                        }`}
                    >
                        All Parties
                    </button>
                    {parties.slice(0, 8).map(party => (
                        <button
                            key={party.name}
                            onClick={() => setSelectedParty(party.name === selectedParty ? null : party.name)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                                selectedParty === party.name 
                                    ? 'ring-2 ring-offset-2 ring-offset-black' 
                                    : 'bg-white/10 hover:bg-white/20'
                            }`}
                            style={{ 
                                backgroundColor: selectedParty === party.name ? party.color : undefined,
                                color: selectedParty === party.name ? 'white' : party.color,
                                '--tw-ring-color': party.color
                            } as React.CSSProperties}
                        >
                            {party.logo && (
                                <img src={party.logo} alt="" className="w-4 h-4 object-contain" />
                            )}
                            {party.name}
                        </button>
                    ))}
                </div>
                
                {/* Tree Visualization */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-2">
                        {displayedTree.map(tree => (
                            <TreeNode key={tree.id} node={tree} />
                        ))}
                    </div>
                </div>
                
                {/* Legend */}
                <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gray-700 flex items-center justify-center text-[8px]">PL</div>
                        <span>Party List (Proportional)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-gray-700 flex items-center justify-center text-[8px]">CS</div>
                        <span>Constituency (Direct Election)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>Region</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Province</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        <span>District Winner</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SeatDecompositionTree;

