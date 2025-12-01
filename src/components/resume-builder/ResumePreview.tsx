import React from 'react';
import { TemplateType, LayoutType, FontSize } from './types';
import type { ResumeData, FontFamily } from './types';
import { Mail, Phone, Linkedin, Globe } from 'lucide-react';

interface ResumePreviewProps {
    data: ResumeData;
    template: TemplateType;
    layout: LayoutType;
    color: string;
    fontFamily: FontFamily;
    fontSize: FontSize;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
    data,
    template,
    layout,
    color,
    fontFamily,
    fontSize
}) => {

    // -- A4 Dimensions & Visuals --
    const PAGE_HEIGHT_MM = 297;
    const GAP_MM = 10;

    const a4ContainerStyles: React.CSSProperties = {
        width: '210mm',
        minHeight: '297mm',
        fontFamily: `"${fontFamily}", sans-serif`,

        // Multi-page simulation
        // Creates a repeating pattern: White Page (297mm) -> Gray Gap (10mm) -> White Page...
        backgroundColor: '#e5e7eb', // The "Gap" color
        backgroundImage: `linear-gradient(to bottom, white ${PAGE_HEIGHT_MM}mm, transparent ${PAGE_HEIGHT_MM}mm)`,
        backgroundSize: `100% ${PAGE_HEIGHT_MM + GAP_MM}mm`,
        backgroundRepeat: 'repeat-y',

        // Default Shadow for the "Paper" look (applied to the whole long strip)
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',

        // Important: Ensure we don't accidentally clip content, but let it flow over the gaps visually
        // so users see where the break is.
        overflow: 'visible',
        paddingBottom: `${GAP_MM}mm` // Ensure last page has a gap visualized if needed
    };

    // -- Dynamic Font Sizing --
    const getTextClass = (base: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '4xl') => {
        const scale = {
            [FontSize.SMALL]: { xs: 'text-[0.45rem]', sm: 'text-[0.55rem]', base: 'text-[0.65rem]', lg: 'text-[0.75rem]', xl: 'text-[0.85rem]', '2xl': 'text-[0.95rem]', '4xl': 'text-[1.15rem]' },
            [FontSize.MEDIUM]: { xs: 'text-[0.55rem]', sm: 'text-[0.65rem]', base: 'text-[0.75rem]', lg: 'text-[0.85rem]', xl: 'text-[0.95rem]', '2xl': 'text-[1.1rem]', '4xl': 'text-[1.35rem]' },
            [FontSize.LARGE]: { xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl', '2xl': 'text-2xl', '4xl': 'text-3xl' },
        };
        return scale[fontSize][base];
    };

    // -- Template Helper Logic --
    const isBrutal = template === TemplateType.BRUTALISM;
    const isCreative = template === TemplateType.CREATIVE;
    const isModern = template === TemplateType.MODERN;

    const brutalShadow = isBrutal ? `4px 4px 0px 0px ${color}` : 'none';

    const getTemplateTypography = () => {
        switch (template) {
            case TemplateType.BRUTALISM: return 'text-black';
            case TemplateType.CREATIVE: return 'text-slate-800';
            case TemplateType.MODERN: return 'text-slate-700';
            case TemplateType.SIMPLE: return 'text-gray-800';
            case TemplateType.PROFESSIONAL: default: return 'text-gray-800';
        }
    };

    const getHeaderStyle = () => {
        if (isBrutal) return `px-12 py-8 print:pt-2 print:pb-4 print:px-12 border-b-2 border-${color} mb-8 print:mb-4 break-inside-avoid`;
        if (isCreative) return 'px-12 py-8 print:pt-2 print:pb-4 print:px-12 text-white relative overflow-hidden break-inside-avoid';
        if (isModern) return 'bg-gray-50 border-b border-gray-200 px-12 py-8 print:pt-2 print:pb-4 print:px-12 break-inside-avoid';
        if (template === TemplateType.SIMPLE) return 'px-12 py-8 print:pt-2 print:pb-4 print:px-12 pb-4 border-b border-gray-100 break-inside-avoid';
        return 'px-12 py-8 print:pt-2 print:pb-4 print:px-12 border-b-2 border-gray-200 text-center break-inside-avoid';
    };

    const getSectionTitleStyle = () => {
        if (isBrutal) {
            return {
                className: `${getTextClass('xl')} font-bold uppercase tracking-tight mb-4 border-2 p-2 inline-block break-after-avoid break-inside-avoid`,
                decoration: (title: string) => <span style={{ borderColor: color, boxShadow: brutalShadow, border: `2px solid ${color}` }} className="px-3 py-1 bg-white block w-full">{title}</span>
            };
        }
        if (isCreative) {
            return {
                className: `${getTextClass('xl')} font-black uppercase tracking-wide mb-4 flex items-center gap-2 break-after-avoid break-inside-avoid`,
                decoration: (title: string) => <><span style={{ color }}>//</span> {title}</>
            };
        }
        if (isModern) {
            return {
                className: `${getTextClass('lg')} font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-wide break-after-avoid break-inside-avoid`,
                decoration: (title: string) => <><span className="w-1 h-4 rounded-full mr-2" style={{ backgroundColor: color }}></span>{title}</>
            };
        }
        if (template === TemplateType.SIMPLE) {
            return {
                className: `${getTextClass('xs')} font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 mt-1 break-after-avoid break-inside-avoid`,
                decoration: (title: string) => <>{title}</>
            };
        }
        // Professional
        return {
            className: `${getTextClass('sm')} font-bold uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1 mb-4 mt-2 break-after-avoid break-inside-avoid`,
            decoration: (title: string) => <span style={{ color }}>{title}</span>
        };
    };

    const typography = getTemplateTypography();
    const headerClass = getHeaderStyle();
    const sectionTitle = getSectionTitleStyle();

    // -- SUB-COMPONENTS --

    const ContactItem = ({ icon: Icon, value, invert }: { icon: React.ComponentType<any>, value: string, invert?: boolean }) => {
        if (!value) return null;
        return (
            <div className={`flex items-center gap-2 ${getTextClass('sm')} ${invert ? 'text-white/90' : 'text-gray-600'}`}>
                <Icon className="w-4 h-4" style={{ color: invert ? 'white' : color }} />
                <span className={isBrutal ? 'font-bold' : ''}>{value.replace(/^https?:\/\//, '')}</span>
            </div>
        );
    };

    const Header = () => (
        <header className={headerClass} style={isCreative ? { backgroundColor: color } : isBrutal ? { borderBottomColor: color, borderBottomWidth: '2px' } : {}}>
            {isCreative && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none"></div>
            )}
            <h1 className={`${getTextClass('4xl')} font-bold uppercase tracking-tight mb-2 leading-none ${isCreative ? 'text-white' : 'text-gray-900'}`}>
                {data.fullName}
            </h1>
            <p className={`${getTextClass('xl')} font-medium mb-4 ${isCreative ? 'text-blue-50' : 'text-gray-600'}`} style={!isCreative && template !== TemplateType.SIMPLE ? { color } : {}}>
                {data.title}
            </p>

            <div className={`flex flex-wrap gap-4 ${template === TemplateType.PROFESSIONAL ? 'justify-center' : ''}`}>
                <ContactItem icon={Mail} value={data.email} invert={isCreative} />
                <ContactItem icon={Phone} value={data.phone} invert={isCreative} />
                <ContactItem icon={Linkedin} value={data.linkedinUrl} invert={isCreative} />
                <ContactItem icon={Globe} value={data.portfolioUrl} invert={isCreative} />
            </div>
        </header>
    );

    const SummarySection = () => (
        data.summary ? (
            <section className="mb-8 break-inside-avoid">
                <h2 className={sectionTitle.className}>{sectionTitle.decoration('Profile')}</h2>
                {/* Orphans/Widows set to 3 to prevent single lines dangling */}
                <div className={`${getTextClass('sm')} leading-relaxed ${isBrutal ? 'font-medium border-l-4 pl-4' : ''}`} style={isBrutal ? { borderLeftColor: color, orphans: 3, widows: 3 } : { orphans: 3, widows: 3 }}>
                    {data.summary.split('\n').map((line, i) => (
                        <p key={i} className="mb-2">{line}</p>
                    ))}
                </div>
            </section>
        ) : null
    );

    const ExperienceSection = () => (
        <section className="mb-8">
            <h2 className={sectionTitle.className}>{sectionTitle.decoration('Experience')}</h2>
            <div className={`space-y-6 ${isModern ? 'border-l-2 border-gray-100 pl-4 ml-1' : ''}`}>
                {data.experience.map(exp => (
                    // STRICT PAGE BREAK LOGIC: 
                    // The entire experience card is treated as a single block that should avoid breaking inside.
                    // This prevents splitting between header and content, or halfway through description.
                    <div
                        key={exp.id}
                        className={`relative mb-6 break-inside-avoid page-break-inside-avoid block ${isBrutal ? 'border-2 p-4' : ''}`}
                        style={isBrutal ? { borderColor: color, boxShadow: brutalShadow } : {}}
                    >
                        {isModern && (
                            <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 border-white bg-gray-200 ring-1 ring-white"></div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                            <h3 className={`font-bold ${getTextClass('lg')} ${isBrutal ? 'uppercase' : 'text-gray-900'}`}>{exp.role}</h3>
                            <span className={`${getTextClass('sm')} ${isBrutal ? 'font-bold bg-gray-100 px-2' : 'text-gray-500'} whitespace-nowrap`}>{exp.period}</span>
                        </div>
                        <div className={`${getTextClass('sm')} font-semibold mb-2`} style={{ color: isBrutal ? 'black' : color }}>{exp.company}</div>

                        <div className={`${getTextClass('sm')} leading-relaxed text-gray-700`}>
                            {exp.description.split('\n').map((line, idx) => (
                                <div key={idx} className="mb-1 block">
                                    {line}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );

    const EducationSection = () => (
        <section className="mb-8">
            <h2 className={sectionTitle.className}>{sectionTitle.decoration('Education')}</h2>
            <div className="space-y-4">
                {data.education.map(edu => (
                    <div key={edu.id} className={`break-inside-avoid page-break-inside-avoid block ${isBrutal ? 'border-2 p-3' : ''}`} style={isBrutal ? { borderColor: color } : {}}>
                        <div className={`font-bold text-gray-900 ${getTextClass('base')}`}>{edu.school}</div>
                        <div className={`${getTextClass('sm')} text-gray-700`}>{edu.degree}</div>
                        <div className={`${getTextClass('xs')} text-gray-500 mt-1`}>{edu.year}</div>
                    </div>
                ))}
            </div>
        </section>
    );

    const SkillsSection = () => (
        <section className="mb-8">
            <h2 className={sectionTitle.className}>{sectionTitle.decoration('Skills')}</h2>
            <div className="flex flex-wrap gap-2">
                {data.skills.map(skill => (
                    <span
                        key={skill.id}
                        className={`${getTextClass('sm')} break-inside-avoid inline-block ${isBrutal
                            ? 'border-2 font-bold px-3 py-1 bg-white'
                            : isModern || isCreative
                                ? 'bg-gray-100 px-3 py-1 rounded-md'
                                : 'text-gray-700'
                            }`}
                        style={isBrutal ? { borderColor: color, boxShadow: `2px 2px 0px 0px ${color}` } : {}}
                    >
                        {!isModern && !isBrutal && !isCreative && '• '} {skill.name}
                    </span>
                ))}
            </div>
        </section>
    );

    const CompetenciesSection = () => (
        data.competencies && data.competencies.length > 0 ? (
            <section className="mb-8">
                <h2 className={sectionTitle.className}>{sectionTitle.decoration('Competencies')}</h2>
                <div className="flex flex-wrap gap-2">
                    {data.competencies.map(comp => (
                        <span key={comp.id} className={`${getTextClass('sm')} break-inside-avoid inline-block ${isBrutal ? 'border-2 px-2 py-0.5 font-bold' : 'text-gray-700 border border-gray-200 px-2 py-0.5 rounded-full bg-white'}`} style={isBrutal ? { borderColor: color } : {}}>
                            {comp.name}
                        </span>
                    ))}
                </div>
            </section>
        ) : null
    );

    // -- LAYOUT RENDERING --

    // -- LAYOUT RENDERING --

    const renderLayout = () => {
        return (
            <>
                <style>{`
                    @media print {
                        @page {
                            margin: 20mm 0mm 0mm 0mm !important; /* Top margin for 2nd+ pages (increased), no bottom footer, no side margins */
                            size: A4;
                            /* Remove browser headers and footers */
                            marks: none;
                        }
                        @page :first {
                            margin: 5mm 0mm 0mm 0mm !important; /* Small top margin on first page (reduced from 0) */
                        }
                        html, body {
                            background: white !important;
                            color: black !important;
                            width: 100% !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            overflow: visible !important;
                        }
                        /* Target the root app container if needed */
                        #root {
                            width: 100% !important;
                            background: white !important;
                        }
                        .resume-preview-container {
                            width: 100% !important;
                            max-width: none !important;
                            min-height: auto !important;
                            height: auto !important;
                            background: white !important;
                            background-image: none !important;
                            box-shadow: none !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            border: none !important;
                            overflow: visible !important;
                            display: block !important;
                        }
                        /* Adjust line height for print to be more compact */
                        .resume-preview-container p, 
                        .resume-preview-container div, 
                        .resume-preview-container span, 
                        .resume-preview-container li {
                            line-height: 1.3 !important;
                        }
                        
                        /* Ensure text is black for readability unless specific creative theme */
                        .resume-preview-container * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                        
                        /* Hide the gap simulation */
                        .resume-preview-container::before,
                        .resume-preview-container::after {
                            display: none !important;
                        }
                        
                        /* Reduce top padding on header for print (first page) */
                        .resume-preview-container > header:first-child {
                            padding-top: 0.5rem !important;
                            margin-top: 0 !important;
                            margin-bottom: 1rem !important;
                        }
                        
                        /* Add top margin for content starting on 2nd page */
                        .resume-preview-container > *:not(header) {
                            page-break-inside: avoid;
                        }
                        
                        /* Ensure no footer text appears */
                        body::after {
                            display: none !important;
                        }
                    }
                    
                    /* Additional CSS to prevent browser print headers/footers */
                    @media print {
                        @page {
                            margin: 0 !important;
                            size: A4;
                        }
                    }
                `}</style>
                <div className={`resume-preview-container mx-auto flex flex-col ${typography}`} style={a4ContainerStyles}>
                    <Header />

                    {layout === LayoutType.SINGLE_COLUMN && (
                        <div className="flex-grow px-12 py-8 pt-6 print:pt-0 print:px-12">
                            <SummarySection />
                            <ExperienceSection />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4 break-inside-avoid">
                                <EducationSection />
                                <div>
                                    <SkillsSection />
                                    <CompetenciesSection />
                                </div>
                            </div>
                        </div>
                    )}

                    {layout === LayoutType.TWO_COLUMN_LEFT && (
                        <div className="flex flex-grow items-start border-t-0" style={isBrutal ? { borderTop: `2px solid ${color}` } : {}}>
                            <aside className={`w-[32%] flex-shrink-0 px-8 py-6 print:pt-0 print:px-12 self-stretch ${isCreative || isModern ? 'bg-gray-50 print:bg-gray-50' : ''} ${isBrutal ? 'border-r-2' : 'border-r border-gray-100'}`} style={isBrutal ? { borderColor: color } : {}}>
                                <div className="space-y-6">
                                    <EducationSection />
                                    <SkillsSection />
                                    <CompetenciesSection />
                                </div>
                            </aside>
                            <main className="w-[68%] px-12 py-8 print:px-12 print:py-6">
                                <SummarySection />
                                <ExperienceSection />
                            </main>
                        </div>
                    )}

                    {layout === LayoutType.TWO_COLUMN_RIGHT && (
                        <div className="flex flex-grow items-start border-t-0" style={isBrutal ? { borderTop: `2px solid ${color}` } : {}}>
                            <main className={`w-[68%] px-12 py-8 self-stretch print:px-12 print:py-6 ${isBrutal ? 'border-r-2' : 'border-r border-gray-100'}`} style={isBrutal ? { borderColor: color } : {}}>
                                <SummarySection />
                                <ExperienceSection />
                            </main>
                            <aside className={`w-[32%] flex-shrink-0 px-8 py-6 print:pt-0 print:px-12 ${isCreative || isModern ? 'bg-gray-50 print:bg-gray-50' : ''}`}>
                                <div className="space-y-6">
                                    <EducationSection />
                                    <SkillsSection />
                                    <CompetenciesSection />
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </>
        );
    };

    return renderLayout();
};
