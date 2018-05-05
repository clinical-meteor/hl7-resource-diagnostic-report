

import DiagnosticReportsPage from './client/DiagnosticReportsPage';
import DiagnosticReportsTable from './client/DiagnosticReportsTable';
import { DiagnosticReport, DiagnosticReports, DiagnosticReportSchema } from './lib/DiagnosticReports';

var DynamicRoutes = [{
  'name': 'DiagnosticReportsPage',
  'path': '/diagnostic-reports',
  'component': DiagnosticReportsPage,
  'requireAuth': true
}];

var SidebarElements = [{
  'primaryText': 'DiagnosticReports',
  'to': '/diagnostic-reports',
  'href': '/diagnostic-reports'
}];

export { 
  SidebarElements, 
  DynamicRoutes, 

  DiagnosticReportsPage,
  DiagnosticReportsTable
};


