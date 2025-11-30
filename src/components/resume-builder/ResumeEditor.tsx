import React, { useState } from 'react';
import { AISuggestionType } from './types';
import type { ResumeData, Experience, Education } from './types';
import { Input, TextArea, Button, Card } from './UI';
import { improveTextSection } from './geminiService';
import { Plus, Trash2, Wand2, Briefcase, GraduationCap, User, Star, Award, List, AlignLeft, GripVertical } from 'lucide-react';

interface ResumeEditorProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ data, onChange }) => {
    const [activeAIField, setActiveAIField] = useState<{ path: string, text: string } | null>(null);
    const [aiLoading, setAiLoading] = useState(false);

    // Drag and Drop State
    const [draggedItem, setDraggedItem] = useState<{ type: 'experience' | 'education', index: number } | null>(null);

    const handleChange = (field: keyof ResumeData, value: ResumeData[keyof ResumeData]) => {
        onChange({ ...data, [field]: value });
    };

    const handleExperienceChange = (id: string, field: keyof Experience, value: string) => {
        const updated = data.experience.map(exp =>
            exp.id === id ? { ...exp, [field]: value } : exp
        );
        onChange({ ...data, experience: updated });
    };

    const handleEducationChange = (id: string, field: keyof Education, value: string) => {
        const updated = data.education.map(edu =>
            edu.id === id ? { ...edu, [field]: value } : edu
        );
        onChange({ ...data, education: updated });
    };

    const handleSkillChange = (id: string, name: string) => {
        const updated = data.skills.map(s => s.id === id ? { ...s, name } : s);
        onChange({ ...data, skills: updated });
    };

    const handleCompetencyChange = (id: string, name: string) => {
        const updated = (data.competencies || []).map(s => s.id === id ? { ...s, name } : s);
        onChange({ ...data, competencies: updated });
    };

    const addExperience = () => {
        const newExp: Experience = {
            id: crypto.randomUUID(),
            role: 'Job Title',
            company: 'Company Name',
            period: 'Jan 2023 - Present',
            description: '• Achieved X result by doing Y\n• Led a team of Z people'
        };
        onChange({ ...data, experience: [newExp, ...data.experience] });
    };

    const addEducation = () => {
        const newEdu: Education = {
            id: crypto.randomUUID(),
            degree: 'Degree / Major',
            school: 'University Name',
            year: '2024'
        };
        onChange({ ...data, education: [...data.education, newEdu] });
    };

    const addSkill = () => {
        onChange({ ...data, skills: [...data.skills, { id: crypto.randomUUID(), name: 'New Skill' }] });
    };

    const addCompetency = () => {
        const current = data.competencies || [];
        onChange({ ...data, competencies: [...current, { id: crypto.randomUUID(), name: 'New Competency' }] });
    };

    const removeListLocation = (listName: 'experience' | 'education' | 'skills' | 'competencies', id: string) => {
        const list = data[listName] as { id: string }[];
        const updated = list.filter(item => item.id !== id);
        onChange({ ...data, [listName]: updated });
    };

    // -- Drag and Drop Logic --
    const handleDragStart = (e: React.DragEvent, type: 'experience' | 'education', index: number) => {
        setDraggedItem({ type, index });
        // Required for Firefox
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, type: 'experience' | 'education', dropIndex: number) => {
        e.preventDefault();
        if (!draggedItem) return;
        if (draggedItem.type !== type) return; // Prevent dragging exp into edu
        if (draggedItem.index === dropIndex) return;

        const list = [...(data[type] as { id: string }[])];
        const [itemToMove] = list.splice(draggedItem.index, 1);
        list.splice(dropIndex, 0, itemToMove);

        onChange({ ...data, [type]: list });
        setDraggedItem(null);
    };

