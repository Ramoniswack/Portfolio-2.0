"use client"

export const downloadResume = () => {
  // Create a properly formatted A4 PDF resume
  const resumeContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>R.a.mohan Tiwari - Resume</title>
    <style>
        @page {
            size: A4;
            margin: 0.5in;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body { 
            font-family: 'Arial', 'Helvetica', sans-serif; 
            font-size: 11px;
            line-height: 1.4; 
            color: #333; 
            background: white;
            width: 8.27in;
            min-height: 11.69in;
            margin: 0 auto;
            padding: 0.5in;
        }
        
        .header { 
            text-align: center; 
            margin-bottom: 20px; 
            padding-bottom: 15px;
            border-bottom: 2px solid #2563eb;
        }
        
        .header h1 { 
            font-size: 24px; 
            color: #1e293b; 
            margin-bottom: 5px;
            font-weight: bold;
        }
        
        .contact-info { 
            font-size: 10px; 
            color: #64748b;
            line-height: 1.3;
        }
        
        .section { 
            margin-bottom: 18px; 
        }
        
        .section h2 { 
            font-size: 14px; 
            font-weight: bold;
            color: #1e293b; 
            margin-bottom: 8px;
            padding-bottom: 3px;
            border-bottom: 1px solid #e2e8f0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .job, .education-item, .project { 
            margin-bottom: 12px; 
            page-break-inside: avoid;
        }
        
        .job-header, .edu-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
            margin-bottom: 4px; 
        }
        
        .job-title, .degree, .project-title { 
            font-weight: bold; 
            font-size: 12px;
            color: #1e293b;
        }
        
        .company, .school { 
            font-size: 10px; 
            color: #64748b; 
            font-style: italic;
        }
        
        .period { 
            font-size: 10px; 
            color: #2563eb; 
            font-weight: bold;
            white-space: nowrap;
        }
        
        .description {
            font-size: 10px;
            color: #475569;
            margin-top: 3px;
            text-align: justify;
        }
        
        .skills-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .skill-category {
            margin-bottom: 8px;
        }
        
        .skill-category strong {
            font-size: 11px;
            color: #1e293b;
            display: block;
            margin-bottom: 3px;
        }
        
        .skill-list {
            font-size: 10px;
            color: #475569;
            line-height: 1.3;
        }
        
        .project-tech {
            font-size: 9px;
            color: #6366f1;
            font-style: italic;
            margin-top: 2px;
        }
        
        .about-text {
            font-size: 10px;
            color: #475569;
            text-align: justify;
            line-height: 1.4;
        }
        
        .soft-skills {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            font-size: 10px;
        }
        
        .soft-skills span {
            color: #475569;
        }
        
        .contact-section {
            font-size: 10px;
            line-height: 1.5;
        }
        
        .contact-section strong {
            color: #1e293b;
        }
        
        @media print {
            body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
            
            .section {
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>R.a.mohan Tiwari</h1>
        <div class="contact-info">
            <p>ramontiwari086@gmail.com | Pokhara, Nepal</p>
            <p>https://ramohan.com.np | https://github.com/Ramoniswack | https://linkedin.com/in/ramon-tiwari</p>
        </div>
    </div>

    <div class="section">
        <h2>About Me</h2>
        <p class="about-text">Developer & Creator who loves learning new things and enjoys juggling code, ideas, and music. Passionate about deep focus and curiosity, always exploring the intersection of technology and creativity. I write syntax and lyrics alike, finding rhythm in both code and music, creating harmony between logic and art.</p>
    </div>

    <div class="section">
        <h2>Education</h2>
        <div class="education-item">
            <div class="edu-header">
                <div>
                    <div class="degree">Bachelor of Computer Application (BCA)</div>
                    <div class="school">La Grandee International College, Pokhara, Nepal</div>
                </div>
                <div class="period">Ongoing</div>
            </div>
        </div>
        <div class="education-item">
            <div class="edu-header">
                <div>
                    <div class="degree">Plus Two (+2) - Science</div>
                    <div class="school">Oxford College of Engineering and Management, Gaidakot, Nepal</div>
                </div>
                <div class="period">Completed</div>
            </div>
        </div>
        <div class="education-item">
            <div class="edu-header">
                <div>
                    <div class="degree">Secondary Education Examination (SEE)</div>
                    <div class="school">Bhrikuting Boarding School, Bharatpur, Nepal</div>
                </div>
                <div class="period">Completed</div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Experience</h2>
        <div class="job">
            <div class="job-header">
                <div>
                    <div class="job-title">Web Development Intern</div>
                    <div class="company">Xav Technologies, Nepal</div>
                </div>
                <div class="period">April 2025 - May 2025</div>
            </div>
            <p class="description">Focused on React UI development, creating responsive and interactive user interfaces. Gained hands-on experience with modern React patterns, component architecture, and UI/UX best practices while contributing to real-world projects.</p>
        </div>
    </div>

    <div class="section">
        <h2>Technical Skills</h2>
        <div class="skills-section">
            <div>
                <div class="skill-category">
                    <strong>Frontend Development</strong>
                    <div class="skill-list">HTML5, CSS3, JavaScript, TypeScript, React, TailwindCSS</div>
                </div>
                <div class="skill-category">
                    <strong>Backend Development</strong>
                    <div class="skill-list">PHP, MySQL, MongoDB, SQL Server</div>
                </div>
            </div>
            <div>
                <div class="skill-category">
                    <strong>Programming Languages</strong>
                    <div class="skill-list">JavaScript, TypeScript, PHP, Java, C++</div>
                </div>
                <div class="skill-category">
                    <strong>Tools & Libraries</strong>
                    <div class="skill-list">Zod, Git, VS Code, Figma, Next.js, React Native</div>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>Soft Skills</h2>
        <div class="soft-skills">
            <span>• Problem Solving</span>
            <span>• Critical Thinking</span>
            <span>• Team Collaboration</span>
            <span>• Communication</span>
            <span>• Adaptability</span>
            <span>• Time Management</span>
            <span>• Creativity</span>
            <span>• Self-Learning</span>
            <span>• Attention to Detail</span>
            <span>• Project Management</span>
            <span>• Leadership</span>
            <span>• Innovation</span>
        </div>
    </div>

    <div class="section">
        <h2>Key Projects</h2>
        <div class="project">
            <div class="project-title">Kharcha-Meter - Smart Expense Tracker</div>
            <p class="description">Modern expense tracking application built for real-time financial management with intuitive user interface and comprehensive analytics.</p>
            <div class="project-tech">Technologies: React Native, Expo, TypeScript, Supabase</div>
        </div>
        <div class="project">
            <div class="project-title">AttendifyPlus - QR-Based Attendance System</div>
            <p class="description">Advanced attendance management system with QR code integration for educational institutions, featuring real-time tracking and reporting.</p>
            <div class="project-tech">Technologies: PHP, MySQL, QR Code API, Bootstrap</div>
        </div>
        <div class="project">
            <div class="project-title">GadiGhar - Premium Car Sales Platform</div>
            <p class="description">Modern automotive marketplace specifically designed for Nepal market with advanced search and filtering capabilities.</p>
            <div class="project-tech">Technologies: React, TypeScript, PHP, MySQL</div>
        </div>
    </div>

    <div class="section">
        <h2>Contact Information</h2>
        <div class="contact-section">
            <p><strong>Email:</strong> ramontiwari086@gmail.com</p>
            <p><strong>GitHub:</strong> https://github.com/Ramoniswack</p>
            <p><strong>Website:</strong> https://ramohan.com.np</p>
            <p><strong>LinkedIn:</strong> https://linkedin.com/in/ramon-tiwari</p>
            <p><strong>Location:</strong> Pokhara, Nepal</p>
        </div>
    </div>
</body>
</html>
  `

  // Create and download the HTML file optimized for A4 printing
  const blob = new Blob([resumeContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'Ramon_Tiwari_Resume_A4.html'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  // Show instruction to user for PDF conversion
  alert('A4-optimized resume downloaded! Open the file and use Ctrl+P → "Save as PDF" → Select "More settings" → Paper size: A4 → Margins: Minimum → to get a perfect A4 PDF.')
}
