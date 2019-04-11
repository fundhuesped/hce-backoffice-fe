(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('SummaryDetailsController', summaryDetailsController);

  summaryDetailsController.$inject = ['toastr', '$stateParams', 'HIVData', 'Paciente', 'Evolution', 'PatientProblem'];

    function summaryDetailsController (toastr, $stateParams, HIVData, Paciente, Evolution, PatientProblem) {
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
          vm.evolutions = null;
        });
      }

      function getPatienProblems() {
        PatientProblem.getAllForPaciente({pacienteId: $stateParams.patientId}, function (results) {
          vm.problems = results;
        }, function (err) {
          console.error(err);
          vm.problems = null;
        });
      }
    }
})();