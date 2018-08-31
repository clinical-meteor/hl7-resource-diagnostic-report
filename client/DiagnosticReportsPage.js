import { CardText, CardTitle } from 'material-ui/Card';
import {Tab, Tabs} from 'material-ui/Tabs';
import { GlassCard, VerticalCanvas, Glass } from 'meteor/clinical:glass-ui';

import DiagnosticReportDetail from './DiagnosticReportDetail';
import DiagnosticReportsTable from './DiagnosticReportsTable';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

Session.setDefault('fhirVersion', 'v1.0.2')
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
      currentDiagnosticReport: Session.get('selectedDiagnosticReport'),
      fhirVersion: Session.get('fhirVersion')
    };

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    return data;
  }

  handleTabChange(index){
    Session.set('diagnosticReportPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedDiagnosticReport', false);
    Session.set('diagnosticReportUpsert', false);
  }

  render() {
    if(process.env.NODE_ENV === "test") console.log('In DiagnosticReportsPage render');
    return (
      <div id='diagnosticReportsPage'>
        <VerticalCanvas>
          <GlassCard height='auto'>
            <CardTitle title='Diagnostic Reports' />
            <CardText>
              <Tabs id="diagnosticReportsPageTabs" default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
               <Tab className='newDiagnosticReportTab' label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0}>
                 <DiagnosticReportDetail id='newDiagnosticReport' />
               </Tab>
               <Tab className="diagnosticReportListTab" label='DiagnosticReports' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                <DiagnosticReportsTable fhirVersion={ this.data.fhirVersion }/>
               </Tab>
               <Tab className="diagnosticReportDetailsTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                 <DiagnosticReportDetail 
                  id='diagnosticReportDetails' 
                  showDatePicker={true}                 
                />
               </Tab>
             </Tabs>
            </CardText>
          </GlassCard>
        </VerticalCanvas>
      </div>
    );
  }
}

ReactMixin(DiagnosticReportsPage.prototype, ReactMeteorData);

export default DiagnosticReportsPage;