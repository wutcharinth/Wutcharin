import { saveAs } from 'file-saver';
import type { ResumeData, FontFamily } from './types';
import { TemplateType, LayoutType } from './types';

interface HTMLExportOptions {
    accentColor?: string;
    fontFamily?: FontFamily;
    template?: TemplateType;
    layout?: LayoutType;
}

/**
 * Export the resume as a standalone HTML file with embedded CSS
 * This preserves all styling and can be opened in any browser
 */
export async function exportToHTML(
    element: HTMLElement,
    data: ResumeData,
    options: HTMLExportOptions = {}
): Promise<void> {
    const {
        accentColor = '#2563EB',
        fontFamily = 'Inter',
        template = TemplateType.PROFESSIONAL,
        layout = LayoutType.SINGLE_COLUMN,
    } = options;

    // Get computed styles and clone the element
    const clonedElement = element.cloneNode(true) as HTMLElement;
    
    // Remove page break indicators and UI elements
    const indicators = clonedElement.querySelectorAll('.print\\:hidden');
    indicators.forEach(el => el.remove());
    
    // Reset container styles for standalone HTML
    clonedElement.style.width = '210mm';
    clonedElement.style.margin = '0 auto';
    clonedElement.style.backgroundColor = 'white';
    clonedElement.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';

    // Build the complete HTML document
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.fullName} - Resume</title>
    <link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* Reset & Base Styles */
        *, *::before, *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        html {
            font-size: 16px;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        body {
            font-family: "${fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.5;
            color: #1f2937;
            background-color: #f3f4f6;
            padding: 20px;
        }
        
        /* Resume Container */
        .resume-container {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        /* Typography */
        h1 { font-size: 1.5rem; font-weight: 700; text-transform: uppercase; letter-spacing: -0.025em; }
        h2 { font-size: 0.875rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 1rem; }
        h3 { font-size: 0.9rem; font-weight: 600; }
        p, span, div { font-size: 0.75rem; }
        
        /* Accent Color Variable */
        :root {
            --accent-color: ${accentColor};
        }
        
        /* Header Styles */
        .resume-header {
            padding: 1.5rem 2rem;
            ${template === TemplateType.CREATIVE ? `background-color: ${accentColor}; color: white;` : ''}
            ${template === TemplateType.MODERN ? 'background-color: #f9fafb; border-bottom: 1px solid #e5e7eb;' : ''}
            ${template === TemplateType.PROFESSIONAL ? 'border-bottom: 2px solid #e5e7eb; text-align: center;' : ''}
            ${template === TemplateType.SIMPLE ? 'border-bottom: 1px solid #f3f4f6;' : ''}
            ${template === TemplateType.BRUTALISM ? `border-bottom: 2px solid ${accentColor};` : ''}
        }
        
        .resume-header h1 {
            color: ${template === TemplateType.CREATIVE ? 'white' : '#111827'};
            margin-bottom: 0.25rem;
        }
        
        .resume-header .title {
            color: ${template === TemplateType.CREATIVE ? 'rgba(255,255,255,0.9)' : accentColor};
            font-size: 1rem;
            margin-bottom: 0.75rem;
        }
        
        .contact-info {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            ${template === TemplateType.PROFESSIONAL ? 'justify-content: center;' : ''}
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.7rem;
            color: ${template === TemplateType.CREATIVE ? 'rgba(255,255,255,0.9)' : '#6b7280'};
        }
        
        .contact-item svg {
            width: 14px;
            height: 14px;
            color: ${template === TemplateType.CREATIVE ? 'white' : accentColor};
        }
        
        /* Layout Styles */
        .resume-body {
            display: flex;
            ${layout === LayoutType.SINGLE_COLUMN ? 'flex-direction: column; padding: 1.5rem 2rem;' : ''}
        }
        
        .main-content {
            ${layout !== LayoutType.SINGLE_COLUMN ? 'flex: 1; padding: 1.5rem;' : ''}
        }
        
        .sidebar {
            ${layout === LayoutType.TWO_COLUMN_LEFT ? 'width: 32%; border-right: 1px solid #e5e7eb; padding: 1.5rem;' : ''}
            ${layout === LayoutType.TWO_COLUMN_RIGHT ? 'width: 32%; padding: 1.5rem;' : ''}
            ${(template === TemplateType.CREATIVE || template === TemplateType.MODERN) && layout !== LayoutType.SINGLE_COLUMN ? 'background-color: #f9fafb;' : ''}
        }
        
        /* Section Styles */
        section {
            margin-bottom: 1.5rem;
            break-inside: avoid;
            page-break-inside: avoid;
        }
        
        section h2 {
            color: ${accentColor};
            ${template === TemplateType.CREATIVE ? `&::before { content: "// "; }` : ''}
            ${template === TemplateType.BRUTALISM ? `border: 2px solid ${accentColor}; padding: 0.25rem 0.5rem; display: inline-block; box-shadow: 2px 2px 0 ${accentColor};` : ''}
            ${template === TemplateType.PROFESSIONAL || template === TemplateType.MODERN ? 'border-bottom: 1px solid #e5e7eb; padding-bottom: 0.25rem;' : ''}
        }
        
        /* Experience Items */
        .experience-item {
            margin-bottom: 1rem;
            ${template === TemplateType.BRUTALISM ? `border: 2px solid ${accentColor}; padding: 0.75rem; box-shadow: 3px 3px 0 ${accentColor};` : ''}
            break-inside: avoid;
        }
        
        .experience-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 0.25rem;
        }
        
        .experience-item h3 {
            color: #111827;
            ${template === TemplateType.BRUTALISM ? 'text-transform: uppercase;' : ''}
        }
        
        .experience-item .period {
            font-size: 0.7rem;
            color: #6b7280;
            ${template === TemplateType.BRUTALISM ? 'background: #f3f4f6; padding: 0.125rem 0.5rem; font-weight: 600;' : ''}
        }
        
        .experience-item .company {
            color: ${accentColor};
            font-weight: 600;
            font-size: 0.75rem;
            margin-bottom: 0.5rem;
        }
        
        .experience-item .description {
            color: #374151;
            font-size: 0.7rem;
            line-height: 1.6;
        }
        
        /* Education */
        .education-item {
            margin-bottom: 0.75rem;
            ${template === TemplateType.BRUTALISM ? `border: 2px solid ${accentColor}; padding: 0.5rem;` : ''}
        }
        
        .education-item .school {
            font-weight: 600;
            color: #111827;
        }
        
        .education-item .degree {
            color: #374151;
            font-size: 0.7rem;
        }
        
        .education-item .year {
            color: #9ca3af;
            font-size: 0.65rem;
        }
        
        /* Skills */
        .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .skill-tag {
            font-size: 0.7rem;
            ${template === TemplateType.BRUTALISM ? `border: 2px solid ${accentColor}; padding: 0.25rem 0.75rem; font-weight: 600; box-shadow: 2px 2px 0 ${accentColor};` : ''}
            ${template === TemplateType.MODERN || template === TemplateType.CREATIVE ? 'background: #f3f4f6; padding: 0.25rem 0.75rem; border-radius: 0.25rem;' : ''}
            ${template === TemplateType.SIMPLE || template === TemplateType.PROFESSIONAL ? 'color: #374151;' : ''}
        }
        
        ${template === TemplateType.SIMPLE || template === TemplateType.PROFESSIONAL ? '.skill-tag::before { content: "• "; }' : ''}
        
        /* Competencies */
        .competency-tag {
            font-size: 0.7rem;
            border: 1px solid #e5e7eb;
            padding: 0.125rem 0.5rem;
            border-radius: 9999px;
            background: white;
            ${template === TemplateType.BRUTALISM ? `border: 2px solid ${accentColor};` : ''}
        }
        
        /* Print Styles */
        @media print {
            body {
                background: white;
                padding: 0;
            }
            
            .resume-container {
                box-shadow: none;
                width: 100%;
            }
            
            @page {
                margin: 10mm;
                size: A4;
            }
            
            section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="resume-container">
        ${generateResumeHTML(data, accentColor, template, layout)}
    </div>
    
    <script>
        // Print button functionality
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                // Let browser handle print
            }
        });
    </script>
