(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('HivDetailsController', hivDetailsController);

	hivDetailsController.$inject = ['toastr', '$uibModalInstance', 'HCService'];

    function hivDetailsController (toastr, $uibModalInstance, HCService) {
      var vm = this;
      vm.cancel = cancel;
      vm.canBeClosed = canBeClosed;
      vm.details = getDetails();


      function cancel() {
        $uibModalInstance.dismiss('cancel');
      }

      function canBeClosed() {
        return true;
      }

      function getDetails() {
        //TODO FIXME replace this
        return HCService.currentARVTreatment;
      }

    }
})();