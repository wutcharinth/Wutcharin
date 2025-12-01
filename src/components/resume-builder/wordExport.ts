import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    AlignmentType,
    BorderStyle,
    SectionType,
    convertInchesToTwip,
} from 'docx';
import { saveAs } from 'file-saver';
import type { ResumeData, FontFamily } from './types';

// Map web fonts to Word-compatible font names
const fontMapping: Record<FontFamily, string> = {
    'Inter': 'Arial', // Inter is not available in Word, use Arial as closest match
    'Roboto': 'Arial',
    'Lora': 'Georgia',
    'Merriweather': 'Georgia',
    'Playfair Display': 'Times New Roman',
    'Space Mono': 'Courier New',
};

interface WordExportOptions {
    accentColor?: string;
    fontFamily?: FontFamily;
}

// Helper to create a horizontal line
const createDivider = (_font: string) => new Paragraph({
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
            size: 22, // 11pt
            color: color.replace('#', ''),
            font: font,
        }),
    ],
    spacing: { before: 300, after: 100 },
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
            size: 20, // 10pt
            font: font,
        }),
    ],
    spacing: { after: 50 },
    indent: { left: convertInchesToTwip(0.2) },
});

export async function exportToWord(
    data: ResumeData, 
    options: WordExportOptions = {}
): Promise<void> {
    const { accentColor = '#2563EB', fontFamily = 'Inter' } = options;
    const colorHex = accentColor.replace('#', '');
    const font = fontMapping[fontFamily] || 'Arial';

    // Build document sections
    const children: Paragraph[] = [];

    // ========== HEADER ==========
    // Name
    children.push(new Paragraph({
        children: [
            new TextRun({
                text: data.fullName,
                bold: true,
                size: 48, // 24pt
                color: '000000',
                font: font,
            }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
    }));

    // Title
    children.push(new Paragraph({
        children: [
            new TextRun({
                text: data.title,
                size: 24, // 12pt
                color: colorHex,
                font: font,
            }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
    }));

    // Contact info line
    const contactParts: string[] = [];
    if (data.email) contactParts.push(data.email);
    if (data.phone) contactParts.push(data.phone);
    if (data.linkedinUrl) contactParts.push(data.linkedinUrl.replace(/^https?:\/\//, ''));
    if (data.portfolioUrl) contactParts.push(data.portfolioUrl.replace(/^https?:\/\//, ''));

    if (contactParts.length > 0) {
        children.push(new Paragraph({
            children: [
                new TextRun({
                    text: contactParts.join(' | '),
                    size: 18, // 9pt
                    color: '666666',
                    font: font,
                }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
        }));
    }

    children.push(createDivider(font));

    // ========== PROFILE/SUMMARY ==========
    if (data.summary && data.summary.trim()) {
        children.push(createSectionTitle('Profile', accentColor, font));
        
        // Split summary by newlines and add each as a paragraph
        const summaryLines = data.summary.split('\n').filter(line => line.trim());
        summaryLines.forEach(line => {
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: line,
                        size: 20, // 10pt
                        font: font,
                    }),
                ],
                spacing: { after: 100 },
            }));
        });
    }

    // ========== EXPERIENCE ==========
    if (data.experience && data.experience.length > 0) {
        children.push(createSectionTitle('Experience', accentColor, font));

        data.experience.forEach((exp) => {
            // Role and Period
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: exp.role,
                        bold: true,
                        size: 22, // 11pt
                        font: font,
                    }),
                    new TextRun({
                        text: `  |  ${exp.period}`,
                        size: 20,
                        color: '666666',
                        font: font,
                    }),
                ],
                spacing: { before: 150, after: 50 },
            }));

            // Company
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: exp.company,
                        size: 20,
                        color: colorHex,
                        italics: true,
                        font: font,
                    }),
                ],
                spacing: { after: 100 },
            }));

            // Description bullets
            const descLines = exp.description.split('\n').filter(line => line.trim());
            descLines.forEach(line => {
                // Remove leading bullet/dash if present
                const cleanLine = line.replace(/^[\s•\-\*]+/, '').trim();
                if (cleanLine) {
                    children.push(createBulletPoint(cleanLine, font));
                }
            });
        });
    }

    // ========== EDUCATION ==========
    if (data.education && data.education.length > 0) {
        children.push(createSectionTitle('Education', accentColor, font));

        data.education.forEach((edu) => {
            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: edu.school,
                        bold: true,
                        size: 22,
                        font: font,
                    }),
                ],
                spacing: { before: 100, after: 50 },
            }));

            children.push(new Paragraph({
                children: [
                    new TextRun({
                        text: edu.degree,
                        size: 20,
                        font: font,
                    }),
                    new TextRun({
                        text: `  |  ${edu.year}`,
                        size: 18,
                        color: '666666',
                        font: font,
                    }),
                ],
                spacing: { after: 100 },
            }));
        });
    }

    // ========== SKILLS ==========
    if (data.skills && data.skills.length > 0) {
        children.push(createSectionTitle('Skills', accentColor, font));

        const skillsList = data.skills.map(s => s.name).join(' • ');
        children.push(new Paragraph({
            children: [
                new TextRun({
                    text: skillsList,
                    size: 20,
                    font: font,
                }),
            ],
            spacing: { after: 100 },
        }));
    }

    // ========== COMPETENCIES ==========
    if (data.competencies && data.competencies.length > 0) {
        children.push(createSectionTitle('Competencies', accentColor, font));

        const compList = data.competencies.map(c => c.name).join(' • ');
        children.push(new Paragraph({
            children: [
                new TextRun({
                    text: compList,
                    size: 20,
                    font: font,
                }),
            ],
            spacing: { after: 100 },
        }));
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
                children: children,
            },
        ],
    });

    // Generate and save
    const blob = await Packer.toBlob(doc);
    const fileName = `${data.fullName.replace(/\s+/g, '_')}_Resume.docx`;
    saveAs(blob, fileName);
}

