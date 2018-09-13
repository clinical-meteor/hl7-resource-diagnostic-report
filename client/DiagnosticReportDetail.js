// =======================================================================
// Using DSTU2  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// https://www.hl7.org/fhir/DSTU2/diagnosticreport.html
//
//
// =======================================================================


import { CardActions, CardText } from 'material-ui/Card';
import { GlassCard, VerticalCanvas, Glass } from 'meteor/clinical:glass-ui';

import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import TextField from 'material-ui/TextField';
import { browserHistory } from 'react-router';
import { get, set } from 'lodash';
import PropTypes from 'prop-types';
import { Col, Grid, Row } from 'react-bootstrap';
import { moment } from 'meteor/momentjs:moment'



Session.setDefault('fhirDiagnosticReportData', false);
Session.setDefault('fhirVersion', 'v1.0.2');

export class DiagnosticReportDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      diagnosticReportId: false,
      diagnosticReport: {
        resourceType: "DiagnosticReport",
        code: {
          text: ''
        },
        status: "final",
        issued: "",
        subject: {
          display: '',
          reference: ''
        },
        performer: {
          actor: {
            display: '',
            reference: ''
          }
        },
        identifier: [],
        category: {
          coding: []
        },
        effectiveDateTime: new Date(),
        conclusion: ""
      },
      form: {
        identifier: '',
        status: '',
        code: '',
        category: '',
        subjectDisplay: '',
        subjectReference: '',
        performerDisplay: '',
        performerReference: '',
        effectiveDateTime: '',
        conclusion: ''
      }
    }
  }
  dehydrateFhirResource(diagnosticReport) {
    let formData = Object.assign({}, this.state.form);

    formData.identifier = get(diagnosticReport, 'identifier[0].value')
    formData.status = get(diagnosticReport, 'status')    
    formData.code = get(diagnosticReport, 'code.text')
    formData.category = get(diagnosticReport, 'category.text')
    formData.subjectDisplay = get(diagnosticReport, 'subject.display')
    formData.subjectReference = get(diagnosticReport, 'subject.reference')
    formData.performerDisplay = get(diagnosticReport, 'performer.display')
    formData.performerReference = get(diagnosticReport, 'performer.reference')
    formData.effectiveDateTime = get(diagnosticReport, 'effectiveDateTime')
    formData.conclusion = get(diagnosticReport, 'conclusion')

    return formData;
  }
  shouldComponentUpdate(nextProps){
    process.env.NODE_ENV === "test" && console.log('DiagnosticReportDetail.shouldComponentUpdate()', nextProps, this.state)
    let shouldUpdate = true;

    // both false; don't take any more updates
    if(nextProps.diagnosticReport === this.state.diagnosticReport){
      shouldUpdate = false;
    }

    // received an diagnosticReport from the table; okay lets update again
    if(nextProps.diagnosticReportId !== this.state.diagnosticReportId){
      this.setState({diagnosticReportId: nextProps.diagnosticReportId})
      
      if(nextProps.diagnosticReport){
        this.setState({diagnosticReport: nextProps.diagnosticReport})     
        this.setState({form: this.dehydrateFhirResource(nextProps.diagnosticReport)})       
      }
      shouldUpdate = true;
    }
 
    return shouldUpdate;
  }
  getMeteorData() {
    let data = {
      diagnosticReportId: this.props.diagnosticReportId,
      diagnosticReport: false,
      showDatePicker: false,
      fhirVersion: this.props.fhirVersion,
      form: this.state.form
    };

    if(this.props.fhirVersion){
      data.fhirVersion = this.props.fhirVersion;
    }

    if(this.props.showDatePicker){
      data.showDatePicker = this.props.showDatePicker
    }

    if(this.props.diagnosticReport){
      data.diagnosticReport = this.props.diagnosticReport;
    }

    // if (Session.get('fhirDiagnosticReportData')) {
    //   data.diagnosticReport = Session.get('fhirDiagnosticReportData');
    // } else {
    //   // if (this.data.diagnosticReportId) {
    //   //   data.diagnosticReportId = this.data.diagnosticReportId;
    //     //console.log("selectedDiagnosticReport", this.data.diagnosticReportId);

    //     let selectedDiagnosticReport = DiagnosticReports.findOne({_id: this.data.diagnosticReportId});
    //     //console.log("selectedDiagnosticReport", selectedDiagnosticReport);

    //     if (selectedDiagnosticReport) {
    //       data.diagnosticReport = selectedDiagnosticReport;
    //     }
    //   // } else {
    //   //   data.diagnosticReport = defaultDiagnosticReport;
    //   // }
    // }
    
    // if(data.diagnosticReport.category && data.diagnosticReport.category.coding){
    //   data.diagnosticReport.category.coding.forEach(function(coding){
    //     data.diagnosticReport.categoryText = coding.code;      
    //   });
    // }

    // if(data.fhirVersion === "v1.0.2"){
    //   data.diagnosticReport.performerDisplay = get(data, 'diagnosticReport.performer.display');
    //   data.diagnosticReport.performerReference = get(data, 'diagnosticReport.performer.reference');
    // }

    // if(data.fhirVersion === "v3.0.1"){
    //   data.diagnosticReport.performerDisplay = get(data, 'diagnosticReport.performer[0].actor.display');
    //   data.diagnosticReport.performerReference = get(data, 'diagnosticReport.performer[0].actor.reference');
    // }
    

    // if (this.data.diagnosticReportId) {
    //   data.diagnosticReportId = this.data.diagnosticReportId;
    // }  


    console.log('DiagnosticReportDetail[data]', data);
    return data;
  }
  renderDatePicker(showDatePicker, datePickerValue){
    if (typeof datePickerValue === "string"){
      datePickerValue = new Date(datePickerValue);
    }
    if (showDatePicker) {
      return (
        <Row>
          <Col md={3} >
            <DatePicker 
              name='effectiveDate'
              floatingLabelText="Effective Date" 
              hintText="YYYY-MM-DD" 
              container="inline" 
              mode="landscape"
              value={ datePickerValue ? datePickerValue : null}    
              onChange={ this.changeState.bind(this, 'effectiveDate')}    
              floatingLabelFixed={true}
              fullWidth  
              />    
          </Col>
        </Row>     
      );
    }
  }
  render() {
    if(process.env.NODE_ENV === "test") console.log('DiagnosticReportDetail.render()', this.state)
    let formData = this.state.form;

    return (
      <div id={this.props.id} className="diagnosticReportDetail">
        <CardText>
        <Row>
            <Col md={3}>
              <TextField
                id='identifierInput'
                ref='identifier'
                name='identifier'
                floatingLabelText='Identifier'
                value={ get(formData, 'identifier') }
                onChange={ this.changeState.bind(this, 'identifier')}
                hintText='CR-01292494'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='statusInput'
                ref='status'
                name='status'
                floatingLabelText='Status'
                value={ get(formData, 'status') }
                onChange={ this.changeState.bind(this, 'status')}
                hintText='final'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='codeInput'
                ref='code'
                name='code'
                floatingLabelText='Code'
                value={ get(formData, 'code') }
                onChange={ this.changeState.bind(this, 'code')}
                hintText='Chest PA/Lateral'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={3}>
              <TextField
                id='categoryInput'
                ref='category'
                name='category'
                floatingLabelText='Category'
                value={ get(formData, 'category') }
                onChange={ this.changeState.bind(this, 'category')}
                hintText='Computed Radiography'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
          </Row>
          <Row>
            <Col md={6} >
              <TextField
                id='subjectDisplayInput'
                ref='subjectDisplay'
                name='subjectDisplay'
                floatingLabelText='Subject'
                value={ get(formData, 'subjectDisplay') }
                onChange={ this.changeState.bind(this, 'subjectDisplay')}
                hintText='Jane Doe'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={6} >
              <TextField
                id='subjectReferenceInput'
                ref='subjectReference'
                name='subjectReference'
                floatingLabelText='Subject Reference'
                value={ get(formData, 'subjectReference') }
                onChange={ this.changeState.bind(this, 'subjectReference')}
                hintText='Patient/123456790'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
          </Row>
          <Row>
            <Col md={6} >
              <TextField
                id='performerDisplayInput'
                ref='performerDisplay'
                name='performerDisplay'
                floatingLabelText='Performer'
                value={ get(formData, 'performerDisplay') }
                onChange={ this.changeState.bind(this, 'performerDisplay')}
                hintText='Gregory House'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={6} >
              <TextField
                id='performerReferenceInput'
                ref='performerReference'
                name='performerReference'
                floatingLabelText='Performer'
                value={ get(formData, 'performerReference') }
                onChange={ this.changeState.bind(this, 'performerReference')}
                hintText='Practitioner/123456790'
                floatingLabelFixed={true}
                fullWidth
                /><br/>   
            </Col>
          </Row>

          { this.renderDatePicker(true, get(formData, 'effectiveDate') ) }

          <TextField
            id='conclusionInput'
            ref='conclusion'
            name='conclusion'
            floatingLabelText='Conclusion'
            value={ get(formData, 'conclusion') }
            onChange={ this.changeState.bind(this, 'conclusion')}
            multiLine={true}          
            rows={5}
            fullWidth
            /><br/>
      </CardText>
        <CardActions>
          { this.determineButtons(this.data.diagnosticReportId) }
        </CardActions>
      </div>
    );
  }

  determineButtons(diagnosticReportId){
    if (diagnosticReportId) {
      return (
        <div>
          <RaisedButton id="updateDiagnosticReportButton" label="Save" primary={true} onClick={this.handleSaveButton.bind(this)}  style={{marginRight: '20px'}}  />
          <RaisedButton id="deleteDiagnosticReportButton" label="Delete" onClick={this.handleDeleteButton.bind(this)} />
        </div>
      );
    } else {
      return(
        <RaisedButton id="saveDiagnosticReportButton" label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }
  updateFormData(formData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("DiagnosticReportDetail.updateFormData", formData, field, textValue);

    switch (field) {
      case "identifier":
        set(formData, 'identifier', textValue)
        break;
      case "status":
        set(formData, 'status', textValue)
        break;        
      case "code":
        set(formData, 'code', textValue)
        break;
      case "category":
        set(formData, 'category', textValue)
        break;

      case "subjectDisplay":
        set(formData, 'subjectDisplay', textValue)
        break;
      case "subjectReference":
        set(formData, 'subjectReference', textValue)
        break;
      case "performerDisplay":
        set(formData, 'performerDisplay', textValue)
        break;
      case "performerReference":
        set(formData, 'performerReference', textValue)
        break;
      case "effectiveDateTime":
        set(formData, 'effectiveDateTime', textValue)
        break;
      case "conclusion":
        set(formData, 'conclusion', textValue)
        break;
      default:
    }

    if(process.env.NODE_ENV === "test") console.log("formData", formData);
    return formData;
  }
  updateDiagnosticReport(diagnosticReportData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("DiagnosticReportDetail.updateDiagnosticReport", diagnosticReportData, field, textValue);

    switch (field) {
      case "identifier":
        set(diagnosticReportData, 'identifier[0].value', textValue)
        break;
      case "status":
        set(diagnosticReportData, 'status', textValue)
        break;        
      case "code":
        set(diagnosticReportData, 'code.text', textValue)
        break;
      case "category":
        set(diagnosticReportData, 'category.text', textValue)
        break;

      case "subjectDisplay":
        set(diagnosticReportData, 'subject.display', textValue)
        break;
      case "subjectReference":
        set(diagnosticReportData, 'subject.reference', textValue)
        break;
      case "performerDisplay":
        set(diagnosticReportData, 'performer.display', textValue)
        break;
      case "performerReference":
        set(diagnosticReportData, 'performer.reference', textValue)
        break;
      case "effectiveDateTime":
        set(diagnosticReportData, 'effectiveDateTime', textValue)
        break;
      case "conclusion":
        set(diagnosticReportData, 'conclusion', textValue)
        break;
      default:
    }
    return diagnosticReportData;
  }


  changeState(field, event, textValue){
    if(process.env.NODE_ENV === "test") console.log("   ");
    if(process.env.NODE_ENV === "test") console.log("DiagnosticReportDetail.changeState", field, textValue);
    if(process.env.NODE_ENV === "test") console.log("this.state", this.state);

    let formData = Object.assign({}, this.state.form);
    let diagnosticReportData = Object.assign({}, this.state.diagnosticReport);

    formData = this.updateFormData(formData, field, textValue);
    diagnosticReportData = this.updateDiagnosticReport(diagnosticReportData, field, textValue);

    if(process.env.NODE_ENV === "test") console.log("diagnosticReportData", diagnosticReportData);
    if(process.env.NODE_ENV === "test") console.log("formData", formData);

    this.setState({diagnosticReport: diagnosticReportData})
    this.setState({form: formData})
  }

  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    let self = this;

    console.log('Saving a new DiagnosticReport...', this.state)

    let fhirDiagnosticReportData = Object.assign({}, this.state.diagnosticReport);

    if(process.env.NODE_ENV === "test") console.log('fhirDiagnosticReportData', fhirDiagnosticReportData);


    let diagnosticReportValidator = DiagnosticReportSchema.newContext();
    diagnosticReportValidator.validate(fhirDiagnosticReportData)

    console.log('IsValid: ', diagnosticReportValidator.isValid())
    console.log('ValidationErrors: ', diagnosticReportValidator.validationErrors());

    if (this.data.diagnosticReportId) {
      if(process.env.NODE_ENV === "test") console.log("Updating diagnosticReport...");
      delete fhirDiagnosticReportData._id;

      fhirDiagnosticReportData.issued = new Date();
      
      DiagnosticReports._collection.update(
        {_id: this.data.diagnosticReportId}, {$set: fhirDiagnosticReportData }, function(error, result) {
          if (error) {
            console.log("error", error);

            Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "DiagnosticReports", recordId: self.data.diagnosticReportId});
            Session.set('diagnosticReportPageTabIndex', 1);
            Session.set('selectedDiagnosticReport', false);
            Session.set('fhirDiagnosticReportData', false);
            Bert.alert('DiagnosticReport updated!', 'success');
          }
        });
    } else {

      if(process.env.NODE_ENV === "test") {
        console.log("create a new diagnosticReport", fhirDiagnosticReportData);
      }

      fhirDiagnosticReportData.effectiveDateTime = new Date();
      fhirDiagnosticReportData.issued = new Date();

      // if(this.data.fhirVersion === "v1.0.2"){
      //   fhirDiagnosticReportData.performer = fhirDiagnosticReportData.performer[0];
      // }
      
      DiagnosticReports._collection.insert(fhirDiagnosticReportData,function(error, result) {
        if (error) {
          console.log("error", error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "DiagnosticReports", recordId: result});
          Session.set('diagnosticReportPageTabIndex', 1);
          Session.set('selectedDiagnosticReport', false);
          Session.set('fhirDiagnosticReportData', false);
          Bert.alert('DiagnosticReport added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('diagnosticReportPageTabIndex', 1);
  }

  handleDeleteButton(){
    let self = this;
    DiagnosticReports._collection.remove({_id: this.data.diagnosticReportId}, function(error, result){
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "DiagnosticReports", recordId: self.data.diagnosticReportId});
        Session.set('diagnosticReportPageTabIndex', 1);
        Session.set('selectedDiagnosticReport', false);
        Session.set('fhirDiagnosticReportData', false);
        Bert.alert('DiagnosticReport removed!', 'success');
      }
    });
  }
}


DiagnosticReportDetail.propTypes = {
  id: PropTypes.string,
  diagnosticReportId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  diagnosticReport: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
};
ReactMixin(DiagnosticReportDetail.prototype, ReactMeteorData);
export default DiagnosticReportDetail;