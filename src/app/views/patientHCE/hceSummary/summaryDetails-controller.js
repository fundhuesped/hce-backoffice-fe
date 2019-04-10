(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('SummaryDetailsController', summaryDetailsController);

  summaryDetailsController.$inject = ['toastr', '$stateParams', 'HIVData', 'Paciente'];

    function summaryDetailsController (toastr, $stateParams, HIVData, Paciente) {
      var vm = this;
      vm.cancel = cancel;
      vm.canBeClosed = canBeClosed;
      vm.hiv_details = null;
      vm.patient_details = null;

      init();

      function init() {
        getDetails();
      }

      function cancel() {
        
      }

      function canBeClosed() {
        return true;
      }

      function getDetails() {
        Paciente.get({id:$stateParams.patientId}, function(patient){
          vm.patient_details = patient;
        }, function (err) {
          console.error(err);
          vm.patient_details = null;
        });

        HIVData.getHIVChart({patientId: $stateParams.patientId}, function (result) {
            vm.hiv_details = result;
        }, function (err) {
          console.error(err);
          vm.hiv_details = null;
        });
      }
    }
})();