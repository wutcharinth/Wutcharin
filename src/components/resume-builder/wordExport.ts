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
} from 'docx';
import { saveAs } from 'file-saver';
import type { ResumeData, FontFamily } from './types';
import { LayoutType } from './types';

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
}

// Helper to create a horizontal line
const createDivider = () => new Paragraph({
    border: {
        bottom: {
            color: '999999',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
        },
    },
    spacing: { after: 200 },
});

// Helper to create section title
const createSectionTitle = (title: string, color: string, font: string) => new Paragraph({
    children: [
        new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 22,
            color: color.replace('#', ''),
            font: font,
        }),
    ],
    spacing: { before: 200, after: 100 },
    border: {
        bottom: {
            color: color.replace('#', ''),
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
        },
    },
});

// Helper to create bullet point
const createBulletPoint = (text: string, font: string) => new Paragraph({
    children: [
        new TextRun({
            text: '• ' + text,
            size: 20,
            font: font,
        }),
    ],
    spacing: { after: 50 },
    indent: { left: convertInchesToTwip(0.15) },
});

// Build header section (common for all layouts)
function buildHeader(data: ResumeData, colorHex: string, font: string): Paragraph[] {
    const header: Paragraph[] = [];
    
    // Name
    header.push(new Paragraph({
        children: [
            new TextRun({
                text: data.fullName,
                bold: true,
                size: 48,
                color: '000000',
                font: font,
            }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
    }));

    // Title
    header.push(new Paragraph({
        children: [
            new TextRun({
                text: data.title,
                size: 24,
                color: colorHex,
                font: font,
            }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
    }));

    // Contact info
    const contactParts: string[] = [];
    if (data.email) contactParts.push(data.email);
    if (data.phone) contactParts.push(data.phone);
    if (data.linkedinUrl) contactParts.push(data.linkedinUrl.replace(/^https?:\/\//, ''));
    if (data.portfolioUrl) contactParts.push(data.portfolioUrl.replace(/^https?:\/\//, ''));

    if (contactParts.length > 0) {
        header.push(new Paragraph({
            children: [
                new TextRun({
                    text: contactParts.join(' | '),
                    size: 18,
                    color: '666666',
                    font: font,
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
        }));
    }

    header.push(createDivider());
    
    return header;
}

// Build profile/summary section
function buildProfile(data: ResumeData, accentColor: string, font: string): Paragraph[] {
    const content: Paragraph[] = [];
    if (data.summary && data.summary.trim()) {
        content.push(createSectionTitle('Profile', accentColor, font));
        const summaryLines = data.summary.split('\n').filter(line => line.trim());
        summaryLines.forEach(line => {
            content.push(new Paragraph({
                children: [new TextRun({ text: line, size: 20, font })],
                spacing: { after: 100 },
            }));
        });
    }
    return content;
}

// Build experience section
function buildExperience(data: ResumeData, accentColor: string, font: string): Paragraph[] {
    const colorHex = accentColor.replace('#', '');
    const content: Paragraph[] = [];
    
    if (data.experience && data.experience.length > 0) {
        content.push(createSectionTitle('Experience', accentColor, font));
        
        data.experience.forEach((exp) => {
            content.push(new Paragraph({
                children: [
                    new TextRun({ text: exp.role, bold: true, size: 22, font }),
                    new TextRun({ text: `  |  ${exp.period}`, size: 20, color: '666666', font }),
                ],
                spacing: { before: 150, after: 50 },
            }));
            
            content.push(new Paragraph({
                children: [new TextRun({ text: exp.company, size: 20, color: colorHex, italics: true, font })],
                spacing: { after: 100 },
            }));
            
            const descLines = exp.description.split('\n').filter(line => line.trim());
            descLines.forEach(line => {
                const cleanLine = line.replace(/^[\s•\-\*]+/, '').trim();
                if (cleanLine) content.push(createBulletPoint(cleanLine, font));
            });
        });
    }
    return content;
}

// Build education section
function buildEducation(data: ResumeData, accentColor: string, font: string): Paragraph[] {
    const content: Paragraph[] = [];
    
    if (data.education && data.education.length > 0) {
        content.push(createSectionTitle('Education', accentColor, font));
        
        data.education.forEach((edu) => {
            content.push(new Paragraph({
                children: [new TextRun({ text: edu.school, bold: true, size: 22, font })],
                spacing: { before: 100, after: 50 },
            }));
            content.push(new Paragraph({
                children: [
                    new TextRun({ text: edu.degree, size: 20, font }),
                    new TextRun({ text: `  |  ${edu.year}`, size: 18, color: '666666', font }),
                ],
                spacing: { after: 100 },
            }));
        });
    }
    return content;
}

// Build skills section
function buildSkills(data: ResumeData, accentColor: string, font: string): Paragraph[] {
    const content: Paragraph[] = [];
    
    if (data.skills && data.skills.length > 0) {
        content.push(createSectionTitle('Skills', accentColor, font));
        const skillsList = data.skills.map(s => s.name).join(' • ');
        content.push(new Paragraph({
            children: [new TextRun({ text: skillsList, size: 20, font })],
            spacing: { after: 100 },
        }));
    }
    return content;
}

// Build competencies section
function buildCompetencies(data: ResumeData, accentColor: string, font: string): Paragraph[] {
    const content: Paragraph[] = [];
    
    if (data.competencies && data.competencies.length > 0) {
        content.push(createSectionTitle('Competencies', accentColor, font));
        const compList = data.competencies.map(c => c.name).join(' • ');
        content.push(new Paragraph({
            children: [new TextRun({ text: compList, size: 20, font })],
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
        layout = LayoutType.SINGLE_COLUMN 
    } = options;
    const colorHex = accentColor.replace('#', '');
    const font = fontMapping[fontFamily] || 'Arial';

    // Build all content sections
    const header = buildHeader(data, colorHex, font);
    const profile = buildProfile(data, accentColor, font);
    const experience = buildExperience(data, accentColor, font);
    const education = buildEducation(data, accentColor, font);
    const skills = buildSkills(data, accentColor, font);
    const competencies = buildCompetencies(data, accentColor, font);

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
                            borders: noBorder,
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