    const handleAIAssist = async (type: AISuggestionType) => {
        if (!activeAIField) return;
        setAiLoading(true);

        try {
            // Determine context from path to guide AI formatting
            let context = 'General';
            if (activeAIField.path.includes('experience')) context = 'Experience';
            else if (activeAIField.path.includes('summary')) context = 'Summary';

            const improved = await improveTextSection(activeAIField.text, type, context);

            const parts = activeAIField.path.split('.');
            if (parts.length === 1) {
                handleChange(parts[0] as keyof ResumeData, improved);
            } else if (parts.length === 3) {
                const [section, id, field] = parts;
                if (section === 'experience') {
                    handleExperienceChange(id, field as keyof Experience, improved);
                }
            }

            setActiveAIField(null);
        } catch (e) {
            console.error(e);
        } finally {
            setAiLoading(false);
        }
    };

    // Robust Text Converter
    const convertTextFormat = (text: string, targetFormat: 'bullets' | 'paragraph') => {
        if (!text) return '';

        // Normalize newlines
        const raw = text.replace(/\r\n/g, '\n').trim();
        if (!raw) return '';

        // Helper: clean a line of bullets/stars/dashes
        const cleanLine = (line: string) => line.replace(/^[\s•\-*]+/, '').trim();

        if (targetFormat === 'bullets') {
            // CONVERT TO BULLETS
            let segments: string[] = [];

            // Check if it looks like a paragraph (long text, no internal newlines or very few)
            const lines = raw.split('\n').filter(l => l.trim());
            const isParagraphLike = lines.length === 1 || (raw.length > 100 && lines.length < 3);

            if (isParagraphLike) {
                // Split by sentence boundaries: Period/Question/Exclamation followed by space
                // We use a positive lookbehind to keep the punctuation, then split on the space
                segments = raw
                    .split(/(?<=[.!?])\s+/)
                    .map(s => cleanLine(s))
                    .filter(Boolean);
            } else {
                // It's likely already a list (maybe unformatted), preserve line breaks
                segments = lines.map(l => cleanLine(l)).filter(Boolean);
            }

            // Reassemble as bullets
            return segments.map(s => `• ${s} `).join('\n');

        } else {
            // CONVERT TO PARAGRAPH
            return raw
                .split('\n')
                .map(line => {
                    let clean = cleanLine(line);
                    // Ensure it ends in punctuation if it's a complete thought and doesn't have it
                    if (clean && !clean.match(/[.!?]$/) && clean.length > 5) {
                        clean += '.';
                    }
                    return clean;
                })
                .filter(Boolean)
                .join(' ');
        }
    };

    const formatDescription = (id: string, type: 'bullets' | 'paragraph') => {
        const exp = data.experience.find(e => e.id === id);
        if (!exp) return;
        const newText = convertTextFormat(exp.description, type);
        handleExperienceChange(id, 'description', newText);
    };

    const massFormatDescription = (type: 'bullets' | 'paragraph') => {
        if (!window.confirm(`This will convert all experience descriptions to ${type === 'bullets' ? 'Bullet Points' : 'Paragraphs'}.Continue ? `)) return;

        const updatedExperience = data.experience.map(exp => ({
            ...exp,
            description: convertTextFormat(exp.description, type)
        }));

        // Using a fresh object reference to ensure React detects the change
        onChange({ ...data, experience: [...updatedExperience] });
    };

