import React from 'react';

const experienceData = [
  {
    company: "Agoda",
    descriptor: "Global Travel Tech Platform",
    roles: [
      {
        title: "Associate Director - FinTech Data and Automation",
        duration: "Apr 2024 - Present",
        points: [
          "Orchestrating the data and automation strategy for the FinTech vertical, leading a 7-person team to enhance risk management, compliance, and operational efficiency.",
          "Delivering comprehensive analytics for Treasury, Tax, Credit Risk, and Collections to drive efficiency gains and resolve upstream data issues.",
          "Championing adoption of advanced analytics and self-service BI tools to embed data-driven decision-making across the finance organization.",
        ],
      },
      {
        title: "Associate Director - Supply Analytics",
        duration: "Nov 2017 - Apr 2022",
        points: [
            "Capitalized on data to drive supply strategy, developing predictive ROI and churn models that significantly grew high-value partnerships and informed C-suite decisions.",
            "Architected the centralized Supply department database, empowering the organization with enhanced data accessibility and analysis capabilities.",
            "Designed and deployed over 100 Tableau dashboards, democratizing data for 600+ weekly users and fostering a culture of self-service analytics.",
        ],
      }
    ],
  },
  {
    company: "Really Cool Airlines",
    descriptor: "Airline Startup",
    roles: [
      {
        title: "Head of Commercial",
        duration: "Apr 2023 - Feb 2024",
        points: [
          "Pioneered the airline's commercial division from concept, establishing 6 teams (11 headcount) and securing 200M THB in seed capital by articulating a compelling market entry strategy.",
          "Directed all commercial functions: Route Planning, Revenue Management, Sales & Distribution, Marketing, and Product Development.",
          "Led provider selection and negotiation for all key systems, balancing lean startup budgets with critical capabilities.",
        ],
      },
    ],
  },
  {
    company: "Thairath Group",
    descriptor: "Thai Media Conglomerate",
    roles: [
      {
        title: "Head of Strategic Foresight and Planning",
        duration: "Apr 2022 - Apr 2023",
        points: [
          "Engineered a group-wide data transformation, implementing KPI frameworks and analytics systems that unified strategic priorities across diverse business units.",
          "Advised on resource allocation, inter-departmental communication, and technology decisions to drive group-level goals.",
          "Launched a new business unit (Taro Media) by authoring the complete business plan to mitigate content rights risks and capture international revenue streams.",
        ],
      },
    ],
  },
  {
    company: "Nok Air",
    descriptor: "Low-Cost Airline",
    roles: [
      {
        title: "Planning Director",
        duration: "Oct 2016 - Nov 2017",
        points: [
          "Co-architected a successful corporate turnaround by deploying analytical models for network optimization, directly leading to a 15% increase in aircraft utilization and a +3 p.p. YoY gain in cabin factor.",
          "Authored and presented the comprehensive turnaround strategy to the Board of Directors, lessors, banks, and potential investors, securing critical new investment.",
        ],
      },
    ],
  },
  {
    company: "Thai Smile Airways",
    descriptor: "Regional Full-Service Airline",
    roles: [
      {
        title: "Corporate Strategy & Planning Manager",
        duration: "Nov 2015 - Oct 2016",
        points: [
          "Increased route profitability and expanded market share by directing data-driven network planning and capacity decisions.",
          "Led successful negotiations with aviation authorities and airports to secure operating permits and optimal slots for new destinations.",
        ],
      },
    ],
  },
];


const Experience: React.FC = () => {
    return (
        <section className="py-16 md:py-24">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-2">Professional Experience</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400 max-w-2xl mx-auto">20 years across global tech platforms, startups, and transformational leadership roles</p>
            </div>
            
            <div className="space-y-8">
                {experienceData.map((exp, index) => (
                    <div key={index} className="relative group">
                        {/* Timeline connector */}
                        <div className="absolute -left-4 top-0 h-full w-0.5 bg-gradient-to-b from-cyan-500 to-blue-500 hidden sm:block opacity-50"></div>
                        
                        {/* Timeline dot with pulse effect */}
                        <div className="absolute -left-6 top-6 hidden sm:block">
                            <div className="relative">
                                <div className="absolute inset-0 h-4 w-4 rounded-full bg-cyan-500 animate-ping opacity-75"></div>
                                <div className="relative h-4 w-4 rounded-full bg-cyan-500 border-4 border-gray-900 group-hover:scale-125 transition-transform duration-300"></div>
                            </div>
                        </div>
                        
                        {/* Company Card */}
                        <div className="sm:pl-8 bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700 rounded-xl p-6 hover:border-cyan-500 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
                            {/* Company Header */}
                            <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-700">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{exp.company}</h3>
                                    <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">{exp.descriptor}</p>
                                </div>
                                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-3 py-1 text-xs text-cyan-400 font-semibold whitespace-nowrap">
                                    {exp.roles.length} {exp.roles.length > 1 ? 'Roles' : 'Role'}
                                </div>
                            </div>
                            
                            {/* Roles */}
                            {exp.roles.map((role, rIndex) => (
                                <div key={rIndex} className={`${rIndex > 0 ? 'mt-6 pt-6 border-t border-gray-700/50' : ''}`}>
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3 gap-2">
                                        <h4 className="font-bold text-cyan-400 text-lg">{role.title}</h4>
                                        <time className="inline-flex items-center gap-2 text-xs font-bold uppercase text-gray-500 bg-gray-800 px-3 py-1 rounded-full border border-gray-700 whitespace-nowrap">
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                            {role.duration}
                                        </time>
                                    </div>
                                    <ul className="space-y-3">
                                      {role.points.map((point, pIndex) => (
                                        <li key={pIndex} className="flex items-start gap-3 text-gray-300">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500"></div>
                                            </div>
                                            <span className="leading-relaxed">{point}</span>
                                        </li>
                                      ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Experience;