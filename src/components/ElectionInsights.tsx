import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

interface Party {
    name: string;
    seats: number;
    votes: string;
    rawVotes: number;
    color: string;
}

interface Province {
    province: string;
    region: string;
    winner: string;
    totalVotes: string;
    seatBreakdown: { party: string; seats: number; color: string }[];
}

interface ElectionInsightsProps {
    nationalParties: Party[];
    provinces: Province[];
}

export const ElectionInsights: React.FC<ElectionInsightsProps> = ({ nationalParties, provinces }) => {
    // 1. Vote Share vs Seat Share
    const shareData = useMemo(() => {
        const totalVotes = nationalParties.reduce((sum, p) => sum + p.rawVotes, 0);
        const totalSeats = 500;

        return nationalParties.slice(0, 8).map(party => ({
            name: party.name,
            VoteShare: (party.rawVotes / totalVotes) * 100,
            SeatShare: (party.seats / totalSeats) * 100,
            color: party.color
        }));
    }, [nationalParties]);

    // 2. Regional Dominance
    const regionalData = useMemo(() => {
        const regions: Record<string, Record<string, { seats: number; color: string }>> = {};
        const regionTotals: Record<string, number> = {};

        provinces.forEach(prov => {
            const region = prov.region;
            if (!regions[region]) {
                regions[region] = {};
                regionTotals[region] = 0;
            }

            prov.seatBreakdown.forEach(item => {
                if (!regions[region][item.party]) {
                    regions[region][item.party] = { seats: 0, color: item.color };
                }
                regions[region][item.party].seats += item.seats;
                regionTotals[region] += item.seats;
            });
        });

        // Convert to array and find top party per region
        return Object.entries(regions).map(([region, parties]) => {
            const topParty = Object.entries(parties).reduce((a, b) => a[1].seats > b[1].seats ? a : b);
            const totalSeatsInRegion = regionTotals[region];
            const percentage = (topParty[1].seats / totalSeatsInRegion) * 100;

            return {
                region,
                party: topParty[0],
                seats: topParty[1].seats,
                color: topParty[1].color,
                percentage: percentage.toFixed(1)
            };
        });
    }, [provinces]);

    return (
        <section className="py-20 bg-black text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-12 flex items-center gap-4">
                    <span className="text-[#F47524]">///</span> Election Insights
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Vote vs Seat Share */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800"
                    >
                        <h3 className="text-xl font-bold mb-6">Vote Share vs. Seat Share</h3>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={shareData} layout="vertical" margin={{ left: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                    <XAxis type="number" unit="%" stroke="#666" />
                                    <YAxis dataKey="name" type="category" stroke="#fff" width={100} tick={{ fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                                    />
                                    <Legend />
                                    <Bar dataKey="VoteShare" name="Popular Vote %" fill="#666" radius={[0, 4, 4, 0]} barSize={10} />
                                    <Bar dataKey="SeatShare" name="Seat %" radius={[0, 4, 4, 0]} barSize={10}>
                                        {shareData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-sm text-gray-500 mt-4">
                            Comparing the percentage of total votes received vs. the percentage of parliament seats won.
                            Discrepancies highlight the impact of the electoral system.
                        </p>
                    </motion.div>

                    {/* Regional Champions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-gray-900/50 p-8 rounded-3xl border border-gray-800"
                    >
                        <h3 className="text-xl font-bold mb-6">Regional Strongholds</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {regionalData.map((item) => (
                                <div key={item.region} className="bg-black/40 p-4 rounded-xl border border-gray-800 flex items-center justify-between group hover:border-white/20 transition-colors">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">{item.region}</div>
                                        <div className="text-lg font-bold">{item.party}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black" style={{ color: item.color }}>{item.seats}</div>
                                        <div className="text-[10px] text-gray-600 uppercase">
                                            Seats Won <span className="text-white/40">({item.percentage}%)</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-6">
                            The party that secured the highest number of constituency seats in each region.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
