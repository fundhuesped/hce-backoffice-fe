(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('SummaryDetailsController', summaryDetailsController);

  summaryDetailsController.$inject = ['toastr', '$stateParams', 'HIVData', 'Paciente', 'Evolution', 'PatientProblem', 'PatientArvTreatment', 'PatientMedication', 'PatientClinicalResult'];

    function summaryDetailsController (toastr, $stateParams, HIVData, Paciente, Evolution, PatientProblem, PatientArvTreatment, PatientMedication, PatientClinicalResult) {
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

      init();

      function init() {
        getDetails();
      }

      function cancel() {
        
      }

      function canBeClosed() {
        return true;
      }
      
      function checkTrue(string){
        return string == "true";
      }
      
      function getDetails() {
        Paciente.get({id:$stateParams.patientId}, function(patient){
          vm.patient_details = patient;
          vm.patientIdentification = (checkTrue($stateParams.showPNS))
                                      ? patient.pns
                                      : (patient.firstName + " " + patient.fatherSurname); 
        }, function (err) {
          console.error(err);
          vm.patient_details = null;
        });

        vm.showHIV = checkTrue($stateParams.showHIV);
        if(checkTrue($stateParams.showHIV)) getHIVdetails();

        vm.showEvolutions = checkTrue($stateParams.showEvolutions);
        if(checkTrue($stateParams.showEvolutions)) getEvolutionsDetails();

        vm.showProblems = checkTrue($stateParams.showProblems);
        if(checkTrue($stateParams.showProblems)) getPatienProblems();
        
        vm.showARV = checkTrue($stateParams.showARV);
        if(checkTrue($stateParams.showARV)) getArvTreatments();
        
        vm.showProfilaxis = checkTrue($stateParams.showProfilaxis);
        if(checkTrue($stateParams.showProfilaxis)) getProfilaxis();
        
        vm.showGeneral = checkTrue($stateParams.showGeneral);
        if(checkTrue($stateParams.showGeneral)) getGeneralTreatments();
        
        vm.showOthers = checkTrue($stateParams.showOthers);
        if(checkTrue($stateParams.showOthers)) getOthers();
      }

      function getHIVdetails() {
        HIVData.getHIVChart({patientId: $stateParams.patientId}, function (result) {
            vm.hiv_details = result;
        }, function (err) {
          console.error(err);
          vm.hiv_details = null;
        });
      }

      function getEvolutionsDetails() {
        Evolution.getForPaciente({pacienteId: $stateParams.patientId}, function (results) {
          vm.evolutions = results;
        }, function (err) {
          console.error(err);
          vm.evolutions = [];
        });
      }

      function getPatienProblems() {
        PatientProblem.getAllForPaciente({pacienteId: $stateParams.patientId}, function (results) {
          vm.problems = results;
        }, function (err) {
          console.error(err);
          vm.problems = [];
        });
      }

      function getArvTreatments() {
        PatientArvTreatment.getForPaciente({pacienteId: $stateParams.patientId}, function (results) {
          vm.arvTreatments = results;
        }, function (err) {
          console.error(err);
          vm.arvTreatments = [];
        });
      }

      function getProfilaxis() {
        PatientMedication.getForPaciente({pacienteId: $stateParams.patientId}, function (results) {
          vm.medications = results.filter( med => med.medication.medicationType.name == "Profilaxis" );
        }, function (err) {
          console.error(err);
          vm.medications = [];
        });
      }


      function getGeneralTreatments() {
        PatientMedication.getForPaciente({pacienteId: $stateParams.patientId}, function (results) {
          vm.generalMedications = results.filter( med => med.medication.medicationType.name != "Profilaxis" );
        }, function (err) {
          console.error(err);
          vm.generalMedications = [];
        });
      }

      function getOthers() {
        PatientClinicalResult.getForPaciente({pacienteId: $stateParams.patientId}, function (results) {
          vm.clinicalResults = results;
        }, function (err) {
          console.error(err);
          vm.clinicalResults = [];
        });
      }
    }
})();