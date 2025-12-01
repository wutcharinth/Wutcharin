import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    BorderStyle,
    SectionType,
    convertInchesToTwip,
    Table,
    TableRow,
    TableCell,
    WidthType,
    VerticalAlign,
    TableLayoutType,
    ShadingType,
} from 'docx';
import { saveAs } from 'file-saver';
import type { ResumeData, FontFamily } from './types';
import { LayoutType, TemplateType } from './types';

// Map web fonts to Word-compatible font names
const fontMapping: Record<FontFamily, string> = {
    'Inter': 'Arial',
    'Roboto': 'Arial',
    'Lora': 'Georgia',
    'Merriweather': 'Georgia',
    'Playfair Display': 'Times New Roman',
    'Space Mono': 'Courier New',
};

interface WordExportOptions {
    accentColor?: string;
    fontFamily?: FontFamily;
    layout?: LayoutType;
    template?: TemplateType;
}

// Style configuration based on template
interface StyleConfig {
    nameSize: number;
    titleSize: number;
    sectionTitleSize: number;
    bodySize: number;
    smallSize: number;
    nameColor: string;
    headerBgColor: string | null;
    headerTextColor: string;
    sectionTitleStyle: 'underline' | 'box' | 'accent' | 'simple' | 'bold';
    headerAlignment: typeof AlignmentType[keyof typeof AlignmentType];
    useBold: boolean;
    useItalics: boolean;
    bulletStyle: string;
    sectionSpacing: number;
    skillsAsBoxes: boolean;
}

function getStyleConfig(template: TemplateType, accentColor: string): StyleConfig {
    const colorHex = accentColor.replace('#', '');
    
    switch (template) {
        case TemplateType.BRUTALISM:
            return {
                nameSize: 56,
                titleSize: 24,
                sectionTitleSize: 24,
                bodySize: 20,
                smallSize: 18,
                nameColor: '000000',
                headerBgColor: null,
                headerTextColor: '000000',
                sectionTitleStyle: 'box',
                headerAlignment: AlignmentType.LEFT,
                useBold: true,
                useItalics: false,
                bulletStyle: '■',
                sectionSpacing: 300,
                skillsAsBoxes: true,
            };
        case TemplateType.CREATIVE:
            return {
                nameSize: 52,
                titleSize: 26,
                sectionTitleSize: 22,
                bodySize: 20,
                smallSize: 18,
                nameColor: 'FFFFFF',
                headerBgColor: colorHex,
                headerTextColor: 'FFFFFF',
                sectionTitleStyle: 'accent',
                headerAlignment: AlignmentType.LEFT,
                useBold: true,
                useItalics: true,
                bulletStyle: '•',
                sectionSpacing: 250,
                skillsAsBoxes: true,
            };
        case TemplateType.MODERN:
            return {
                nameSize: 48,
                titleSize: 24,
                sectionTitleSize: 22,
                bodySize: 20,
                smallSize: 18,
                nameColor: '333333',
                headerBgColor: 'F3F4F6',
                headerTextColor: '333333',
                sectionTitleStyle: 'underline',
                headerAlignment: AlignmentType.LEFT,
                useBold: true,
                useItalics: true,
                bulletStyle: '•',
                sectionSpacing: 200,
                skillsAsBoxes: true,
            };
        case TemplateType.SIMPLE:
            return {
                nameSize: 44,
                titleSize: 22,
                sectionTitleSize: 20,
                bodySize: 20,
                smallSize: 18,
                nameColor: '444444',
                headerBgColor: null,
                headerTextColor: '444444',
                sectionTitleStyle: 'simple',
                headerAlignment: AlignmentType.LEFT,
                useBold: false,
                useItalics: false,
                bulletStyle: '•',
                sectionSpacing: 150,
                skillsAsBoxes: false,
            };
        case TemplateType.PROFESSIONAL:
        default:
            return {
                nameSize: 48,
                titleSize: 24,
                sectionTitleSize: 22,
                bodySize: 20,
                smallSize: 18,
                nameColor: '000000',
                headerBgColor: null,
                headerTextColor: '000000',
                sectionTitleStyle: 'underline',
                headerAlignment: AlignmentType.CENTER,
                useBold: true,
                useItalics: true,
                bulletStyle: '•',
                sectionSpacing: 200,
                skillsAsBoxes: false,
            };
    }
}