    return (
        <div className="space-y-8 pb-12">
            {/* AI Modal */}
            {activeAIField && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-zinc-900 rounded-xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 border border-zinc-800">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white">
                            <Wand2 className="w-5 h-5 text-purple-500" /> AI Writer
                        </h3>
                        <p className="text-sm mb-4 text-gray-400 bg-zinc-800 p-3 rounded-lg border border-zinc-700 italic line-clamp-3">
                            "{activeAIField.text}"
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                            {Object.values(AISuggestionType).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleAIAssist(type)}
                                    disabled={aiLoading}
                                    className="text-left px-4 py-3 rounded-lg border border-zinc-700 hover:border-purple-500/50 hover:bg-purple-900/20 transition-colors text-sm font-medium text-gray-300 flex justify-between items-center group"
                                >
                                    {type}
                                    {aiLoading && <span className="text-xs text-purple-400 animate-pulse">Thinking...</span>}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setActiveAIField(null)}
                            className="mt-4 w-full py-2 text-sm text-gray-500 hover:text-gray-300 font-medium"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Profile Header */}
            <section className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-2">
                    <User className="w-5 h-5 text-blue-500" /> Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Full Name"
                        value={data.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                    />
                    <Input
                        label="Professional Title"
                        value={data.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                    <Input
                        label="Email"
                        value={data.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                    />
                    <Input
                        label="Phone"
                        value={data.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                    />
                    <Input
                        label="LinkedIn URL"
                        value={data.linkedinUrl}
                        onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                    />
                    <Input
                        label="Portfolio URL"
                        value={data.portfolioUrl || ''}
                        onChange={(e) => handleChange('portfolioUrl', e.target.value)}
                    />
                </div>
                <TextArea
                    label="Professional Summary"
                    value={data.summary}
                    onChange={(e) => handleChange('summary', e.target.value)}
                    onAIRequest={() => setActiveAIField({ path: 'summary', text: data.summary })}
                    rows={4}
                />
            </section>

            {/* Experience */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2 flex-wrap gap-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-500" /> Experience
                    </h3>
                    <div className="flex gap-2">
                        {/* Mass Format Controls */}
                        {data.experience.length > 0 && (
                            <div className="flex bg-zinc-800 rounded-md p-1 items-center mr-2">
                                <span className="text-[10px] uppercase font-bold text-gray-500 mx-2">Format All</span>
                                <button
                                    onClick={() => massFormatDescription('bullets')}
                                    className="p-1.5 rounded bg-zinc-900 shadow-sm border border-zinc-700 text-gray-400 hover:text-blue-400 mr-1 flex items-center gap-1"
                                    title="Convert ALL to Bullets"
                                >
                                    <List size={14} />
                                    <span className="text-xs font-medium">List</span>
                                </button>
                                <button
                                    onClick={() => massFormatDescription('paragraph')}
                                    className="p-1.5 rounded bg-zinc-900 shadow-sm border border-zinc-700 text-gray-400 hover:text-blue-400 flex items-center gap-1"
                                    title="Convert ALL to Paragraphs"
                                >
                                    <AlignLeft size={14} />
                                    <span className="text-xs font-medium">Text</span>
                                </button>
                            </div>
                        )}

                        <Button variant="outline" onClick={addExperience} className="py-1 px-3 text-xs">
                            <Plus className="w-3 h-3 mr-1" /> Add Role
                        </Button>
                    </div>
                </div>

                <div className="space-y-6">
                    {data.experience.map((exp, index) => (
                        <div
                            key={exp.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, 'experience', index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, 'experience', index)}
                            className={`transition - all duration - 200 ${draggedItem?.type === 'experience' && draggedItem.index === index ? 'opacity-40 scale-[0.99]' : 'opacity-100'} `}
                        >
                            <Card className="relative group">
                                <div
                                    className="absolute top-4 -left-3 cursor-move text-gray-600 hover:text-gray-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Drag to reorder"
                                >
                                    <GripVertical className="w-5 h-5" />
                                </div>
                                <button
                                    onClick={() => removeListLocation('experience', exp.id)}
                                    className="absolute top-4 right-4 text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Remove Item"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <Input
                                        label="Job Role"
                                        value={exp.role}
                                        onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                                    />
                                    <Input
                                        label="Company"
                                        value={exp.company}
                                        onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                                    />
                                    <Input
                                        label="Period"
                                        placeholder="e.g. Jan 2020 - Present"
                                        value={exp.period}
                                        onChange={(e) => handleExperienceChange(exp.id, 'period', e.target.value)}
                                    />
                                </div>
                                <TextArea
                                    label="Description & Achievements"
                                    value={exp.description}
                                    onChange={(e) => handleExperienceChange(exp.id, 'description', e.target.value)}
                                    onAIRequest={() => setActiveAIField({ path: `experience.${exp.id}.description`, text: exp.description })}
                                    rows={5}
                                    topRight={
                                        <div className="flex bg-zinc-800 rounded-md p-0.5 border border-zinc-700">
                                            <button
                                                onClick={() => formatDescription(exp.id, 'bullets')}
                                                className="p-1 rounded hover:bg-zinc-700 hover:shadow-sm text-gray-400 hover:text-white transition-all"
                                                title="Format as Bullets"
                                            >
                                                <List size={14} />
                                            </button>
                                            <div className="w-px bg-zinc-600 my-1 mx-0.5"></div>
                                            <button
                                                onClick={() => formatDescription(exp.id, 'paragraph')}
                                                className="p-1 rounded hover:bg-zinc-700 hover:shadow-sm text-gray-400 hover:text-white transition-all"
                                                title="Format as Paragraph"
                                            >
                                                <AlignLeft size={14} />
                                            </button>
                                        </div>
                                    }
                                />
                            </Card>
                        </div>
                    ))}
                </div>
            </section>

            {/* Education */}
            <section className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-blue-500" /> Education
                    </h3>
                    <Button variant="outline" onClick={addEducation} className="py-1 px-3 text-xs">
                        <Plus className="w-3 h-3 mr-1" /> Add Education
                    </Button>
                </div>

                <div className="space-y-3">
                    {data.education.map((edu, index) => (
                        <div
                            key={edu.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, 'education', index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, 'education', index)}
                            className={`flex gap - 4 items - end bg - zinc - 900 p - 4 rounded - lg border border - zinc - 800 relative group transition - all duration - 200 ${draggedItem?.type === 'education' && draggedItem.index === index ? 'opacity-40 scale-[0.99]' : 'opacity-100'} `}
                        >
                            <div
                                className="absolute top-1/2 -translate-y-1/2 -left-3 cursor-move text-gray-600 hover:text-gray-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Drag to reorder"
                            >
                                <GripVertical className="w-4 h-4" />
                            </div>
                            <button
                                onClick={() => removeListLocation('education', edu.id)}
                                className="absolute -top-2 -right-2 bg-zinc-800 rounded-full p-1 border border-zinc-700 shadow-sm text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-10"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                            <div className="flex-1 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <Input
                                        placeholder="Degree"
                                        value={edu.degree}
                                        onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                                    />
                                    <Input
                                        placeholder="School / University"
                                        value={edu.school}
                                        onChange={(e) => handleEducationChange(edu.id, 'school', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Year"
                                        value={edu.year}
                                        onChange={(e) => handleEducationChange(edu.id, 'year', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Skills & Competencies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Hard Skills */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Star className="w-5 h-5 text-blue-500" /> Skills
                        </h3>
                        <Button variant="outline" onClick={addSkill} className="py-1 px-3 text-xs">
                            <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map(skill => (
                            <div key={skill.id} className="flex items-center">
                                <input
                                    className="bg-zinc-900 border border-zinc-700 text-white text-sm rounded-l-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 w-32"
                                    value={skill.name}
                                    onChange={(e) => handleSkillChange(skill.id, e.target.value)}
                                />
                                <button
                                    onClick={() => removeListLocation('skills', skill.id)}
                                    className="bg-zinc-800 border-y border-r border-zinc-700 rounded-r-md px-2 py-1.5 hover:bg-zinc-700 text-gray-400 hover:text-red-400"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Competencies */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Award className="w-5 h-5 text-blue-500" /> Competencies
                        </h3>
                        <Button variant="outline" onClick={addCompetency} className="py-1 px-3 text-xs">
                            <Plus className="w-3 h-3 mr-1" /> Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(data.competencies || []).map(comp => (
                            <div key={comp.id} className="flex items-center">
                                <input
                                    className="bg-zinc-900 border border-zinc-700 text-white text-sm rounded-l-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 w-32"
                                    value={comp.name}
                                    onChange={(e) => handleCompetencyChange(comp.id, e.target.value)}
                                />
                                <button
                                    onClick={() => removeListLocation('competencies', comp.id)}
                                    className="bg-zinc-800 border-y border-r border-zinc-700 rounded-r-md px-2 py-1.5 hover:bg-zinc-700 text-gray-400 hover:text-red-400"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

        </div>
    );
};
