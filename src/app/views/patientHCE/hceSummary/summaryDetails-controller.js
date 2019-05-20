(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('SummaryDetailsController', summaryDetailsController);

  summaryDetailsController.$inject = ['toastr', 'HIVData', 'Paciente', 'Evolution', 'PatientProblem', 'PatientArvTreatment', 'PatientMedication', 'PatientClinicalResult', 'PatientLaboratoryResult', 'PatientVaccine', '$scope', '$uibModalInstance', 'HCService'];

    function summaryDetailsController (toastr, HIVData, Paciente, Evolution, PatientProblem, PatientArvTreatment, PatientMedication, PatientClinicalResult, PatientLaboratoryResult, PatientVaccine, $scope, $uibModalInstance, HCService) {
      var vm = this;
      vm.cancel = cancel;
      vm.canBeClosed = canBeClosed;
      vm.hiv_details = null;
      vm.patient_details = null;
      vm.patientIdentification = null;
      vm.showHIV = false;
      vm.evolutions = [];
      vm.showEvolutions = false;
      vm.problems = [];
      vm.showProblems = false;
      vm.arvTreatments = [];
      vm.showARV = false;
      vm.showProfilaxis = false;
      vm.medications = [];
      vm.showOthers = false;
      vm.clinicalResults = [];
      vm.showGeneral = false;
      vm.generalMedications = [];
      vm.showLab = false;
      vm.laboratoryResults = [];
      vm.showVaccines = false;
      vm.vaccines = [];
      vm.$stateParams = $stateParams; //TODO FIXME DELETE
      vm.observations = $stateParams.observations;
      vm.issuedDate = new Date();
      vm.showPNS = showPNS;
      vm.getSchema = getSchema;
      vm.exportPDF = exportPDF;
      init();

      function init() {
        getDetails();
        toastr.info('Imprima dando click derecho -> "imprimir"', 'Instrucciones');
        toastr.info('Por favor espere unos segundos antes de imprimir', 'Cargando información...');
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel');
      }

      function canBeClosed() {
        return true;
      }
      
      function checkTrue(string){
        return string == "true";
      }
      
      function showPNS(){ //TODO FIXME Change
       return checkTrue($stateParams.showPNS) 
      }

      function getDetails() {
        Paciente.get({id:HCService.currentPacienteId}, function(patient){
          vm.patient_details = patient;
          vm.patientIdentification = (showPNS())
                                      ? patient.pns
                                      : (patient.firstName + " " + patient.fatherSurname); 
        }, function (err) {
          console.error(err);
          vm.patient_details = null;
        });

        vm.showHIV = checkTrue($stateParams.showHIV); //TODO FIXME Change
        if(checkTrue($stateParams.showHIV)) getHIVdetails();

        vm.showEvolutions = checkTrue($stateParams.showEvolutions); //TODO FIXME Change
        if(checkTrue($stateParams.showEvolutions)) getEvolutionsDetails();

        vm.showProblems = checkTrue($stateParams.showProblems); //TODO FIXME Change
        if(checkTrue($stateParams.showProblems)) getPatienProblems();
        
        vm.showARV = checkTrue($stateParams.showARV); //TODO FIXME Change
        if(checkTrue($stateParams.showARV)) getArvTreatments();
        
        vm.showProfilaxis = checkTrue($stateParams.showProfilaxis); //TODO FIXME Change
        if(checkTrue($stateParams.showProfilaxis)) getProfilaxis();
        
        vm.showGeneral = checkTrue($stateParams.showGeneral); //TODO FIXME Change
        if(checkTrue($stateParams.showGeneral)) getGeneralTreatments();
        
        vm.showLab = checkTrue($stateParams.showLab); //TODO FIXME Change
        if(checkTrue($stateParams.showLab)) getLabResults();
        
        vm.showOthers = checkTrue($stateParams.showOthers); //TODO FIXME Change
        if(checkTrue($stateParams.showOthers)) getOthers();
        
        vm.showVaccines = checkTrue($stateParams.showVaccines); //TODO FIXME Change
        if(checkTrue($stateParams.showVaccines)) getVaccines();
      }

      function getHIVdetails() {
        HIVData.getHIVChart({patientId: HCService.currentPacienteId}, function (result) {
            vm.hiv_details = result;
        }, function (err) {
          console.error(err);
          vm.hiv_details = null;
        });
      }

      function getEvolutionsDetails() {
        Evolution.getAllForPaciente({pacienteId: HCService.currentPacienteId, notState:'Error'}, function (results) {
          vm.evolutions = results;
        }, function (err) {
          console.error(err);
          vm.evolutions = [];
        });
      }

      function getPatienProblems() {
        PatientProblem.getAllForPaciente({pacienteId: HCService.currentPacienteId, notState:'Error'}, function (results) {
          vm.problems = results;
        }, function (err) {
          console.error(err);
          vm.problems = [];
        });
      }

      function getArvTreatments() {
        PatientArvTreatment.getAllForPaciente({pacienteId: HCService.currentPacienteId, notState:'Error'}, function (results) {
          vm.arvTreatments = results;
        }, function (err) {
          console.error(err);
          vm.arvTreatments = [];
        });
      }

      function getProfilaxis() {
        PatientMedication.getAllForPaciente({pacienteId: HCService.currentPacienteId, notState:'Error'}, function (results) {
          vm.medications = results.filter( function (med) {  return med.medication.medicationType.name == "Profilaxis"; } );
        }, function (err) {
          console.error(err);
          vm.medications = [];
        });
      }


      function getGeneralTreatments() {
        PatientMedication.getForPaciente({pacienteId: HCService.currentPacienteId, notState:'Error'}, function (results) {
          vm.generalMedications = results.filter( function(med) { return med.medication.medicationType.name != "Profilaxis";} );
        }, function (err) {
          console.error(err);
          vm.generalMedications = [];
        });
      }

      function getOthers() {
        PatientClinicalResult.getAllForPaciente({pacienteId: HCService.currentPacienteId, notState:'Error'}, function (results) {
          vm.clinicalResults = results;
        }, function (err) {
          console.error(err);
          vm.clinicalResults = [];
        });
      }

      function getLabResults() {
        PatientLaboratoryResult.getForPaciente({pacienteId: HCService.currentPacienteId}, function (results) {
          vm.laboratoryResults = results;
        }, function (err) {
          console.error(err);
          vm.laboratoryResults = [];
        });
      }

      function getVaccines() {
        PatientVaccine.getAllForPaciente({pacienteId: HCService.currentPacienteId, notState:'Error'}, function (results) {
          vm.vaccines = results;
        }, function (err) {
          console.error(err);
          vm.vaccines = [];
        });
      }

      function getSchema(medications) {
        var nrti = [];
        var nnrti = [];
        var ip = [];
        var ii = [];
        var combo = [];
        var other = [];
        var schema = '';
        if(!medications){
          return;
        }
        for (var i = medications.length - 1; i >= 0; i--) {
          if(medications[i].medication.medicationType.code == 'NRTI'){
            nrti.push(medications[i].medication.abbreviation);
          }
          if(medications[i].medication.medicationType.code == 'NNRTI'){
            nnrti.push(medications[i].medication.abbreviation);
          }
          if(medications[i].medication.medicationType.code == 'IP'){
            ip.push(medications[i].medication.abbreviation);
          }
          if(medications[i].medication.medicationType.code == 'INI'){
            ii.push(medications[i].medication.abbreviation);
          }
          if(medications[i].medication.medicationType.code == 'COMBO'){
            combo.push(medications[i].medication.abbreviation);
          }
          if(medications[i].medication.medicationType.code == 'OTROS'){
            other.push(medications[i].medication.abbreviation);
          }
        }
        if(nrti.length>0){
          schema += '['; 
          for (var i = nrti.length - 1; i >= 0; i--) {
            schema += nrti[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += '] '; 
        }
        if(nnrti.length>0){
          schema += '['; 
          for (var i = nnrti.length - 1; i >= 0; i--) {
            schema += nnrti[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += '] '; 
        }
        if(ip.length>0){
          schema += '['; 
          for (var i = ip.length - 1; i >= 0; i--) {
            schema += ip[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += '] '; 
        }
        if(ii.length>0){
          schema += '['; 
          for (var i = ii.length - 1; i >= 0; i--) {
            schema += ii[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += '] '; 
        }
        if(combo.length>0){
          schema += '['; 
          for (var i = combo.length - 1; i >= 0; i--) {
            schema += combo[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += '] '; 
        }
        if(other.length>0){
          schema += '['; 
          for (var i = other.length - 1; i >= 0; i--) {
            schema += other[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += ']'; 
        }
        return schema;

      }


    }
})();