(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('CloseEvolutionController', closeEvolutionController);

	  closeEvolutionController.$inject = ['$uibModalInstance', 'canDiscardChanges'];

    function closeEvolutionController ($uibModalInstance, canDiscardChanges) {
	    var vm = this;
      vm.discardChanges = discardChanges;
      vm.saveChanges = saveChanges;
      vm.cancel = cancel;
      vm.canDiscardChanges = canDiscardChanges;

      function saveChanges() {
        $uibModalInstance.close('save');
      }

      function discardChanges() {
        $uibModalInstance.close('discard');
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel');
      }

    }
})();