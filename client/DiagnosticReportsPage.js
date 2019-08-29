import { CardText, CardTitle } from 'material-ui/Card';
import {Tab, Tabs} from 'material-ui/Tabs';
import { GlassCard, VerticalCanvas, FullPageCanvas, Glass } from 'meteor/clinical:glass-ui';

import DiagnosticReportDetail from './DiagnosticReportDetail';
import DiagnosticReportsTable from './DiagnosticReportsTable';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('selectedDiagnosticReportId', false);

export class DiagnosticReportsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('diagnosticReportPageTabIndex'),
      diagnosticReportSearchFilter: Session.get('diagnosticReportSearchFilter'),
      selectedDiagnosticReportId: Session.get('selectedDiagnosticReportId'),
      fhirVersion: Session.get('fhirVersion'),
      selectedDiagnosticReport: false
    };

    if (Session.get('selectedDiagnosticReportId')){
      data.selectedDiagnosticReport = DiagnosticReports.findOne({_id: Session.get('selectedDiagnosticReportId')});
    } else {
      data.selectedDiagnosticReport = false;
    }

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    return data;
  }

  handleTabChange(index){
    Session.set('diagnosticReportPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedDiagnosticReportId', false);
    Session.set('diagnosticReportUpsert', false);
  }

  render() {
    if(process.env.NODE_ENV === "test") console.log('In DiagnosticReportsPage render');
    return (
      <div id='diagnosticReportsPage'>
        <FullPageCanvas>
          <GlassCard height='auto'>
            <CardTitle title='Diagnostic Reports' />
            <CardText>
              <Tabs id="diagnosticReportsPageTabs" default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
               <Tab className='newDiagnosticReportTab' label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0}>
                 <DiagnosticReportDetail 
                  id='newDiagnosticReport'
                  fhirVersion={ this.data.fhirVersion }
                  diagnosticReport={ this.data.selectedDiagnosticReport }
                  diagnosticReportId={ this.data.selectedDiagnosticReportId } />  
               </Tab>
               <Tab className="diagnosticReportListTab" label='DiagnosticReports' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                <DiagnosticReportsTable fhirVersion={ this.data.fhirVersion }/>
               </Tab>
               <Tab className="diagnosticReportDetailsTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                 <DiagnosticReportDetail 
                  id='diagnosticReportDetails' 
                  showDatePicker={true}   
                  fhirVersion={ this.data.fhirVersion }
                  diagnosticReport={ this.data.selectedDiagnosticReport }
                  diagnosticReportId={ this.data.selectedDiagnosticReportId } />               
               </Tab>
             </Tabs>
            </CardText>
          </GlassCard>
        </FullPageCanvas>
      </div>
    );
  }
}

ReactMixin(DiagnosticReportsPage.prototype, ReactMeteorData);

export default DiagnosticReportsPage;