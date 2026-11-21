import { GitFork, MessageSquare, Brain, Store, TrendingUp, Zap, StarHalf, BellRing } from 'lucide-react';
import ReviewFlowDemo from '../components/review-flow/ReviewFlowDemo';
import ProjectNavigation from '../components/ProjectNavigation';
import SubPageShell from '../components/shared/SubPageShell';
import SubPageHero from '../components/shared/SubPageHero';
import {
    DemoStageFrame,
    InteractiveFlowDiagram,
    SectionHeader,
    TensionLedger,
    type FlowNodeSpec,
    type TensionItem,
} from '../components/shared/ShowcaseBlocks';
import SEO from '../components/SEO';

const ACCENT = '#d97706';

const SECTIONS = [
    { id: 'problem', label: 'Signal' },
    { id: 'architecture', label: 'Routing' },
    { id: 'demo', label: 'Sandbox' },
];

const problems: TensionItem[] = [
    {
        icon: MessageSquare,
        title: 'Cross-channel feedback overload',
        body: 'Hospitality venues receive hundreds of reviews across Google, Wongnai, and delivery apps. Manual reading leaves operational patterns invisible.',
        metric: 'Multi-channel',
        tag: 'Volume',
    },
    {
        icon: Store,
        title: 'Kitchen & floor disconnect',
        body: 'Actionable remarks like "tom yum arrived lukewarm" sit in a marketing dashboard instead of reaching the kitchen line during service.',
        metric: '< 60s alert',
        tag: 'Operations',
    },
    {
        icon: TrendingUp,
        title: 'Unanswered brand risk',
        body: 'One food-safety or service failure left unanswered for 24 hours can tank a venue rating. Critical reviews trigger immediate P0 manager escalation.',
        metric: 'P0 escalation',
        tag: 'Brand safety',
    },
];

const flowNodes: FlowNodeSpec[] = [
    {
        id: 'ingest',
        step: '01',
        title: 'Review stream',
        role: 'API webhook',
        icon: MessageSquare,
        detail: 'Streams new customer reviews from Google Maps, Wongnai, and booking platforms in Thai or English, normalizing ratings and metadata.',
        statePreview: `{
  "source": "Google Maps",
  "stars": 2,
  "lang": "en/th",
  "text": "Pad Thai was great, wait time 45 mins"
}`,
        highlightLines: [1, 3],
    },
    {
        id: 'sentiment',
        step: '02',
        title: 'Aspect sentiment',
        role: 'LLM classifier',
        icon: Brain,
        detail: 'Decomposes each review into fine-grained topics (Food Quality, Service Speed, Pricing, Safety) instead of a blunt star average.',
        statePreview: `{
  "topics": [
    { "area": "food", "score": "+0.9" },
    { "area": "wait_time", "score": "-0.8" }
  ],
  "severity": "OPERATIONAL"
}`,
        highlightLines: [4, 9],
    },
    {
        id: 'routing',
        step: '03',
        title: 'Department router',
        role: 'Action dispatch',
        icon: GitFork,
        detail: 'Sends each insight directly to the accountable team: dish feedback to Kitchen Display, wait times to Floor Manager, praise to staff scores.',
        statePreview: `{
  "kitchen": "NONE",
  "floorManager": "ALERT · Queue delay",
  "staffPoints": "+10 (Chef Som)"
}`,
        highlightLines: [11, 18],
    },
    {
        id: 'reply',
        step: '04',
        title: 'Response & loop',
        role: 'Reply + P0 alert',
        icon: BellRing,
        detail: 'Drafts a tailored bilingual reply for one-click manager approval and logs resolution status back to the venue scorecard.',
        statePreview: `{
  "draftReply": "Ready for 1-click post",
  "slackNotified": "#floor-ops",
  "resolved": "TRACKING"
}`,
        highlightLines: [19, 24],
    },
];

const ROUTER_CODE = `# Aspect-based sentiment & operational routing
analysis = llm.analyze_review(
    text=review.body,
    taxonomy=["food", "service", "safety", "value"],
)

if analysis.severity == "CRITICAL":
    slack.send(channel="#management", msg=f"P0 ALERT: {review.body}")
    jira.create_ticket(priority="P0", owner="gm")

elif "food" in analysis.negative_topics:
    kds.push_alert(
        dish=analysis.entity,
        issue=analysis.summary,
    )

elif analysis.sentiment == "POSITIVE":
    staff_db.add_points(employee=analysis.entity, points=10)

# Draft bilingual owner reply for fast approval
draft = llm.draft_reply(
    review=review,
    tone="warm_accountable",
    requires_approval=True,
)`;

const ReviewFlowPage = () => {
    return (
        <SubPageShell statusLabel="System Online" accentColor={ACCENT} sections={SECTIONS}>
            <SEO
                title="ReviewFlow Reputation Engine: Real-Time Hospitality Feedback AI"
                description="An NLP reputation agent that decomposes customer reviews by operational topic, alerts the right team, and drafts bilingual replies."
                url="https://wutcharin.com/review-flow"
            />
            <SubPageHero
                badgeLabel="Interactive Simulation"
                BadgeIcon={StarHalf}
                titleLead="ReviewFlow"
                titleAccent="Reputation Engine."
                accentColor={ACCENT}
                description={
                    <>
                        An agent that turns customer reviews into operational action. It parses topic-level sentiment, alerts the right department, and drafts
                        tailored replies in seconds.
                    </>
                }
                primaryCta={{ label: 'Live simulation', href: '#demo', icon: Zap }}
                secondaryCta={{ label: 'Architecture', href: '#architecture', icon: GitFork }}
            />

            {/* 01 · Problem ledger */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="problem"
                    index="01"
                    eyebrow="Reputation signal"
                    title="Every review hides"
                    accent="an ops alert."
                    accentColor={ACCENT}
                    lead="Star averages hide root causes. ReviewFlow separates kitchen quality, service speed, and safety incidents so every issue reaches the right person."
                />
                <TensionLedger items={problems} accentColor={ACCENT} />
            </section>

            {/* 02 · Interactive routing diagram */}
            <section className="mx-auto mb-24 max-w-6xl px-6 md:mb-32 md:px-10">
                <SectionHeader
                    id="architecture"
                    index="02"
                    eyebrow="NLP & automation"
                    title="From raw review"
                    accent="to routed action."
                    accentColor={ACCENT}
                    lead="Click any node to see how incoming reviews are parsed into topic scores, dispatched to kitchen or management channels, and closed with a drafted reply."
                />
                <InteractiveFlowDiagram
                    nodes={flowNodes}
                    accentColor={ACCENT}
                    filename="router_logic.py"
                    code={ROUTER_CODE}
                    cyclicLabel="Resolution metrics feed back into venue score"
                />
            </section>

            {/* 03 · Interactive sandbox */}
            <section id="demo" className="mx-auto mb-16 max-w-6xl scroll-mt-24 px-6 md:px-10">
                <SectionHeader
                    index="03"
                    eyebrow="Interactive sandbox"
                    title="Run a live"
                    accent="review triage."
                    accentColor={ACCENT}
                    lead="Test praise, kitchen issues, and urgent safety incidents to watch the sentiment engine classify topics and dispatch team alerts."
                />
                <DemoStageFrame
                    label="Live Simulation · Reputation Triage"
                    accentColor={ACCENT}
                    badges={['Topic Sentiment', 'Dept Routing', 'Draft Replies']}
                >
                    <ReviewFlowDemo />
                </DemoStageFrame>
            </section>

            <ProjectNavigation currentId="review-flow" />
        </SubPageShell>
    );
};

export default ReviewFlowPage;
