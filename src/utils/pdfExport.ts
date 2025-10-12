import { jsPDF } from 'jspdf';
import { PhishingResult } from '@/types/phishing';

export const exportToPDF = (result: PhishingResult, emailText: string) => {
  console.log('exportToPDF called', result);
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Phishing Analysis Report', 20, 20);
  
  // Date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date(result.timestamp).toLocaleString()}`, 20, 30);
  
  // Score
  doc.setFontSize(16);
  doc.text(`Threat Score: ${result.score}/100`, 20, 45);
  
  const status = result.score < 30 ? 'SAFE' : result.score < 70 ? 'SUSPICIOUS' : 'PHISHING';
  doc.text(`Status: ${status}`, 20, 55);
  
  // Metrics
  doc.setFontSize(12);
  doc.text('Detection Metrics:', 20, 70);
  doc.setFontSize(10);
  doc.text(`• Keyword Matches: ${result.details.keywordMatches}`, 25, 80);
  doc.text(`• URL Issues: ${result.details.urlIssues}`, 25, 87);
  doc.text(`• Sensitive Requests: ${result.details.sensitiveRequests}`, 25, 94);
  doc.text(`• Brand Impersonation: ${result.details.brandImpersonation ? 'Yes' : 'No'}`, 25, 101);
  doc.text(`• Confidence: ${result.confidence}%`, 25, 108);
  
  // Reasons
  doc.setFontSize(12);
  doc.text('Detection Reasons:', 20, 125);
  doc.setFontSize(9);
  
  let yPos = 135;
  result.reasons.forEach((reason, index) => {
    const lines = doc.splitTextToSize(`${index + 1}. ${reason}`, 170);
    doc.text(lines, 25, yPos);
    yPos += lines.length * 5 + 3;
  });
  
  // Email Preview
  if (yPos < 250) {
    doc.setFontSize(12);
    doc.text('Email Content Preview:', 20, yPos + 10);
    doc.setFontSize(8);
    const preview = emailText.substring(0, 300) + (emailText.length > 300 ? '...' : '');
    const previewLines = doc.splitTextToSize(preview, 170);
    doc.text(previewLines, 25, yPos + 20);
  }
  
  // Save
  doc.save(`phishing-analysis-${Date.now()}.pdf`);
};
