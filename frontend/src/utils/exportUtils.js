import * as XLSX from 'xlsx';

/**
 * Export array of transactions/records to Excel (.xlsx)
 * @param {Array} data - Array of objects to export
 * @param {string} fileName - Base filename without extension
 * @param {string} sheetName - Name of worksheet
 */
export const exportToExcel = (data, fileName = 'Transactions', sheetName = 'Sheet1') => {
  if (!data || !data.length) {
    alert('No data available to export.');
    return;
  }

  try {
    // Format records for clean human-readable Excel display
    const formattedData = data.map((item, idx) => ({
      '#': idx + 1,
      'Date': item.date ? new Date(item.date).toLocaleDateString() : '',
      'Type': (item.type || '').toUpperCase(),
      'Category': item.category || 'General',
      'Description': item.description || '',
      'Amount': Number(item.amount) || 0,
      'Payment Method': item.paymentMethod || 'Card/Cash',
      'Notes': item.notes || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Auto-fit column widths
    const columnWidths = [
      { wch: 6 },  // #
      { wch: 14 }, // Date
      { wch: 10 }, // Type
      { wch: 18 }, // Category
      { wch: 30 }, // Description
      { wch: 14 }, // Amount
      { wch: 18 }, // Payment Method
      { wch: 25 }, // Notes
    ];
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const safeDate = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `${fileName}_${safeDate}.xlsx`);
  } catch (error) {
    console.error('Error generating Excel file:', error);
    alert('Failed to export Excel file. Please check console.');
  }
};

/**
 * Export array of records to CSV
 * @param {Array} data - Array of objects to export
 * @param {string} fileName - Base filename
 */
export const exportToCSV = (data, fileName = 'Transactions') => {
  if (!data || !data.length) {
    alert('No data available to export.');
    return;
  }

  try {
    const formattedData = data.map(item => ({
      Date: item.date ? new Date(item.date).toLocaleDateString() : '',
      Type: item.type || '',
      Category: item.category || '',
      Description: `"${(item.description || '').replace(/"/g, '""')}"`,
      Amount: item.amount || 0,
      Notes: `"${(item.notes || '').replace(/"/g, '""')}"`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    alert('Failed to export CSV file.');
  }
};
