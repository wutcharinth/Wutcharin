import { Brain, Shield, Zap, Scale, Building2, Gavel, Play } from 'lucide-react';
import CollectionsDemo from '../components/collections/CollectionsDemo';
import ProjectNavigation from '../components/ProjectNavigation';
import SubPageShell from '../components/shared/SubPageShell';
import SubPageHero from '../components/shared/SubPageHero';

const ACCENT = '#10b981';

export default function CollectionsPage() {
    return (
        <SubPageShell statusLabel="System Online" accentColor={ACCENT}>
            <SubPageHero
                badgeLabel="Autonomous Dispute Resolution Agent"
                BadgeIcon={Brain}
                titleLead="Enterprise"
                titleAccent="Collections AI"
                description={
                    <>
                        An intelligent agent that recovers lost revenue from <strong>Virtual Credit Card (VCC)</strong>{' '}
                        overcharges. It autonomously validates cancellation policies, negotiates with hotels, and
                        executes chargebacks at scale.
                    </>
                }
                accentColor={ACCENT}
                primaryCta={{ label: 'Run the simulation', href: '#demo', icon: Play }}
            />

            {/* Capability chips */}
            <section className="container mx-auto px-6 mb-32">
                <div className="flex flex-wrap justify-center gap-4">
                    <span className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-bold text-slate-300 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-violet-400" /> VCC Fraud Protection
                    </span>
                    <span className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-bold text-slate-300 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" /> Instant Recovery
                    </span>
                    <span className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm font-bold text-slate-300 flex items-center gap-2">
                        <Scale className="w-4 h-4 text-blue-400" /> Policy Compliance
                    </span>
                </div>
            </section>

            {/* Context & Problem Grid */}
            <section className="container mx-auto px-6 mb-32">
                <div className="text-center mb-16">
                    <h2 className="text-3xl text-white mb-4 tracking-tight">The <span className="text-red-400">multi-million dollar</span> leakage</h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Online Travel Agencies (OTAs) pay hotels using temporary Virtual Credit Cards. When bookings are cancelled, hotels often charge these cards incorrectly, leading to massive financial losses.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-violet-500/30 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Building2 className="w-24 h-24 text-red-500" />
                        </div>
                        <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors relative z-10">
                            <Building2 className="w-6 h-6 text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 relative z-10">Erroneous Charges</h3>
                        <p className="text-slate-400 leading-relaxed relative z-10 text-sm">
                            Hotels frequently charge the full VCC amount even for free-cancellation bookings, or fail to process refunds for "No-Show" waivers.
                        </p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-violet-500/30 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Scale className="w-24 h-24 text-blue-500" />
                        </div>
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors relative z-10">
                            <Scale className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 relative z-10">Operational Bottleneck</h3>
                        <p className="text-slate-400 leading-relaxed relative z-10 text-sm">
                            Recovery is manual and slow. Agents spend 20+ minutes per case navigating language barriers, time zones, and complex cancellation policies.
                        </p>
                    </div>
                    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-violet-500/30 transition-colors group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Gavel className="w-24 h-24 text-green-500" />
                        </div>
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors relative z-10">
                            <Gavel className="w-6 h-6 text-green-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 relative z-10">Autonomous Recovery</h3>
                        <p className="text-slate-400 leading-relaxed relative z-10 text-sm">
                            Our AI agent integrates directly with the PMS and Payment Gateway. It detects the error, validates the policy, and recovers the funds instantly.
                        </p>
                    </div>
                </div>
            </section>

            {/* Cognitive Flow Explanation */}
            <section className="container mx-auto px-6 mb-32">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <h2 className="text-4xl md:text-5xl tracking-tight mb-8 text-white">
                            Cognitive <span className="font-serif italic font-normal text-violet-400">flow</span>
                        </h2>
                        <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                            The agent doesn't just follow a script. It uses a <strong>Strategy Engine</strong> to determine the best approach based on the hotel's history and tier.
                        </p>

                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold shrink-0">1</div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Trigger & Analyze</h4>
                                    <p className="text-slate-500 text-sm">Detects overcharge via webhook. Validates against cancellation policy.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold shrink-0">2</div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Strategize</h4>
                                    <p className="text-slate-500 text-sm">Decides tone (Firm vs. Polite) based on partner relationship.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold shrink-0">3</div>
                                <div>
                                    <h4 className="text-white font-bold text-lg">Rebuttal Loop</h4>
                                    <p className="text-slate-500 text-sm">If the hotel denies, the agent fetches new evidence (e.g., flight data) and argues back.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:w-1/2 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 blur-[100px] opacity-20"></div>
                        <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 font-mono text-xs md:text-sm text-slate-300 shadow-2xl">
                            <div className="flex gap-2 mb-4 border-b border-slate-800 pb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="ml-auto text-slate-500">strategy_engine.py</span>
                            </div>
                            <pre className="language-python">
                                {`def strategy_node(state: AgentState):
    hotel_tier = state["hotel_tier"]
    history = state["dispute_history"]

    if hotel_tier == "VIP" and history["win_rate"] > 0.9:
        tone = "POLITE_REMINDER"
        template = "templates/vip_inquiry.txt"
    else:
        tone = "FIRM_DEMAND"
        template = "templates/legal_notice.txt"

    return {
        "tone": tone,
        "email_template": template,
        "next_step": "draft_email"
    }`}
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Demo */}
            <section id="demo" className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 border-b border-slate-800 pb-12">
                    <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0">
                        <Brain className="text-white w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl tracking-tight text-white mb-2">Interactive simulation</h2>
                        <p className="text-slate-400 max-w-2xl">
                            Watch the agent handle a live dispute. Select a scenario to see how it adapts its strategy when the hotel pushes back.
                        </p>
                    </div>
                </div>

                <CollectionsDemo />
            </section>

            <ProjectNavigation currentId="collections" />
        </SubPageShell>
    );
}
