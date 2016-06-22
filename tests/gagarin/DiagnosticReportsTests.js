describe('clinical:hl7-resources-diagnostic-report', function () {
  var server = meteor();
  var client = browser(server);

  it('DiagnosticReports should exist on the client', function () {
    return client.execute(function () {
      expect(DiagnosticReports).to.exist;
    });
  });

  it('DiagnosticReports should exist on the server', function () {
    return server.execute(function () {
      expect(DiagnosticReports).to.exist;
    });
  });

});
