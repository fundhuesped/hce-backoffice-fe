(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('HivDetailsController', hivDetailsController);

	hivDetailsController.$inject = ['toastr', '$uibModalInstance', 'HCService', 'HIVData'];

    function hivDetailsController (toastr, $uibModalInstance, HCService, HIVData) {
      var vm = this;
      vm.cancel = cancel;
      vm.canBeClosed = canBeClosed;
      vm.details = null;

      init();

      function init() {
        getDetails();
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel');
      }

      function canBeClosed() {
        return true;
      }

      function getDetails() {
        HIVData.getHIVChart({patientId: HCService.currentPacienteId}, function (result) {
            vm.details = result;
        }, function (err) {
          vm.details = null;
        });
      }
    }
})();