// Create section title based on style
function createSectionTitle(
    title: string, 
    accentColor: string, 
    font: string, 
    style: StyleConfig
): Paragraph {
    const colorHex = accentColor.replace('#', '');
    
    const displayText = style.sectionTitleStyle === 'accent' 
        ? `// ${title.toUpperCase()}` 
        : title.toUpperCase();
    
    const textColor = style.sectionTitleStyle === 'simple' ? '888888' : colorHex;
    const textSize = style.sectionTitleStyle === 'simple' ? style.smallSize : style.sectionTitleSize;

    if (style.sectionTitleStyle === 'underline' || style.sectionTitleStyle === 'accent') {
        return new Paragraph({
            children: [new TextRun({
                text: displayText,
                bold: true,
                size: textSize,
                font: font,
                color: textColor,
            })],
            spacing: { before: style.sectionSpacing, after: 100 },
            border: {
                bottom: { color: colorHex, space: 1, style: BorderStyle.SINGLE, size: 6 },
            },
        });
    } else if (style.sectionTitleStyle === 'box') {
        return new Paragraph({
            children: [new TextRun({
                text: displayText,
                bold: true,
                size: textSize,
                font: font,
                color: textColor,
            })],
            spacing: { before: style.sectionSpacing, after: 100 },
            border: {
                top: { color: colorHex, space: 1, style: BorderStyle.SINGLE, size: 12 },
                bottom: { color: colorHex, space: 1, style: BorderStyle.SINGLE, size: 12 },
                left: { color: colorHex, space: 1, style: BorderStyle.SINGLE, size: 12 },
                right: { color: colorHex, space: 1, style: BorderStyle.SINGLE, size: 12 },
            },
            shading: { type: ShadingType.CLEAR, fill: 'FFFFFF' },
        });
    } else {
        return new Paragraph({
            children: [new TextRun({
                text: displayText,
                bold: style.sectionTitleStyle === 'bold',
                size: textSize,
                font: font,
                color: textColor,
            })],
            spacing: { before: style.sectionSpacing, after: 100 },
        });
    }
}

// Create bullet point based on style
function createBulletPoint(text: string, font: string, style: StyleConfig): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({
                text: `${style.bulletStyle} ${text}`,
                size: style.bodySize,
                font: font,
            }),
        ],
        spacing: { after: 50 },
        indent: { left: convertInchesToTwip(0.15) },
    });
}

// Build header section with optional background
function buildHeader(
    data: ResumeData, 
    accentColor: string, 
    font: string,
    style: StyleConfig
): (Paragraph | Table)[] {
    const colorHex = accentColor.replace('#', '');
    const content: (Paragraph | Table)[] = [];
    
    // If we have a header background, create it as a table for better control
    if (style.headerBgColor) {
        const headerTable = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            shading: { fill: style.headerBgColor, type: ShadingType.CLEAR },
                            margins: {
                                top: convertInchesToTwip(0.3),
                                bottom: convertInchesToTwip(0.3),
                                left: convertInchesToTwip(0.3),
                                right: convertInchesToTwip(0.3),
                            },
                            borders: {
                                top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                                bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                                left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                                right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                            },
                            children: [
                                // Name
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: data.fullName.toUpperCase(),
                                            bold: style.useBold,
                                            size: style.nameSize,
                                            color: style.headerTextColor,
                                            font: font,
                                        }),
                                    ],
                                    alignment: style.headerAlignment,
                                    spacing: { after: 80 },
                                }),
                                // Title
                                new Paragraph({
                                    children: [
                                        new TextRun({
                                            text: data.title,
                                            size: style.titleSize,
                                            color: style.headerTextColor,
                                            font: font,
                                            italics: style.useItalics,
                                        }),
                                    ],
                                    alignment: style.headerAlignment,
                                    spacing: { after: 80 },
                                }),
                                // Contact info with icons (using Unicode symbols)
                                new Paragraph({
                                    children: buildContactRuns(data, style, font, accentColor),
                                    alignment: style.headerAlignment,
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        });
        content.push(headerTable);
        content.push(new Paragraph({ spacing: { after: 200 } })); // Spacer
    } else {
        // Regular header without background
        content.push(new Paragraph({
            children: [
                new TextRun({
                    text: data.fullName.toUpperCase(),
                    bold: style.useBold,
                    size: style.nameSize,
                    color: style.nameColor,
                    font: font,
                }),
            ],
            alignment: style.headerAlignment,
            spacing: { after: 100 },
        }));

        content.push(new Paragraph({
            children: [
                new TextRun({
                    text: data.title,
                    size: style.titleSize,
                    color: colorHex,
                    font: font,
                    italics: style.useItalics,
                }),
            ],
            alignment: style.headerAlignment,
            spacing: { after: 100 },
        }));

        // Contact info
        const contactParts: string[] = [];
        if (data.email) contactParts.push(`✉ ${data.email}`);
        if (data.phone) contactParts.push(`☎ ${data.phone}`);
        if (data.linkedinUrl) contactParts.push(`🔗 ${data.linkedinUrl.replace(/^https?:\/\//, '')}`);
        if (data.portfolioUrl) contactParts.push(`🌐 ${data.portfolioUrl.replace(/^https?:\/\//, '')}`);

        if (contactParts.length > 0) {
            content.push(new Paragraph({
                children: [
                    new TextRun({
                        text: contactParts.join('   '),
                        size: style.smallSize,
                        color: '666666',
                        font: font,
                    }),
                ],
                alignment: style.headerAlignment,
                spacing: { after: 200 },
            }));
        }

        // Divider
        content.push(new Paragraph({
            border: {
                bottom: { color: colorHex, space: 1, style: BorderStyle.SINGLE, size: 6 },
            },
            spacing: { after: 200 },
        }));
    }
    
    return content;
}

