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
    sectionTitleStyle: 'underline' | 'box' | 'accent' | 'simple' | 'bold';
    headerAlignment: typeof AlignmentType[keyof typeof AlignmentType];
    useBold: boolean;
    useItalics: boolean;
    bulletStyle: string;
    sectionSpacing: number;
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
                sectionTitleStyle: 'box',
                headerAlignment: AlignmentType.LEFT,
                useBold: true,
                useItalics: false,
                bulletStyle: '■',
                sectionSpacing: 300,
            };
        case TemplateType.CREATIVE:
            return {
                nameSize: 52,
                titleSize: 26,
                sectionTitleSize: 22,
                bodySize: 20,
                smallSize: 18,
                nameColor: colorHex,
                sectionTitleStyle: 'accent',
                headerAlignment: AlignmentType.LEFT,
                useBold: true,
                useItalics: true,
                bulletStyle: '→',
                sectionSpacing: 250,
            };
        case TemplateType.MODERN:
            return {
                nameSize: 48,
                titleSize: 24,
                sectionTitleSize: 22,
                bodySize: 20,
                smallSize: 18,
                nameColor: '333333',
                sectionTitleStyle: 'underline',
                headerAlignment: AlignmentType.LEFT,
                useBold: true,
                useItalics: true,
                bulletStyle: '•',
                sectionSpacing: 200,
            };
        case TemplateType.SIMPLE:
            return {
                nameSize: 44,
                titleSize: 22,
                sectionTitleSize: 20,
                bodySize: 20,
                smallSize: 18,
                nameColor: '444444',
                sectionTitleStyle: 'simple',
                headerAlignment: AlignmentType.LEFT,
                useBold: false,
                useItalics: false,
                bulletStyle: '•',
                sectionSpacing: 150,
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
                sectionTitleStyle: 'underline',
                headerAlignment: AlignmentType.CENTER,
                useBold: true,
                useItalics: true,
                bulletStyle: '•',
                sectionSpacing: 200,
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
    
    // Determine text and styling based on template
    const displayText = style.sectionTitleStyle === 'accent' 
        ? `// ${title.toUpperCase()}` 
        : title.toUpperCase();
    
    const textColor = style.sectionTitleStyle === 'simple' ? '888888' : colorHex;
    const textSize = style.sectionTitleStyle === 'simple' ? style.smallSize : style.sectionTitleSize;

    // Apply different border/decoration styles
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
        // Simple or bold style - no border
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

// Build header section
function buildHeader(
    data: ResumeData, 
    accentColor: string, 
    font: string,
    style: StyleConfig
): Paragraph[] {
    const colorHex = accentColor.replace('#', '');
    const header: Paragraph[] = [];
    
    // Name
    header.push(new Paragraph({
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

    // Title
    header.push(new Paragraph({
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
    if (data.email) contactParts.push(data.email);
    if (data.phone) contactParts.push(data.phone);
    if (data.linkedinUrl) contactParts.push(data.linkedinUrl.replace(/^https?:\/\//, ''));
    if (data.portfolioUrl) contactParts.push(data.portfolioUrl.replace(/^https?:\/\//, ''));

    if (contactParts.length > 0) {
        const separator = style.sectionTitleStyle === 'box' ? ' ■ ' : ' | ';
        header.push(new Paragraph({
            children: [
                new TextRun({
                    text: contactParts.join(separator),
                    size: style.smallSize,
                    color: '666666',
                    font: font,
                }),
            ],
            alignment: style.headerAlignment,
            spacing: { after: 200 },
        }));
    }

    // Divider (except for brutalism which uses box style)
    if (style.sectionTitleStyle !== 'box') {
        header.push(new Paragraph({
            border: {
                bottom: { color: colorHex, space: 1, style: BorderStyle.SINGLE, size: 6 },
            },
            spacing: { after: 200 },
        }));
    } else {
        header.push(new Paragraph({
            border: {
                bottom: { color: '000000', space: 1, style: BorderStyle.SINGLE, size: 12 },
            },
            spacing: { after: 200 },
        }));
    }
    
    return header;
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
            // Role and Period
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
                        text: `  |  ${exp.period}`, 
                        size: style.bodySize, 
                        color: '666666', 
                        font 
                    }),
                ],
                spacing: { before: 150, after: 50 },
            }));
            
            // Company
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
            
            // Description bullets
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
                    size: style.sectionTitleSize, 
                    font,
                    allCaps: style.sectionTitleStyle === 'box',
                })],
                spacing: { before: 100, after: 50 },
            }));
            content.push(new Paragraph({
                children: [
                    new TextRun({ text: edu.degree, size: style.bodySize, font }),
                    new TextRun({ text: `  |  ${edu.year}`, size: style.smallSize, color: '666666', font }),
                ],
                spacing: { after: 100 },
            }));
        });
    }
    return content;
}

