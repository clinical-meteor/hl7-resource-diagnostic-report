import { Card, CardActions, CardMedia, CardText, CardTitle } from 'material-ui/Card';
import { GlassCard, VerticalCanvas, Glass } from 'meteor/clinical:glass-ui';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';
import Toggle from 'material-ui/Toggle';
import { get } from 'lodash';

const mapDiagnosticReportToRow = function(report, fhirVersion){
  //console.log('report', report)
  
  var newRow = {
    _id: '',
    subjectDisplay: '',
    code: '',
    status: '',
    issued: '',
    performerDisplay: '',
    identifier: '',
    category: '',
    effectiveDate: ''
  };
  if (report){
    if(report._id){
      newRow._id = report._id;
    }
    if(report.subject){
      if(report.subject.display){
        newRow.subjectDisplay = report.subject.display;
      } else {
        newRow.subjectDisplay = report.subject.reference;          
      }
    }
    if(fhirVersion === "v3.0.1"){
      if(get(report, 'performer[0].actor.display')){
        newRow.performerDisplay = get(report, 'performer[0].actor.display');
      } else {
        newRow.performerDisplay = get(report, 'performer[0].actor.reference');          
      }
    }
    if(fhirVersion === "v1.0.2"){
      if(report.performer){
        newRow.performerDisplay = get(report, 'performer.display');
      } else {
        newRow.performerDisplay = get(report, 'performer.reference'); 
      }      
    }

    if(report.code){
      newRow.code = report.code.text;
    }

    if(get(report, 'identifier[0].value')){
      newRow.identifier = get(report, 'identifier[0].value');
    }
    if(report.status){
      newRow.status = report.status;
    }
    if(report.effectiveDateTime){
      newRow.effectiveDate = moment(report.effectiveDateTime).format("YYYY-MM-DD");
    }
    if(get(report, 'category.coding[0].code')){
      newRow.category = get(report, 'category.coding[0].code');
    }
    if(report.issued){
      newRow.issued = moment(report.issued).format("YYYY-MM-DD"); 
    }       
    return newRow;  
  } 
}


export default class DiagnosticReportsTable extends React.Component {
  getMeteorData() {

    // this should all be handled by props
    // or a mixin!
    let data = {
      style: {
        opacity: Session.get('globalOpacity')
      },
      selected: [],
      diagnosticReports: [],
      displayToggle: false,
      displayDates: true,
      fhirVersion: 'v1.0.2'
    }

    if(this.props.fhirVersion){
      data.fhirVersion = this.props.fhirVersion;
    }

    if(this.props.displayToggles){
      data.displayToggle = this.props.displayToggles;
    }
    if(this.props.displayDates){
      data.displayDates = this.props.displayDates;
    }
    
    if(this.props.data){
      this.props.data.map(function(report){
        data.diagnosticReports.push(mapDiagnosticReportToRow(report, data.fhirVersion));        
      });
    } else {
      if(DiagnosticReports.find().count() > 0){
        DiagnosticReports.find().map(function(report){
          data.diagnosticReports.push(mapDiagnosticReportToRow(report, data.fhirVersion));        
        });
      }
    }
    
    if(process.env.NODE_ENV === "test") console.log("DiagnosticReportsTable[data]", data);
    return data;
  };

  renderTogglesHeader(displayToggle){
    if (displayToggle) {
      return (
        <th className="toggle">toggle</th>
      );
    }
  }
  renderToggles(displayToggle, patientId ){
    if (displayToggle) {
      return (
        <td className="toggle">
            <Toggle
              defaultToggled={true}
            />
          </td>
      );
    }
  }
  renderDateHeader(displayDates){
    if (displayDates) {
      return (
        <th className='effectiveDateTime'  style={{width: '120px'}}>effective date</th>
      );
    }
  }
  renderDate(displayDates, newDate ){
    if (displayDates) {
      return (
        <td className='date'  style={{width: '120px'}}>{ moment(newDate).format('YYYY-MM-DD') }</td>
      );
    }
  }
  rowClick(id){
    // console.log('rowClick', id)
    Session.set('diagnosticReportsUpsert', false);
    Session.set('selectedDiagnosticReport', id);
    Session.set('diagnosticReportPageTabIndex', 2);
  };
  render () {
    let tableRows = [];
    for (var i = 0; i < this.data.diagnosticReports.length; i++) {

      tableRows.push(
        <tr key={i} className="diagnosticReportRow" style={{cursor: "pointer"}} onClick={ this.rowClick.bind('this', this.data.diagnosticReports[i]._id)} >
          { this.renderToggles(this.data.displayToggle, this.data.diagnosticReports[i]) }

          <td className='subjectDisplay' style={{width: '140px'}}>{ this.data.diagnosticReports[i].subjectDisplay }</td>
          <td className='code'>{ this.data.diagnosticReports[i].code }</td>
          <td className='status'>{ this.data.diagnosticReports[i].status }</td>
          <td className='issued'  style={{width: '120px'}}>{ this.data.diagnosticReports[i].issued }</td>
          <td className='performerDisplay'>{ this.data.diagnosticReports[i].performerDisplay }</td>
          <td className='identifier'>{ this.data.diagnosticReports[i].identifier }</td>
          {/* <td className='effectiveDateTime'>{ this.data.diagnosticReports[i].effectiveDate }</td> */}
          <td className='category'>{ this.data.diagnosticReports[i].category }</td>
          { this.renderDate(this.data.displayDates, this.data.diagnosticReports[i].effectiveDate) }
        </tr>
      )
    }

    return(
      <Table id='diagnosticReportsTable' hover >
        <thead>
          <tr>
          { this.renderTogglesHeader(this.data.displayToggle) }
            <th className='subjectDisplay' style={{width: '140px'}}>subject</th>
            <th className='code'>code</th>
            <th className='status'>status</th>
            <th className='issued' style={{width: '120px'}}>issued</th>
            <th className='performerDisplay'>performer</th>
            <th className='identifier'>identifier</th>
            <th className='category'>category</th>
            { this.renderDateHeader(this.data.displayDates) }
          </tr>
        </thead>
        <tbody>
          { tableRows }
        </tbody>
      </Table>
    );
  }
}


ReactMixin(DiagnosticReportsTable.prototype, ReactMeteorData);