// Build contact info with icons (icons use accent color)
function buildContactRuns(data: ResumeData, style: StyleConfig, font: string, accentColor: string): TextRun[] {
    const runs: TextRun[] = [];
    const separator = '    ';
    const iconColor = style.headerBgColor ? style.headerTextColor : accentColor.replace('#', '');
    const textColor = style.headerTextColor;
    
    if (data.linkedinUrl) {
        runs.push(new TextRun({
            text: `in `,
            size: style.smallSize,
            color: iconColor,
            font: 'Arial',
            bold: true,
        }));
        runs.push(new TextRun({
            text: data.linkedinUrl.replace(/^https?:\/\//, ''),
            size: style.smallSize,
            color: textColor,
            font: font,
        }));
    }
    if (data.portfolioUrl) {
        if (runs.length > 0) runs.push(new TextRun({ text: separator, size: style.smallSize }));
        runs.push(new TextRun({
            text: `⊕ `,
            size: style.smallSize,
            color: iconColor,
            font: 'Arial',
        }));
        runs.push(new TextRun({
            text: data.portfolioUrl.replace(/^https?:\/\//, ''),
            size: style.smallSize,
            color: textColor,
            font: font,
        }));
    }
    if (data.email) {
        if (runs.length > 0) runs.push(new TextRun({ text: separator, size: style.smallSize }));
        runs.push(new TextRun({
            text: `✉ `,
            size: style.smallSize,
            color: iconColor,
            font: 'Arial',
        }));
        runs.push(new TextRun({
            text: data.email,
            size: style.smallSize,
            color: textColor,
            font: font,
        }));
    }
    if (data.phone) {
        if (runs.length > 0) runs.push(new TextRun({ text: separator, size: style.smallSize }));
        runs.push(new TextRun({
            text: `☎ `,
            size: style.smallSize,
            color: iconColor,
            font: 'Arial',
        }));
        runs.push(new TextRun({
            text: data.phone,
            size: style.smallSize,
            color: textColor,
            font: font,
        }));
    }
    
    return runs;
}

// Build profile/summary section
function buildProfile(
    data: ResumeData, 
    accentColor: string, 
    font: string,
    style: StyleConfig
): Paragraph[] {
    const content: Paragraph[] = [];
    if (data.summary && data.summary.trim()) {
        content.push(createSectionTitle('Profile', accentColor, font, style));
        const summaryLines = data.summary.split('\n').filter(line => line.trim());
        summaryLines.forEach(line => {
            content.push(new Paragraph({
                children: [new TextRun({ text: line, size: style.bodySize, font })],
                spacing: { after: 100 },
            }));
        });
    }
    return content;
}

// Build experience section
function buildExperience(
    data: ResumeData, 
    accentColor: string, 
    font: string,
    style: StyleConfig
): Paragraph[] {
    const colorHex = accentColor.replace('#', '');
    const content: Paragraph[] = [];
    
    if (data.experience && data.experience.length > 0) {
        content.push(createSectionTitle('Experience', accentColor, font, style));
        
        data.experience.forEach((exp) => {
            content.push(new Paragraph({
                children: [
                    new TextRun({ 
                        text: exp.role, 
                        bold: style.useBold, 
                        size: style.sectionTitleSize, 
                        font,
                        allCaps: style.sectionTitleStyle === 'box',
                    }),
                    new TextRun({ 
                        text: `   |   ${exp.period}`, 
                        size: style.bodySize, 
                        color: '888888', 
                        font 
                    }),
                ],
                spacing: { before: 150, after: 50 },
            }));
            
            content.push(new Paragraph({
                children: [new TextRun({ 
                    text: exp.company, 
                    size: style.bodySize, 
                    color: colorHex, 
                    italics: style.useItalics, 
                    font 
                })],
                spacing: { after: 100 },
            }));
            
            const descLines = exp.description.split('\n').filter(line => line.trim());
            descLines.forEach(line => {
                const cleanLine = line.replace(/^[\s•\-\*→■]+/, '').trim();
                if (cleanLine) content.push(createBulletPoint(cleanLine, font, style));
            });
        });
    }
    return content;
}

// Build education section
function buildEducation(
    data: ResumeData, 
    accentColor: string, 
    font: string,
    style: StyleConfig
): Paragraph[] {
    const content: Paragraph[] = [];
    
    if (data.education && data.education.length > 0) {
        content.push(createSectionTitle('Education', accentColor, font, style));
        
        data.education.forEach((edu) => {
            content.push(new Paragraph({
                children: [new TextRun({ 
                    text: edu.school, 
                    bold: style.useBold, 
                    size: style.sectionTitleSize - 2, 
                    font,
                })],
                spacing: { before: 100, after: 30 },
            }));
            content.push(new Paragraph({
                children: [new TextRun({ text: edu.degree, size: style.bodySize, font })],
                spacing: { after: 30 },
            }));
            content.push(new Paragraph({
                children: [new TextRun({ text: edu.year, size: style.smallSize, color: '888888', font })],
                spacing: { after: 100 },
            }));
        });
    }
    return content;
}

// Build skills section with bubble/pill styling
function buildSkills(
    data: ResumeData, 
    accentColor: string, 
    font: string,
    style: StyleConfig
): (Paragraph | Table)[] {
    const content: (Paragraph | Table)[] = [];
    
    if (data.skills && data.skills.length > 0) {
        content.push(createSectionTitle('Skills', accentColor, font, style));
        
        if (style.skillsAsBoxes) {
            // Create skills as inline bubble/pill style using a flow table
            // Each skill gets its own row with a pill-like appearance
            const skillRows: TableRow[] = [];
            
            // Group skills in rows of 2 for better layout
            for (let i = 0; i < data.skills.length; i += 2) {
                const skill1 = data.skills[i];
                const skill2 = data.skills[i + 1];
                
                const cells: TableCell[] = [
                    // First skill pill
                    new TableCell({
                        width: { size: 48, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                            bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                            left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                            right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ 
                                        text: `  ${skill1.name}  `, 
                                        size: style.bodySize - 2, 
                                        font,
                                        shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
                                    }),
                                ],
                                spacing: { after: 80 },
                                shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
                            }),
                        ],
                        margins: {
                            top: convertInchesToTwip(0.03),
                            bottom: convertInchesToTwip(0.03),
                            left: convertInchesToTwip(0.02),
                            right: convertInchesToTwip(0.05),
                        },
                    }),
                ];
                
                // Second skill pill (if exists)
                if (skill2) {
                    cells.push(new TableCell({
                        width: { size: 48, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                            bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                            left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                            right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                        },
                        children: [
                            new Paragraph({
                                children: [
                                    new TextRun({ 
                                        text: `  ${skill2.name}  `, 
                                        size: style.bodySize - 2, 
                                        font,
                                        shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
                                    }),
                                ],
                                spacing: { after: 80 },
                                shading: { fill: 'F3F4F6', type: ShadingType.CLEAR },
                            }),
                        ],
                        margins: {
                            top: convertInchesToTwip(0.03),
                            bottom: convertInchesToTwip(0.03),
                            left: convertInchesToTwip(0.05),
                            right: convertInchesToTwip(0.02),
                        },
                    }));
                } else {
                    // Empty cell
                    cells.push(new TableCell({
                        width: { size: 48, type: WidthType.PERCENTAGE },
                        borders: {
                            top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                            bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                            left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                            right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
                        },
                        children: [new Paragraph({})],
                    }));
                }
                
                skillRows.push(new TableRow({ children: cells }));
            }
            
            content.push(new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: skillRows,
            }));
        } else {
            // Simple list
            const separator = ' • ';
            const skillsList = data.skills.map(s => s.name).join(separator);
            content.push(new Paragraph({
                children: [new TextRun({ text: skillsList, size: style.bodySize, font })],
                spacing: { after: 100 },
            }));
        }
    }
    return content;
}

