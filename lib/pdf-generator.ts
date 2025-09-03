"use client"

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { resumeData } from './resume-data'

export const generateResumePDF = async () => {
  // Create a temporary div for the resume content
  const resumeElement = document.createElement('div')
  resumeElement.style.position = 'absolute'
  resumeElement.style.left = '-9999px'
  resumeElement.style.top = '0'
  resumeElement.style.width = '800px'
  resumeElement.style.backgroundColor = 'white'
  resumeElement.style.padding = '40px'
  resumeElement.style.fontFamily = 'Arial, sans-serif'
  
  // Create the resume HTML content
  resumeElement.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto; color: #000;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 28px; font-weight: bold; margin-bottom: 8px; color: #1a1a1a;">${resumeData.personalInfo.name}</h1>
        <div style="font-size: 14px; line-height: 1.4;">
          <p style="margin: 4px 0;">${resumeData.personalInfo.email} | ${resumeData.personalInfo.location}</p>
          <p style="margin: 4px 0;">${resumeData.personalInfo.website} | ${resumeData.personalInfo.github}</p>
        </div>
      </div>

      <!-- About -->
      <section style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; margin-bottom: 12px; padding-bottom: 4px;">ABOUT ME</h2>
        <p style="font-size: 12px; line-height: 1.6; margin: 0;">${resumeData.about}</p>
      </section>

      <!-- Education -->
      <section style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; margin-bottom: 12px; padding-bottom: 4px;">EDUCATION</h2>
        ${resumeData.education.map(edu => `
          <div style="margin-bottom: 15px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <h3 style="font-size: 13px; font-weight: 600; margin: 0 0 4px 0;">${edu.degree}</h3>
                <p style="font-size: 12px; margin: 0; color: #444;">${edu.institution}, ${edu.location}</p>
              </div>
              <span style="font-size: 12px; font-weight: 500; color: #555;">${edu.period}</span>
            </div>
          </div>
        `).join('')}
      </section>

      <!-- Experience -->
      <section style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; margin-bottom: 12px; padding-bottom: 4px;">EXPERIENCE</h2>
        ${resumeData.experience.map(exp => `
          <div style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
              <div>
                <h3 style="font-size: 13px; font-weight: 600; margin: 0 0 4px 0;">${exp.title}</h3>
                <p style="font-size: 12px; margin: 0; color: #444;">${exp.company}, ${exp.location}</p>
              </div>
              <span style="font-size: 12px; font-weight: 500; color: #555;">${exp.period}</span>
            </div>
            <p style="font-size: 12px; line-height: 1.6; margin: 0;">${exp.description}</p>
          </div>
        `).join('')}
      </section>

      <!-- Technical Skills -->
      <section style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; margin-bottom: 12px; padding-bottom: 4px;">TECHNICAL SKILLS</h2>
        ${resumeData.technicalSkills.map(category => `
          <div style="margin-bottom: 8px;">
            <span style="font-size: 12px; font-weight: 600;">${category.category}: </span>
            <span style="font-size: 12px;">${category.skills.join(", ")}</span>
          </div>
        `).join('')}
      </section>

      <!-- Soft Skills -->
      <section style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; margin-bottom: 12px; padding-bottom: 4px;">SOFT SKILLS</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
          ${resumeData.softSkills.map(skill => `
            <span style="font-size: 12px;">• ${skill}</span>
          `).join('')}
        </div>
      </section>

      <!-- Projects -->
      <section style="margin-bottom: 25px;">
        <h2 style="font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; margin-bottom: 12px; padding-bottom: 4px;">PROJECTS</h2>
        ${resumeData.projects.slice(0, 3).map(project => `
          <div style="margin-bottom: 20px;">
            <h3 style="font-size: 13px; font-weight: 600; margin: 0 0 4px 0;">${project.name}</h3>
            <p style="font-size: 12px; margin: 0 0 4px 0; line-height: 1.5;">${project.description}</p>
            <p style="font-size: 11px; margin: 0 0 2px 0;"><strong>Technologies:</strong> ${project.technologies.join(", ")}</p>
            <p style="font-size: 11px; margin: 0;"><strong>Links:</strong> ${project.github}${project.live ? ` | ${project.live}` : ''}</p>
          </div>
        `).join('')}
      </section>

      <!-- Contact & Social -->
      <section>
        <h2 style="font-size: 16px; font-weight: bold; border-bottom: 2px solid #333; margin-bottom: 12px; padding-bottom: 4px;">CONTACT & SOCIAL</h2>
        <div style="font-size: 12px; line-height: 1.6;">
          <p style="margin: 4px 0;"><strong>Email:</strong> ${resumeData.personalInfo.email}</p>
          <p style="margin: 4px 0;"><strong>GitHub:</strong> ${resumeData.personalInfo.github}</p>
          <p style="margin: 4px 0;"><strong>Website:</strong> ${resumeData.personalInfo.website}</p>
          <p style="margin: 4px 0;"><strong>LinkedIn:</strong> https://linkedin.com/in/ramon-tiwari</p>
        </div>
      </section>
    </div>
  `

  document.body.appendChild(resumeElement)

  try {
    // Generate canvas from HTML
    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    })

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgData = canvas.toDataURL('image/png')
    
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
    const imgX = (pdfWidth - imgWidth * ratio) / 2
    const imgY = 0

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
    
    // Download the PDF
    pdf.save(`${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`)
    
  } catch (error) {
    console.error('Error generating PDF:', error)
    alert('Error generating PDF. Please try again.')
  } finally {
    // Clean up
    document.body.removeChild(resumeElement)
  }
}