// Build skills section
function buildSkills(
    data: ResumeData, 
    accentColor: string, 
    font: string,
    style: StyleConfig
): Paragraph[] {
    const content: Paragraph[] = [];
    
    if (data.skills && data.skills.length > 0) {
        content.push(createSectionTitle('Skills', accentColor, font, style));
        const separator = style.sectionTitleStyle === 'box' ? ' ■ ' : ' • ';
        const skillsList = data.skills.map(s => s.name).join(separator);
        content.push(new Paragraph({
            children: [new TextRun({ text: skillsList, size: style.bodySize, font })],
            spacing: { after: 100 },
        }));
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
        const separator = style.sectionTitleStyle === 'box' ? ' ■ ' : ' • ';
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
        // Single column: All content in sequence
        documentChildren.push(...profile);
        documentChildren.push(...experience);
        documentChildren.push(...education);
        documentChildren.push(...skills);
        documentChildren.push(...competencies);
    } else {
        // Two-column layout using a table
        const sidebarContent = [...education, ...skills, ...competencies];
        const mainContent = [...profile, ...experience];
        
        // Determine column order based on layout
        const leftContent = layout === LayoutType.TWO_COLUMN_LEFT ? sidebarContent : mainContent;
        const rightContent = layout === LayoutType.TWO_COLUMN_LEFT ? mainContent : sidebarContent;
        const leftWidth = layout === LayoutType.TWO_COLUMN_LEFT ? 30 : 65;
        const rightWidth = layout === LayoutType.TWO_COLUMN_LEFT ? 65 : 30;

        // Create invisible border style
        const noBorder = {
            top: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            left: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            right: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
        };

        // For brutalism, add visible border between columns
        const separatorBorder = style.sectionTitleStyle === 'box' ? {
            ...noBorder,
            right: { style: BorderStyle.SINGLE, size: 12, color: accentColor.replace('#', '') },
        } : noBorder;

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
                            borders: layout === LayoutType.TWO_COLUMN_LEFT ? separatorBorder : noBorder,
                            margins: {
                                top: convertInchesToTwip(0),
                                bottom: convertInchesToTwip(0),
                                left: convertInchesToTwip(0),
                                right: convertInchesToTwip(0.15),
                            },
                        }),
                        new TableCell({
                            width: { size: rightWidth, type: WidthType.PERCENTAGE },
                            children: rightContent.length > 0 ? rightContent : [new Paragraph({})],
                            verticalAlign: VerticalAlign.TOP,
                            borders: layout === LayoutType.TWO_COLUMN_RIGHT ? {
                                ...noBorder,
                                left: separatorBorder.right,
                            } : noBorder,
                            margins: {
                                top: convertInchesToTwip(0),
                                bottom: convertInchesToTwip(0),
                                left: convertInchesToTwip(0.15),
                                right: convertInchesToTwip(0),
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
                            top: convertInchesToTwip(0.5),
                            right: convertInchesToTwip(0.5),
                            bottom: convertInchesToTwip(0.5),
                            left: convertInchesToTwip(0.5),
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