// Build competencies section
function buildCompetencies(
    data: ResumeData, 
    accentColor: string, 
    font: string,
    style: StyleConfig
): Paragraph[] {
    const content: Paragraph[] = [];
    
    if (data.competencies && data.competencies.length > 0) {
        content.push(createSectionTitle('Competencies', accentColor, font, style));
        const separator = ' • ';
        const compList = data.competencies.map(c => c.name).join(separator);
        content.push(new Paragraph({
            children: [new TextRun({ text: compList, size: style.bodySize, font })],
            spacing: { after: 100 },
        }));
    }
    return content;
}

export async function exportToWord(
    data: ResumeData, 
    options: WordExportOptions = {}
): Promise<void> {
    const { 
        accentColor = '#2563EB', 
        fontFamily = 'Inter',
        layout = LayoutType.SINGLE_COLUMN,
        template = TemplateType.PROFESSIONAL,
    } = options;
    
    const font = fontMapping[fontFamily] || 'Arial';
    const style = getStyleConfig(template, accentColor);

    // Build all content sections
    const header = buildHeader(data, accentColor, font, style);
    const profile = buildProfile(data, accentColor, font, style);
    const experience = buildExperience(data, accentColor, font, style);
    const education = buildEducation(data, accentColor, font, style);
    const skills = buildSkills(data, accentColor, font, style);
    const competencies = buildCompetencies(data, accentColor, font, style);

    let documentChildren: (Paragraph | Table)[] = [];

    // Add header (always full width)
    documentChildren.push(...header);

    if (layout === LayoutType.SINGLE_COLUMN) {
        documentChildren.push(...profile);
        documentChildren.push(...experience);
        documentChildren.push(...education);
        documentChildren.push(...skills);
        documentChildren.push(...competencies);
    } else {
        // Two-column layout using a table
        const sidebarContent = [...education, ...skills, ...competencies];
        const mainContent = [...profile, ...experience];
        
        const leftContent = layout === LayoutType.TWO_COLUMN_LEFT ? sidebarContent : mainContent;
        const rightContent = layout === LayoutType.TWO_COLUMN_LEFT ? mainContent : sidebarContent;
        const leftWidth = layout === LayoutType.TWO_COLUMN_LEFT ? 32 : 65;
        const rightWidth = layout === LayoutType.TWO_COLUMN_LEFT ? 65 : 32;

        const noBorder = {
            top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        };

        // Sidebar gets subtle light gray background
        const sidebarShading = { fill: 'F9FAFB', type: ShadingType.CLEAR };
        
        // Determine which column is the sidebar
        const isSidebarLeft = layout === LayoutType.TWO_COLUMN_LEFT;

        const table = new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            layout: TableLayoutType.FIXED,
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: leftWidth, type: WidthType.PERCENTAGE },
                            children: leftContent.length > 0 ? leftContent : [new Paragraph({})],
                            verticalAlign: VerticalAlign.TOP,
                            borders: noBorder,
                            shading: isSidebarLeft ? sidebarShading : undefined,
                            margins: {
                                top: convertInchesToTwip(0.15),
                                bottom: convertInchesToTwip(0.15),
                                left: convertInchesToTwip(0.15),
                                right: convertInchesToTwip(0.15),
                            },
                        }),
                        new TableCell({
                            width: { size: rightWidth, type: WidthType.PERCENTAGE },
                            children: rightContent.length > 0 ? rightContent : [new Paragraph({})],
                            verticalAlign: VerticalAlign.TOP,
                            borders: noBorder,
                            shading: !isSidebarLeft ? sidebarShading : undefined,
                            margins: {
                                top: convertInchesToTwip(0.15),
                                bottom: convertInchesToTwip(0.15),
                                left: convertInchesToTwip(0.15),
                                right: convertInchesToTwip(0.15),
                            },
                        }),
                    ],
                }),
            ],
        });

        documentChildren.push(table);
    }

    // Create the document
    const doc = new Document({
        sections: [
            {
                properties: {
                    type: SectionType.CONTINUOUS,
                    page: {
                        margin: {
                            top: convertInchesToTwip(0.4),
                            right: convertInchesToTwip(0.4),
                            bottom: convertInchesToTwip(0.4),
                            left: convertInchesToTwip(0.4),
                        },
                    },
                },
                children: documentChildren,
            },
        ],
    });

    // Generate and save
    const blob = await Packer.toBlob(doc);
    const fileName = `${data.fullName.replace(/\s+/g, '_')}_Resume.docx`;
    saveAs(blob, fileName);
}
