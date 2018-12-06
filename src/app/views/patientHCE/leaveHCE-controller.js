(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('LeaveHCEController', leaveHCEController);

	  leaveHCEController.$inject = ['$uibModalInstance'];

    function leaveHCEController ($uibModalInstance) {
	    var vm = this;
      vm.cancel = cancel;
      vm.accept = accept;
      function accept() {
        $uibModalInstance.close('leave');
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel');
      }

    }
})();