import * as XLSX from 'xlsx';
import { Booking, calculateClientTier } from './bookings';

export interface ExportExcelOptions {
  filterName?: string;
  filenamePrefix?: string;
}

/**
 * Generates and downloads a formatted .xlsx report from a list of bookings
 */
export function exportBookingsToExcel(
  bookings: Booking[], 
  options: ExportExcelOptions = {}
): boolean {
  if (!bookings || bookings.length === 0) {
    return false;
  }

  const { filterName = 'All', filenamePrefix = 'ASSERWA_Bookings' } = options;

  // Format booking records for the spreadsheet rows
  const formattedRows = bookings.map((b) => {
    let submittedAtStr = '';
    try {
      submittedAtStr = new Date(b.createdAt).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      submittedAtStr = String(b.createdAt);
    }

    const tierInfo = calculateClientTier({ email: b.email, phone: b.phone }, bookings);

    return {
      'Reference ID': b.id,
      'Customer Name': b.customerName,
      'Client Tier': tierInfo.label.toUpperCase(),
      'Completed Bookings': tierInfo.completedCount,
      'Total Requester Bookings': tierInfo.totalBookingsCount,
      'Email': b.email,
      'Phone': b.phone,
      'Service Type': b.serviceType,
      'Status': b.status.toUpperCase(),
      'Appointment Date': b.appointmentDateFormatted || b.appointmentDate,
      'Preferred Time': b.preferredTime,
      'Declared Source': b.referralSource || 'Direct',
      'Acquisition Channel': b.attribution?.channel || b.referralSource || 'Direct',
      'Campaign / UTM': b.attribution?.source ? `${b.attribution.source}${b.attribution.campaign ? ` / ${b.attribution.campaign}` : ''}` : 'N/A',
      'Referrer URL': b.attribution?.referrerUrl || 'Direct visit',
      'Landing Page': b.attribution?.landingPage || '/',
      'Device / Platform': b.attribution?.device || 'N/A',
      'Description': b.description || 'N/A',
      'Location URL': b.locationUrl || 'N/A',
      'Submitted At': submittedAtStr
    };
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(formattedRows);

  // Set precise column widths as defined in specification
  worksheet['!cols'] = [
    { wch: 22 }, // Reference ID
    { wch: 25 }, // Customer Name
    { wch: 18 }, // Client Tier
    { wch: 20 }, // Completed Bookings
    { wch: 24 }, // Total Requester Bookings
    { wch: 30 }, // Email
    { wch: 18 }, // Phone
    { wch: 30 }, // Service Type
    { wch: 14 }, // Status
    { wch: 20 }, // Appointment Date
    { wch: 16 }, // Preferred Time
    { wch: 25 }, // Declared Source
    { wch: 25 }, // Acquisition Channel
    { wch: 22 }, // Campaign / UTM
    { wch: 35 }, // Referrer URL
    { wch: 25 }, // Landing Page
    { wch: 20 }, // Device / Platform
    { wch: 45 }, // Description
    { wch: 40 }, // Location URL
    { wch: 22 }, // Submitted At
  ];

  // Create workbook and append worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Service Bookings');

  // Generate dynamic filename: App_Bookings_{filter}_{YYYY-MM-DD}.xlsx
  const dateStr = new Date().toISOString().split('T')[0];
  const sanitizedFilter = filterName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${filenamePrefix}_${sanitizedFilter}_${dateStr}.xlsx`;

  // Write and trigger browser download
  XLSX.writeFile(workbook, filename);
  return true;
}

/**
 * CSV Fallback Export
 */
export function exportBookingsToCSV(
  bookings: Booking[],
  options: ExportExcelOptions = {}
): boolean {
  if (!bookings || bookings.length === 0) {
    return false;
  }

  const { filterName = 'All', filenamePrefix = 'ASSERWA_Bookings' } = options;

  const headers = [
    'Reference ID',
    'Customer Name',
    'Client Tier',
    'Completed Bookings',
    'Total Requester Bookings',
    'Email',
    'Phone',
    'Service Type',
    'Status',
    'Appointment Date',
    'Preferred Time',
    'Declared Source',
    'Acquisition Channel',
    'Campaign / UTM',
    'Referrer URL',
    'Landing Page',
    'Device / Platform',
    'Description',
    'Location URL',
    'Submitted At'
  ];

  const escapeCSV = (val: any) => `"${String(val || '').replace(/"/g, '""')}"`;

  const rows = bookings.map(b => {
    let submittedAt = '';
    try {
      submittedAt = new Date(b.createdAt).toLocaleString();
    } catch {
      submittedAt = String(b.createdAt);
    }

    const tierInfo = calculateClientTier({ email: b.email, phone: b.phone }, bookings);
    const campaignStr = b.attribution?.source ? `${b.attribution.source}${b.attribution.campaign ? ` / ${b.attribution.campaign}` : ''}` : 'N/A';

    return [
      escapeCSV(b.id),
      escapeCSV(b.customerName),
      escapeCSV(tierInfo.label.toUpperCase()),
      escapeCSV(tierInfo.completedCount),
      escapeCSV(tierInfo.totalBookingsCount),
      escapeCSV(b.email),
      escapeCSV(b.phone),
      escapeCSV(b.serviceType),
      escapeCSV(b.status.toUpperCase()),
      escapeCSV(b.appointmentDateFormatted || b.appointmentDate),
      escapeCSV(b.preferredTime),
      escapeCSV(b.referralSource || 'Direct'),
      escapeCSV(b.attribution?.channel || b.referralSource || 'Direct'),
      escapeCSV(campaignStr),
      escapeCSV(b.attribution?.referrerUrl || 'Direct visit'),
      escapeCSV(b.attribution?.landingPage || '/'),
      escapeCSV(b.attribution?.device || 'N/A'),
      escapeCSV(b.description),
      escapeCSV(b.locationUrl),
      escapeCSV(submittedAt)
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  const sanitizedFilter = filterName.replace(/[^a-zA-Z0-9_-]/g, '_');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filenamePrefix}_${sanitizedFilter}_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return true;
}
