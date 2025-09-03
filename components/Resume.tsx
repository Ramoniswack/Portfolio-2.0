"use client"

import { resumeData } from "@/lib/resume-data"

interface ResumeProps {
  isForPDF?: boolean
}

export function Resume({ isForPDF = false }: ResumeProps) {
  return (
    <div className={`${isForPDF ? 'bg-white text-black p-8' : 'bg-card text-foreground p-6'} max-w-4xl mx-auto`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{resumeData.personalInfo.name}</h1>
        <div className="text-sm space-y-1">
          <p>{resumeData.personalInfo.email} | {resumeData.personalInfo.location}</p>
          <p>{resumeData.personalInfo.website} | {resumeData.personalInfo.github}</p>
        </div>
      </div>

      {/* About */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-3">ABOUT ME</h2>
        <p className="text-sm leading-relaxed">{resumeData.about}</p>
      </section>

      {/* Education */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-3">EDUCATION</h2>
        {resumeData.education.map((edu, index) => (
          <div key={index} className="mb-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-sm">{edu.degree}</h3>
                <p className="text-sm">{edu.institution}, {edu.location}</p>
              </div>
              <span className="text-sm font-medium">{edu.period}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Experience */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-3">EXPERIENCE</h2>
        {resumeData.experience.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-sm">{exp.title}</h3>
                <p className="text-sm">{exp.company}, {exp.location}</p>
              </div>
              <span className="text-sm font-medium">{exp.period}</span>
            </div>
            <p className="text-sm leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </section>

      {/* Technical Skills */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-3">TECHNICAL SKILLS</h2>
        {resumeData.technicalSkills.map((category, index) => (
          <div key={index} className="mb-2">
            <span className="font-semibold text-sm">{category.category}: </span>
            <span className="text-sm">{category.skills.join(", ")}</span>
          </div>
        ))}
      </section>

      {/* Soft Skills */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-3">SOFT SKILLS</h2>
        <div className="grid grid-cols-2 gap-1">
          {resumeData.softSkills.map((skill, index) => (
            <span key={index} className="text-sm">• {skill}</span>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mb-6">
        <h2 className="text-lg font-bold border-b border-gray-300 mb-3">PROJECTS</h2>
        {resumeData.projects.slice(0, 3).map((project, index) => (
          <div key={index} className="mb-4">
            <h3 className="font-semibold text-sm">{project.name}</h3>
            <p className="text-sm mb-1">{project.description}</p>
            <p className="text-xs"><strong>Technologies:</strong> {project.technologies.join(", ")}</p>
            <p className="text-xs">
              <strong>Links:</strong> {project.github} {project.live && `| ${project.live}`}
            </p>
          </div>
        ))}
      </section>

      {/* Contact & Social */}
      <section>
        <h2 className="text-lg font-bold border-b border-gray-300 mb-3">CONTACT & SOCIAL</h2>
        <div className="text-sm space-y-1">
          <p><strong>Email:</strong> {resumeData.personalInfo.email}</p>
          <p><strong>GitHub:</strong> {resumeData.personalInfo.github}</p>
          <p><strong>Website:</strong> {resumeData.personalInfo.website}</p>
          <p><strong>LinkedIn:</strong> https://linkedin.com/in/ramon-tiwari</p>
        </div>
      </section>
    </div>
  )
}
