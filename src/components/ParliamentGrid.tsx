import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Party {
    name: string;
    seats: number;
    color: string;
    logo: string;
}

interface ParliamentGridProps {
    parties: Party[];
}

interface Point {
    x: number;
    y: number;
    angle: number;
}

export const ParliamentGrid: React.FC<ParliamentGridProps> = ({ parties }) => {
    const totalSeats = 500;
    const [hoveredParty, setHoveredParty] = useState<Party | null>(null);

    // Generate Hemicycle Points
    const points = useMemo(() => {
        const pts: Point[] = [];
        const rows = 12;
        const innerRadius = 120;
        const rowHeight = 18;

        // Calculate total arc length available to determine spacing
        let totalArcLength = 0;
        for (let i = 0; i < rows; i++) {
            totalArcLength += Math.PI * (innerRadius + i * rowHeight);
        }

        const spacing = totalArcLength / totalSeats;

        let seatsAllocated = 0;
        const rowCounts: number[] = [];

        // First pass: allocate based on arc length
        for (let i = 0; i < rows; i++) {
            const r = innerRadius + i * rowHeight;
            const count = Math.round((Math.PI * r) / spacing);
            rowCounts.push(count);
            seatsAllocated += count;
        }

        // Adjust to match exactly 500
        let diff = totalSeats - seatsAllocated;
        let rowIndex = rows - 1;
        while (diff !== 0) {
            if (diff > 0) {
                rowCounts[rowIndex]++;
                diff--;
            } else {
                if (rowCounts[rowIndex] > 0) {
                    rowCounts[rowIndex]--;
                    diff++;
                }
            }
            rowIndex = (rowIndex - 1 + rows) % rows;
        }

        // Generate coordinates
        rowCounts.forEach((count, i) => {
            const r = innerRadius + i * rowHeight;
            const angleStep = Math.PI / (count - 1 || 1);

            for (let j = 0; j < count; j++) {
                const angle = Math.PI - (j * angleStep); // 180 to 0
                pts.push({
                    x: 300 + r * Math.cos(angle),
                    y: 320 - r * Math.sin(angle), // 320 is bottom baseline
                    angle: angle
                });
            }
        });

        // Sort by angle (descending: left to right) to create wedges
        return pts.sort((a, b) => b.angle - a.angle);
    }, []);

    // Create flat array of seats
    const seats = useMemo(() => {
        return parties.flatMap(party =>
            Array(party.seats).fill(party)
        );
    }, [parties]);

    // Fill remaining if < 500 (shouldn't happen with correct data but safe to have)
    const displaySeats = [...seats];
    while (displaySeats.length < 500) {
        displaySeats.push({ name: 'Vacant', color: '#333', seats: 0, logo: '' });
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-6 bg-gray-900/50 rounded-3xl border border-gray-800 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Parliament Seat Distribution (500 Seats)</h3>

            <div className="relative w-full max-w-[600px] mx-auto aspect-[2/1.2] mb-8">
                <svg viewBox="0 0 600 350" className="w-full h-full overflow-visible">
                    <g>
                        {points.map((pt, i) => {
                            const seat = displaySeats[i] || { color: '#333', name: 'Unknown' };
                            const isHovered = hoveredParty?.name === seat.name;
                            const isDimmed = hoveredParty && !isHovered;

                            return (
                                <motion.circle
                                    key={i}
                                    cx={pt.x}
                                    cy={pt.y}
                                    r={isHovered ? 6 : 4}
                                    fill={seat.color}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{
                                        opacity: isDimmed ? 0.2 : 1,
                                        scale: isHovered ? 1.5 : 1
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.002,
                                        scale: { duration: 0.2 }
                                    }}
                                    className="cursor-pointer transition-colors"
                                    onMouseEnter={() => setHoveredParty(seat)}
                                    onMouseLeave={() => setHoveredParty(null)}
                                />
                            );
                        })}
                    </g>
                </svg>

                {/* Center Info */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-0 text-center pointer-events-none pb-4">
                    <AnimatePresence mode="wait">
                        {hoveredParty ? (
                            <motion.div
                                key="party-info"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col items-center"
                            >
                                <div className="text-4xl font-black mb-1" style={{ color: hoveredParty.color }}>{hoveredParty.seats}</div>
                                <div className="text-lg text-white font-bold">{hoveredParty.name}</div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="total-info"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col items-center"
                            >
                                <div className="text-5xl font-black text-white mb-1">500</div>
                                <div className="text-sm text-gray-500 uppercase tracking-widest">Total Seats</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-4">
                {parties.map((party) => (
                    <motion.div
                        key={party.name}
                        className={`flex items - center gap - 2 px - 3 py - 1.5 rounded - full border transition - all cursor - pointer ${hoveredParty?.name === party.name ? 'bg-white/10 border-white/30 scale-105' : 'border-transparent hover:bg-white/5'} `}
                        onMouseEnter={() => setHoveredParty(party)}
                        onMouseLeave={() => setHoveredParty(null)}
                    >
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: party.color }}></div>
                        <span className={`text - xs ${hoveredParty?.name === party.name ? 'text-white font-bold' : 'text-gray-400'} `}>
                            {party.name} <span className="opacity-60">({party.seats})</span>
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
