"use client"

export interface ReportData {
  title: string
  subtitle?: string
  date: string
  columns: { key: string; label: string }[]
  data: any[]
  type: "students" | "teachers" | "books"
}

export function generateReportHTML(report: ReportData, isSingle: boolean = false): string {
  const { title, subtitle, date, columns, data, type } = report
  
  const getFieldValue = (item: any, key: string) => {
    return item[key] || "-"
  }

  const generateSingleReport = (item: any) => {
    const imageUrl = item.imageUrl
    const isBook = type === "books"
    
    return `
      <div class="single-record">
        <div class="record-header">
          ${imageUrl ? `
            <div class="record-image ${isBook ? 'book-cover' : 'avatar'}">
              <img src="${imageUrl}" alt="Photo" />
            </div>
          ` : `
            <div class="record-image ${isBook ? 'book-cover' : 'avatar'} placeholder">
              <span>${isBook ? '📚' : '👤'}</span>
            </div>
          `}
          <div class="record-info">
            <h2>${item.fullName || item.title || 'Record'}</h2>
            ${type === "students" || type === "teachers" ? `
              <p class="detail"><strong>Email:</strong> ${item.email || '-'}</p>
              <p class="detail"><strong>Phone:</strong> ${item.phone || '-'}</p>
            ` : ''}
            ${type === "books" ? `
              <p class="detail"><strong>Author:</strong> ${item.author || '-'}</p>
            ` : ''}
          </div>
        </div>
      </div>
    `
  }

  const generateTableReport = () => {
    const isBook = type === "books"
    return `
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Photo</th>
            ${columns.filter(c => c.key !== 'imageUrl').map(col => `<th>${col.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map((item, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td class="image-cell">
                ${item.imageUrl ? `
                  <img src="${item.imageUrl}" alt="Photo" class="table-image ${isBook ? 'book-thumb' : 'avatar-thumb'}" />
                ` : `
                  <div class="table-image-placeholder ${isBook ? 'book-thumb' : 'avatar-thumb'}">
                    <span>${isBook ? '📚' : '👤'}</span>
                  </div>
                `}
              </td>
              ${columns.filter(c => c.key !== 'imageUrl').map(col => `<td>${getFieldValue(item, col.key)}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="summary">
        <p><strong>Total Records:</strong> ${data.length}</p>
      </div>
    `
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        @page {
          size: A4;
          margin: 15mm;
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 12px;
          line-height: 1.5;
          color: #1e293b;
          background: white;
          padding: 20px;
        }
        
        .report-container {
          max-width: 210mm;
          margin: 0 auto;
          background: white;
        }
        
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 20px;
          border-bottom: 3px solid #10b981;
          margin-bottom: 25px;
        }
        
        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .logo {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #10b981, #14b8a6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
        }
        
        .title-section h1 {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 4px;
        }
        
        .title-section p {
          color: #64748b;
          font-size: 13px;
        }
        
        .date-section {
          text-align: right;
          color: #64748b;
          font-size: 12px;
        }
        
        .date-section strong {
          color: #0f172a;
        }
        
        .report-title {
          text-align: center;
          margin-bottom: 25px;
        }
        
        .report-title h2 {
          font-size: 20px;
          color: #0f172a;
          margin-bottom: 5px;
        }
        
        .report-title p {
          color: #64748b;
          font-size: 13px;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 11px;
        }
        
        .data-table th {
          background: linear-gradient(135deg, #10b981, #14b8a6);
          color: white;
          padding: 12px 10px;
          text-align: left;
          font-weight: 600;
          font-size: 11px;
        }
        
        .data-table th:first-child {
          border-radius: 8px 0 0 0;
          width: 40px;
          text-align: center;
        }
        
        .data-table th:last-child {
          border-radius: 0 8px 0 0;
        }
        
        .data-table td {
          padding: 10px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .data-table td:first-child {
          text-align: center;
          color: #64748b;
          font-weight: 500;
        }
        
        .data-table tr:nth-child(even) {
          background: #f8fafc;
        }
        
        .data-table tr:hover {
          background: #f1f5f9;
        }
        
        .image-cell {
          text-align: center;
          padding: 6px !important;
        }
        
        .table-image {
          object-fit: cover;
          border: 2px solid #e2e8f0;
        }
        
        .table-image.avatar-thumb {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        
        .table-image.book-thumb {
          width: 35px;
          height: 50px;
          border-radius: 4px;
        }
        
        .table-image-placeholder {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #10b981, #14b8a6);
          color: white;
          font-size: 14px;
        }
        
        .table-image-placeholder.avatar-thumb {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        
        .table-image-placeholder.book-thumb {
          width: 35px;
          height: 50px;
          border-radius: 4px;
        }
        
        .summary {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          padding: 12px 16px;
          margin-top: 20px;
        }
        
        .summary p {
          color: #166534;
          font-size: 13px;
        }
        
        .single-record {
          background: #f8fafc;
          border-radius: 12px;
          padding: 25px;
          margin-bottom: 20px;
        }
        
        .record-header {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }
        
        .record-image {
          flex-shrink: 0;
        }
        
        .record-image.avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #10b981;
        }
        
        .record-image.book-cover {
          width: 80px;
          height: 110px;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #e2e8f0;
        }
        
        .record-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .record-image.placeholder {
          background: linear-gradient(135deg, #10b981, #14b8a6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }
        
        .record-info h2 {
          font-size: 22px;
          color: #0f172a;
          margin-bottom: 12px;
        }
        
        .record-info .detail {
          color: #475569;
          margin-bottom: 6px;
          font-size: 13px;
        }
        
        .record-info .detail strong {
          color: #0f172a;
        }
        
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          color: #94a3b8;
          font-size: 10px;
        }
        
        @media print {
          body {
            padding: 0;
          }
          
          .report-container {
            max-width: none;
          }
          
          .data-table tr {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      <div class="report-container">
        <div class="report-header">
          <div class="logo-section">
            <div class="logo">🎓</div>
            <div class="title-section">
              <h1>Student Management System</h1>
              <p>Academic Records & Administration</p>
            </div>
          </div>
          <div class="date-section">
            <p>Generated on</p>
            <p><strong>${date}</strong></p>
          </div>
        </div>
        
        <div class="report-title">
          <h2>${title}</h2>
          ${subtitle ? `<p>${subtitle}</p>` : ''}
        </div>
        
        ${isSingle ? data.map(item => generateSingleReport(item)).join('') : generateTableReport()}
        
        <div class="footer">
          <p>This is an official document generated by Student Management System</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function downloadPDF(report: ReportData, filename: string, isSingle: boolean = false) {
  const html = generateReportHTML(report, isSingle)
  
  const html2pdf = (await import('html2pdf.js')).default
  
  const container = document.createElement('div')
  container.innerHTML = html
  document.body.appendChild(container)
  
  const options = {
    margin: 10,
    filename: `${filename}.pdf`,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
  }
  
  try {
    await html2pdf().set(options).from(container).save()
  } finally {
    document.body.removeChild(container)
  }
}

export function printReport(report: ReportData, isSingle: boolean = false) {
  const html = generateReportHTML(report, isSingle)
  
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}
