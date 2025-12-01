import html2pdf from 'html2pdf.js';
import type { ResumeData } from './types';

interface PDFExportOptions {
    filename?: string;
}

/**
 * Export the resume preview as a PDF file
 * This captures the exact visual appearance of the preview
 */
export async function exportToPDF(
    element: HTMLElement,
    data: ResumeData,
    options: PDFExportOptions = {}
): Promise<void> {
    const { filename } = options;
    const fileName = filename || `${data.fullName.replace(/\s+/g, '_')}_Resume.pdf`;

    // Configure html2pdf options for best quality A4 output
    const pdfOptions = {
        margin: 0,
        filename: fileName,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
            scale: 2, // Higher scale for better quality
            useCORS: true,
            letterRendering: true,
            logging: false,
            windowWidth: 794, // A4 width in pixels at 96dpi
        },
        jsPDF: {
            unit: 'mm' as const,
            format: 'a4' as const,
            orientation: 'portrait' as const,
        },
        pagebreak: {
            mode: ['avoid-all', 'css', 'legacy'] as ('avoid-all' | 'css' | 'legacy')[],
            before: '.page-break-before',
            after: '.page-break-after',
            avoid: ['section', '.break-inside-avoid'],
        },
    };

    try {
        // Clone the element to avoid modifying the original
        const clonedElement = element.cloneNode(true) as HTMLElement;
        
        // Remove page break indicators and page count indicator for PDF
        const indicators = clonedElement.querySelectorAll('.print\\:hidden');
        indicators.forEach(el => el.remove());
        
        // Reset some styles for PDF generation
        clonedElement.style.width = '210mm';
        clonedElement.style.backgroundColor = 'white';
        clonedElement.style.boxShadow = 'none';
        
        // Generate PDF
        await html2pdf()
            .set(pdfOptions)
            .from(clonedElement)
            .save();
            
    } catch (error) {
        console.error('PDF export failed:', error);
        throw new Error('Failed to generate PDF. Please try again.');
    }
}

/**
 * Alternative: Use browser print dialog for PDF
 * This gives users more control over print settings
 */
export function printResume(): void {
    // Trigger browser print dialog
    window.print();
}

