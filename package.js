Package.describe({
  name: 'clinical:hl7-resource-diagnostic-report',
  version: '1.7.2',
  summary: 'HL7 FHIR Resource - Diagnostic Report',
  git: 'https://github.com/clinical-meteor/hl7-resource-diagnostic-report',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.1.0.3');

  api.use('meteor-base@1.4.0');
  api.use('mongo');

  api.use('aldeed:collection2@3.0.0');
  api.use('clinical:hl7-resource-datatypes@4.0.5');
  api.use('clinical:hl7-resource-bundle@1.6.3');

  api.use('simple:json-routes@2.1.0');
  api.use('ecmascript@0.13.0');
  api.use('session');
  api.use('http');
  api.use('react-meteor-data@0.2.15');

  api.use('clinical:extended-api@2.4.0');
  api.use('clinical:base-model@1.4.0');
  api.use('matb33:collection-hooks@0.7.15');

  api.addFiles('lib/DiagnosticReports.js', ['client', 'server']);
  api.addFiles('server/rest.js', 'server');
  api.addFiles('server/initialize.js', 'server');
  api.addFiles('server/methods.js', 'server');

  if(Package['clinical:fhir-vault-server']){
    api.use('clinical:fhir-vault-server@0.0.3', ['client', 'server'], {weak: true});
  }

  api.export('DiagnosticReport');
  api.export('DiagnosticReports');
  api.export('DiagnosticReportSchema');

  api.mainModule('index.jsx', 'client');
});


Npm.depends({
  "simpl-schema": "1.5.3",
  "moment": "2.22.2",
  "lodash": "4.17.4",
  "material-fhir-ui": "0.9.19",
  "winston": "3.2.1"
})