"use client"

export const downloadResume = () => {
  // Direct download of uploaded PDF in public/
  const pdfPath = '/Ramohan_Tiwari_Resume.pdf'
  try {
    const a = document.createElement('a')
    a.href = pdfPath
    a.download = 'Ramohan_Tiwari_Resume.pdf'
    // For Safari compatibility, append to document
    document.body.appendChild(a)
    a.click()
    a.remove()
  } catch (err) {
    console.error('Failed to trigger PDF download:', err)
    // Fallback: open the PDF in a new tab
    window.open(pdfPath, '_blank')
  }
}
