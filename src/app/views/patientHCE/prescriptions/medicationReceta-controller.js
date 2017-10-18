(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('MedicationRecetaController', medicationRecetaController);

	  medicationRecetaController.$inject = ['$state', '$stateParams', 'Receta'];

    function medicationRecetaController ($state, $stateParams, Receta) {
	    var vm = this;
      vm.prescription = $stateParams.prescription;

      activate();
	    function activate(){
        if(!vm.prescriptions){
          vm.prescription = Receta.get({id:$stateParams.prescriptionId});
        }
	    }
    }
})();