'use client';

import React from 'react';
import { ResumeData } from '@/types/resume';
import { Editable } from './Editable';
import { EditableLink } from './EditableLink';
import { Plus, Trash2, PlusCircle } from 'lucide-react';

interface ResumeCanvasProps {
  data: ResumeData;
  onChange: (updated: ResumeData) => void;
}

export const ResumeCanvas: React.FC<ResumeCanvasProps> = ({ data, onChange }) => {
  const primaryColor = data.theme.primaryColor || '#0056b3';

  // Helpers for direct updates
  const updateField = (field: keyof ResumeData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateContact = (field: keyof typeof data.contact, value: string) => {
    onChange({
      ...data,
      contact: { ...data.contact, [field]: value },
    });
  };

  // Skill Handlers
  const updateSkill = (idx: number, field: 'categoryName' | 'skillsText', val: string) => {
    const updated = [...data.skills];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...data, skills: updated });
  };

  const addSkillCategory = () => {
    const newSkill = {
      id: `sk-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      categoryName: 'New Skill Category',
      skillsText: 'Skill 1, Skill 2, Skill 3, Skill 4',
    };
    onChange({ ...data, skills: [...data.skills, newSkill] });
  };

  const removeSkillCategory = (idx: number) => {
    const updated = [...data.skills];
    updated.splice(idx, 1);
    onChange({ ...data, skills: updated });
  };

  // Project Handlers
  const updateProject = (idx: number, field: string, val: any) => {
    const updated = [...data.projects];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...data, projects: updated });
  };

  const addProject = () => {
    const newProj = {
      id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: 'Project Title',
      subtitle: 'Key Focus or Platform',
      liveDemoLabel: 'Live Demo',
      liveDemoUrl: 'https://demo.vercel.app',
      clientGithubLabel: 'Client GitHub',
      clientGithubUrl: 'https://github.com/username',
      serverGithubLabel: 'Server GitHub',
      serverGithubUrl: 'https://github.com/username',
      techStackLabel: 'Tech Stack:',
      techStackText: 'React, Next.js, Node.js, Express.js, MongoDB',
      bullets: [
        'Built full-stack application with interactive UI and optimized state workflows.',
        'Implemented authentication, API services, and modern security standards.',
      ],
    };
    onChange({ ...data, projects: [...data.projects, newProj] });
  };

  const removeProject = (idx: number) => {
    const updated = [...data.projects];
    updated.splice(idx, 1);
    onChange({ ...data, projects: updated });
  };

  const addProjectBullet = (projIdx: number) => {
    const updated = [...data.projects];
    updated[projIdx].bullets.push('Added new feature or optimization with measurable impact.');
    onChange({ ...data, projects: updated });
  };

  const updateProjectBullet = (projIdx: number, bulletIdx: number, val: string) => {
    const updated = [...data.projects];
    updated[projIdx].bullets[bulletIdx] = val;
    onChange({ ...data, projects: updated });
  };

  const removeProjectBullet = (projIdx: number, bulletIdx: number) => {
    const updated = [...data.projects];
    updated[projIdx].bullets.splice(bulletIdx, 1);
    onChange({ ...data, projects: updated });
  };

  // Education Handlers
  const updateEducation = (idx: number, field: string, val: string) => {
    const updated = [...data.education];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...data, education: updated });
  };

  const addEducation = () => {
    const newEdu = {
      id: `edu-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      degree: 'Degree Name — Major / Field of Study',
      institution: 'Institution / University Name',
      statusOrDate: 'Ongoing / Year',
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const removeEducation = (idx: number) => {
    const updated = [...data.education];
    updated.splice(idx, 1);
    onChange({ ...data, education: updated });
  };

  // Custom Section Handlers
  const addCustomSection = () => {
    const newSection = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sectionTitle: 'CUSTOM SECTION TITLE (e.g. WORK EXPERIENCE / CERTIFICATIONS)',
      content: 'Write details or achievements here...',
      bullets: ['Key highlight or achievement point...'],
    };
    onChange({
      ...data,
      customSections: [...(data.customSections || []), newSection],
    });
  };

  const updateCustomSection = (idx: number, field: string, val: any) => {
    const updated = [...(data.customSections || [])];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange({ ...data, customSections: updated });
  };

  const removeCustomSection = (idx: number) => {
    const updated = [...(data.customSections || [])];
    updated.splice(idx, 1);
    onChange({ ...data, customSections: updated });
  };

  return (
    <div
      id="resume-canvas-sheet"
      className="w-full bg-white text-slate-900 px-8 sm:px-12 py-10 shadow-2xl rounded-sm min-h-[1120px] select-text transition-all"
      style={{
        fontFamily: data.theme.fontFamily || 'Inter, sans-serif',
      }}
    >
      {/* 1. HEADER SECTION (Full Name, Title, Contact links) */}
      <header className="text-center pb-3 space-y-1 group/hdr relative">
        {/* Full Name */}
        <div className="flex items-center justify-center">
          <Editable
            value={data.fullName}
            onChange={(val) => updateField('fullName', val)}
            as="h1"
            className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 uppercase"
            placeholder="YOUR FULL NAME"
          />
        </div>

        {/* Professional Title */}
        <div className="flex items-center justify-center">
          <Editable
            value={data.title}
            onChange={(val) => updateField('title', val)}
            as="p"
            className="text-xs sm:text-sm font-bold tracking-wider uppercase"
            style={{ color: primaryColor }}
            placeholder="PROFESSIONAL TITLE / ROLE"
          />
        </div>

        {/* Contact Links Row 1: Location | Phone | Email */}
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-slate-700 pt-1">
          <Editable
            value={data.contact.location}
            onChange={(val) => updateContact('location', val)}
            placeholder="Location"
          />
          <span>|</span>
          <Editable
            value={data.contact.phone}
            onChange={(val) => updateContact('phone', val)}
            placeholder="Phone Number"
          />
          <span>|</span>
          <Editable
            value={data.contact.email}
            onChange={(val) => updateContact('email', val)}
            placeholder="Email Address"
          />
        </div>

        {/* Contact Links Row 2: Portfolio, LinkedIn, GitHub with 100% Editable Labels and Links */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-slate-700 pt-0.5">
          {/* Portfolio */}
          <div className="inline-flex items-center gap-1">
            <Editable
              value={data.contact.portfolioLabel || 'Portfolio:'}
              onChange={(val) => updateContact('portfolioLabel', val)}
              as="span"
              className="font-semibold text-slate-800"
              placeholder="Portfolio:"
            />
            <EditableLink
              label={data.contact.portfolio || 'devkhalid-chi.vercel.app'}
              url={data.contact.portfolioUrl || 'https://devkhalid-chi.vercel.app'}
              onChangeLabel={(val) => updateContact('portfolio', val)}
              onChangeUrl={(val) => updateContact('portfolioUrl', val)}
            />
          </div>

          <span>|</span>

          {/* LinkedIn */}
          <div className="inline-flex items-center gap-1">
            <Editable
              value={data.contact.linkedinLabel || 'LinkedIn:'}
              onChange={(val) => updateContact('linkedinLabel', val)}
              as="span"
              className="font-semibold text-slate-800"
              placeholder="LinkedIn:"
            />
            <EditableLink
              label={data.contact.linkedin || 'linkedin.com/in/khalid2004'}
              url={data.contact.linkedinUrl || 'https://linkedin.com/in/khalid2004'}
              onChangeLabel={(val) => updateContact('linkedin', val)}
              onChangeUrl={(val) => updateContact('linkedinUrl', val)}
            />
          </div>

          <span>|</span>

          {/* GitHub */}
          <div className="inline-flex items-center gap-1">
            <Editable
              value={data.contact.githubLabel || 'GitHub:'}
              onChange={(val) => updateContact('githubLabel', val)}
              as="span"
              className="font-semibold text-slate-800"
              placeholder="GitHub:"
            />
            <EditableLink
              label={data.contact.github || 'github.com/khalid66527'}
              url={data.contact.githubUrl || 'https://github.com/khalid66527'}
              onChangeLabel={(val) => updateContact('github', val)}
              onChangeUrl={(val) => updateContact('githubUrl', val)}
            />
          </div>
        </div>
      </header>

      {/* 2. PROFESSIONAL SUMMARY */}
      <section className="mt-4">
        <div className="border-b border-slate-300 pb-0.5 mb-1.5 flex items-center justify-between">
          <Editable
            value={data.summaryTitle || 'PROFESSIONAL SUMMARY'}
            onChange={(val) => updateField('summaryTitle', val)}
            as="h2"
            className="text-xs font-black uppercase tracking-wider text-slate-900"
            placeholder="PROFESSIONAL SUMMARY"
          />
        </div>
        <Editable
          value={data.summary}
          onChange={(val) => updateField('summary', val)}
          as="p"
          className="text-xs leading-relaxed text-slate-800 text-justify"
          placeholder="Write your summary here..."
        />
      </section>

      {/* 3. TECHNICAL SKILLS */}
      <section className="mt-4">
        <div className="flex justify-between items-center border-b border-slate-300 pb-0.5 mb-2">
          <Editable
            value={data.skillsTitle || 'TECHNICAL SKILLS'}
            onChange={(val) => updateField('skillsTitle', val)}
            as="h2"
            className="text-xs font-black uppercase tracking-wider text-slate-900"
            placeholder="TECHNICAL SKILLS"
          />
          <button
            type="button"
            onClick={addSkillCategory}
            className="no-print text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5"
          >
            <Plus className="w-3 h-3" /> Add Category
          </button>
        </div>

        <div className="space-y-1 text-xs">
          {data.skills.map((sk, idx) => (
            <div key={sk.id ? `${sk.id}-${idx}` : `sk-${idx}`} className="group/sk flex items-start justify-between gap-2">
              <div className="flex-1 leading-snug">
                <Editable
                  value={sk.categoryName}
                  onChange={(val) => updateSkill(idx, 'categoryName', val)}
                  as="span"
                  className="font-bold text-slate-900 mr-1"
                  placeholder="Category Name"
                />
                <span className="font-bold mr-1.5">:</span>
                <Editable
                  value={sk.skillsText}
                  onChange={(val) => updateSkill(idx, 'skillsText', val)}
                  as="span"
                  className="text-slate-800"
                  placeholder="Skill 1, Skill 2, Skill 3..."
                />
              </div>
              {data.skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSkillCategory(idx)}
                  className="no-print opacity-0 group-hover/sk:opacity-100 text-slate-400 hover:text-red-500 p-0.5"
                  title="Remove Category"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PROJECTS & EXPERIENCE */}
      <section className="mt-4">
        <div className="flex justify-between items-center border-b border-slate-300 pb-0.5 mb-2.5">
          <Editable
            value={data.projectsTitle || 'FEATURED PROJECTS & EXPERIENCE'}
            onChange={(val) => updateField('projectsTitle', val)}
            as="h2"
            className="text-xs font-black uppercase tracking-wider text-slate-900"
            placeholder="FEATURED PROJECTS & EXPERIENCE"
          />
          <button
            type="button"
            onClick={addProject}
            className="no-print text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5"
          >
            <Plus className="w-3 h-3" /> Add New Project
          </button>
        </div>

        <div className="space-y-4">
          {data.projects.map((proj, pIdx) => (
            <div key={proj.id ? `${proj.id}-${pIdx}` : `proj-${pIdx}`} className="space-y-1 group/proj">
              {/* Project Title & Interactive Link Row */}
              <div className="flex justify-between items-baseline flex-wrap gap-1">
                <div className="flex items-baseline flex-wrap gap-1 text-xs font-bold text-slate-900">
                  <Editable
                    value={proj.title}
                    onChange={(val) => updateProject(pIdx, 'title', val)}
                    as="span"
                    className="font-bold text-slate-900"
                    placeholder="Project Name"
                  />
                  <span>—</span>
                  <Editable
                    value={proj.subtitle || ''}
                    onChange={(val) => updateProject(pIdx, 'subtitle', val)}
                    as="span"
                    className="font-semibold text-slate-800"
                    placeholder="Project Subtitle"
                  />
                </div>

                {/* Hyperlinks (Live Demo | Client GitHub | Server GitHub) */}
                <div className="flex items-center gap-1.5 text-[11px] text-blue-700 flex-wrap">
                  <span className="text-blue-600">•</span>
                  <EditableLink
                    label={proj.liveDemoLabel || 'Live Demo'}
                    url={proj.liveDemoUrl || 'https://demo.vercel.app'}
                    onChangeLabel={(val) => updateProject(pIdx, 'liveDemoLabel', val)}
                    onChangeUrl={(val) => updateProject(pIdx, 'liveDemoUrl', val)}
                  />
                  <span>|</span>
                  <EditableLink
                    label={proj.clientGithubLabel || 'Client GitHub'}
                    url={proj.clientGithubUrl || 'https://github.com/username/client'}
                    onChangeLabel={(val) => updateProject(pIdx, 'clientGithubLabel', val)}
                    onChangeUrl={(val) => updateProject(pIdx, 'clientGithubUrl', val)}
                  />
                  <span>|</span>
                  <EditableLink
                    label={proj.serverGithubLabel || 'Server GitHub'}
                    url={proj.serverGithubUrl || 'https://github.com/username/server'}
                    onChangeLabel={(val) => updateProject(pIdx, 'serverGithubLabel', val)}
                    onChangeUrl={(val) => updateProject(pIdx, 'serverGithubUrl', val)}
                  />
                  {data.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProject(pIdx)}
                      className="no-print opacity-0 group-hover/proj:opacity-100 text-slate-400 hover:text-red-500 ml-1 p-0.5"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tech Stack Line with Editable Label */}
              <div className="text-xs text-slate-700 leading-snug flex items-baseline flex-wrap">
                <Editable
                  value={proj.techStackLabel || 'Tech Stack:'}
                  onChange={(val) => updateProject(pIdx, 'techStackLabel', val)}
                  as="span"
                  className="font-bold text-slate-900 italic mr-1"
                  placeholder="Tech Stack:"
                />
                <Editable
                  value={proj.techStackText}
                  onChange={(val) => updateProject(pIdx, 'techStackText', val)}
                  as="span"
                  className="italic text-slate-700 flex-1"
                  placeholder="React, Next.js, Node.js, Express.js..."
                />
              </div>

              {/* Bullet Points */}
              <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-800 leading-relaxed">
                {proj.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="group/b">
                    <div className="flex items-start justify-between gap-1">
                      <Editable
                        value={bullet}
                        onChange={(val) => updateProjectBullet(pIdx, bIdx, val)}
                        className="flex-1"
                        placeholder="Bullet point description..."
                      />
                      {proj.bullets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeProjectBullet(pIdx, bIdx)}
                          className="no-print opacity-0 group-hover/b:opacity-100 text-slate-400 hover:text-red-500 p-0.5"
                          title="Delete bullet"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              {/* Add Bullet Button */}
              <div className="no-print pt-0.5">
                <button
                  type="button"
                  onClick={() => addProjectBullet(pIdx)}
                  className="text-[10px] text-blue-600 hover:underline flex items-center gap-0.5"
                >
                  <Plus className="w-2.5 h-2.5" /> Add bullet
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. EDUCATION */}
      <section className="mt-4">
        <div className="flex justify-between items-center border-b border-slate-300 pb-0.5 mb-2">
          <Editable
            value={data.educationTitle || 'EDUCATION'}
            onChange={(val) => updateField('educationTitle', val)}
            as="h2"
            className="text-xs font-black uppercase tracking-wider text-slate-900"
            placeholder="EDUCATION"
          />
          <button
            type="button"
            onClick={addEducation}
            className="no-print text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5"
          >
            <Plus className="w-3 h-3" /> Add Education
          </button>
        </div>

        <div className="space-y-2">
          {data.education.map((edu, idx) => (
            <div key={edu.id ? `${edu.id}-${idx}` : `edu-${idx}`} className="group/edu text-xs space-y-0.5">
              <div className="flex justify-between items-baseline">
                <Editable
                  value={edu.degree}
                  onChange={(val) => updateEducation(idx, 'degree', val)}
                  className="font-bold text-slate-900"
                  placeholder="Degree Title — Field"
                />
                {data.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="no-print opacity-0 group-hover/edu:opacity-100 text-slate-400 hover:text-red-500 p-0.5"
                  >
                    <Trash2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
              <div className="text-slate-700 flex items-center gap-1.5">
                <Editable
                  value={edu.institution}
                  onChange={(val) => updateEducation(idx, 'institution', val)}
                  placeholder="Institute / University"
                />
                <span>|</span>
                <Editable
                  value={edu.statusOrDate}
                  onChange={(val) => updateEducation(idx, 'statusOrDate', val)}
                  className="text-slate-600 italic"
                  placeholder="Status or Date"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. LANGUAGES & ADDITIONAL EXPERTISE */}
      <section className="mt-4">
        <div className="border-b border-slate-300 pb-0.5 mb-2">
          <Editable
            value={data.languagesTitle || 'LANGUAGES & ADDITIONAL EXPERTISE'}
            onChange={(val) => updateField('languagesTitle', val)}
            as="h2"
            className="text-xs font-black uppercase tracking-wider text-slate-900"
            placeholder="LANGUAGES & ADDITIONAL EXPERTISE"
          />
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex items-baseline">
            <Editable
              value={data.languagesLabel || 'Languages:'}
              onChange={(val) => updateField('languagesLabel', val)}
              as="span"
              className="font-bold text-slate-900 mr-1.5"
              placeholder="Languages:"
            />
            <Editable
              value={data.languages}
              onChange={(val) => updateField('languages', val)}
              as="span"
              className="text-slate-800"
              placeholder="English (Fluent), Bangla (Native)..."
            />
          </div>

          <div className="flex items-baseline">
            <Editable
              value={data.additionalCompetenciesLabel || 'Additional Competencies:'}
              onChange={(val) => updateField('additionalCompetenciesLabel', val)}
              as="span"
              className="font-bold text-slate-900 mr-1.5"
              placeholder="Additional Competencies:"
            />
            <Editable
              value={data.additionalCompetencies}
              onChange={(val) => updateField('additionalCompetencies', val)}
              as="span"
              className="text-slate-800"
              placeholder="MS Office, Communication, Leadership..."
            />
          </div>
        </div>
      </section>

      {/* 7. DYNAMIC CUSTOM SECTIONS */}
      {(data.customSections || []).map((sec, sIdx) => (
        <section key={sec.id ? `${sec.id}-${sIdx}` : `custom-${sIdx}`} className="mt-4 group/sec relative">
          <div className="flex justify-between items-center border-b border-slate-300 pb-0.5 mb-2">
            <Editable
              value={sec.sectionTitle}
              onChange={(val) => updateCustomSection(sIdx, 'sectionTitle', val)}
              as="h2"
              className="text-xs font-black uppercase tracking-wider text-slate-900"
              placeholder="SECTION TITLE"
            />
            <button
              type="button"
              onClick={() => removeCustomSection(sIdx)}
              className="no-print opacity-0 group-hover/sec:opacity-100 text-slate-400 hover:text-red-500 p-0.5 text-xs flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Remove Section
            </button>
          </div>

          <Editable
            value={sec.content}
            onChange={(val) => updateCustomSection(sIdx, 'content', val)}
            as="p"
            className="text-xs leading-relaxed text-slate-800"
            placeholder="Write section content or details..."
          />
        </section>
      ))}

      {/* 8. Add New Custom Section Button */}
      <div className="no-print mt-6 pt-4 border-t border-dashed border-slate-200 flex justify-center">
        <button
          type="button"
          onClick={addCustomSection}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-all shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ নতুন সেকশন যোগ করুন (Add Custom Section)</span>
        </button>
      </div>
    </div>
  );
};
