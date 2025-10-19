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
            <h2 className="text-3xl font-bold text-white mb-2">Professional Experience</h2>
            <div className="w-20 h-1 bg-cyan-500 mb-10"></div>
            
            <div className="space-y-12">
                {experienceData.map((exp, index) => (
                    <div key={index} className="relative group">
                        <div className="absolute -left-4 top-0 h-full w-0.5 bg-gray-700 hidden sm:block"></div>
                         <div className="absolute -left-6 top-2 hidden sm:block">
                          <div className="h-4 w-4 rounded-full bg-gray-700 border-2 border-gray-900 group-hover:bg-cyan-500 transition-colors duration-300"></div>
                        </div>
                        <div className="sm:pl-8">
                            <h3 className="text-2xl font-bold text-white mb-1">{exp.company}</h3>
                             <p className="text-md text-gray-400 font-medium mb-4">{exp.descriptor}</p>
                            {exp.roles.map((role, rIndex) => (
                                <div key={rIndex} className={rIndex > 0 ? 'mt-6' : ''}>
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-2">
                                        <h4 className="font-semibold text-cyan-400 text-lg">{role.title}</h4>
                                        <time className="text-sm font-medium uppercase text-gray-500 whitespace-nowrap mt-1 sm:mt-0">{role.duration}</time>
                                    </div>
                                    <ul className="text-gray-300 list-disc list-inside space-y-2 marker:text-cyan-500">
                                      {role.points.map((point, pIndex) => (
                                        <li key={pIndex} className="pl-2">{point}</li>
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