</body>
</html>`;

    // Create and download the HTML file
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const fileName = `${data.fullName.replace(/\s+/g, '_')}_Resume.html`;
    saveAs(blob, fileName);
}

/**
 * Generate the resume HTML content
 */
function generateResumeHTML(
    data: ResumeData,
    _accentColor: string, // Used in the CSS styles in exportToHTML
    template: TemplateType,
    layout: LayoutType
): string {
    const isCreative = template === TemplateType.CREATIVE;
    
    // Header section
    const headerHTML = `
        <header class="resume-header">
            <h1>${escapeHTML(data.fullName)}</h1>
            <p class="title">${escapeHTML(data.title)}</p>
            <div class="contact-info">
                ${data.email ? `<span class="contact-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>${escapeHTML(data.email)}</span>` : ''}
                ${data.phone ? `<span class="contact-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>${escapeHTML(data.phone)}</span>` : ''}
                ${data.linkedinUrl ? `<span class="contact-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>${escapeHTML(data.linkedinUrl.replace(/^https?:\/\//, ''))}</span>` : ''}
                ${data.portfolioUrl ? `<span class="contact-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>${escapeHTML(data.portfolioUrl.replace(/^https?:\/\//, ''))}</span>` : ''}
            </div>
        </header>`;

    // Summary section
    const summaryHTML = data.summary ? `
        <section>
            <h2>${isCreative ? '// ' : ''}Profile</h2>
            <div class="description">${escapeHTML(data.summary).replace(/\n/g, '<br>')}</div>
        </section>` : '';

    // Experience section
    const experienceHTML = `
        <section>
            <h2>${isCreative ? '// ' : ''}Experience</h2>
            ${data.experience.map(exp => `
                <div class="experience-item">
                    <div class="experience-header">
                        <h3>${escapeHTML(exp.role)}</h3>
                        <span class="period">${escapeHTML(exp.period)}</span>
                    </div>
                    <div class="company">${escapeHTML(exp.company)}</div>
                    <div class="description">${escapeHTML(exp.description).replace(/\n/g, '<br>')}</div>
                </div>
            `).join('')}
        </section>`;

    // Education section
    const educationHTML = `
        <section>
            <h2>${isCreative ? '// ' : ''}Education</h2>
            ${data.education.map(edu => `
                <div class="education-item">
                    <div class="school">${escapeHTML(edu.school)}</div>
                    <div class="degree">${escapeHTML(edu.degree)}</div>
                    <div class="year">${escapeHTML(edu.year)}</div>
                </div>
            `).join('')}
        </section>`;

    // Skills section
    const skillsHTML = `
        <section>
            <h2>${isCreative ? '// ' : ''}Skills</h2>
            <div class="skills-container">
                ${data.skills.map(skill => `<span class="skill-tag">${escapeHTML(skill.name)}</span>`).join('')}
            </div>
        </section>`;

    // Competencies section
    const competenciesHTML = data.competencies && data.competencies.length > 0 ? `
        <section>
            <h2>${isCreative ? '// ' : ''}Competencies</h2>
            <div class="skills-container">
                ${data.competencies.map(comp => `<span class="competency-tag">${escapeHTML(comp.name)}</span>`).join('')}
            </div>
        </section>` : '';

    // Assemble based on layout
    if (layout === LayoutType.SINGLE_COLUMN) {
        return `
            ${headerHTML}
            <div class="resume-body">
                ${summaryHTML}
                ${experienceHTML}
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                    <div>${educationHTML}</div>
                    <div>${skillsHTML}${competenciesHTML}</div>
                </div>
            </div>`;
    } else if (layout === LayoutType.TWO_COLUMN_LEFT) {
        return `
            ${headerHTML}
            <div class="resume-body" style="display: flex;">
                <aside class="sidebar">
                    ${educationHTML}
                    ${skillsHTML}
                    ${competenciesHTML}
                </aside>
                <main class="main-content">
                    ${summaryHTML}
                    ${experienceHTML}
                </main>
            </div>`;
    } else {
        return `
            ${headerHTML}
            <div class="resume-body" style="display: flex;">
                <main class="main-content" style="border-right: 1px solid #e5e7eb;">
                    ${summaryHTML}
                    ${experienceHTML}
                </main>
                <aside class="sidebar">
                    ${educationHTML}
                    ${skillsHTML}
                    ${competenciesHTML}
                </aside>
            </div>`;
    }
}

/**
 * Escape HTML special characters
 */
function escapeHTML(str: string): string {
    const escapeMap: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return str.replace(/[&<>"']/g, char => escapeMap[char] || char);
}

