(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('MedicationRecetaController', medicationRecetaController);

	  medicationRecetaController.$inject = ['$state', '$stateParams', 'Receta', 'prescriptionId', '$uibModalInstance'];

    function medicationRecetaController ($state, $stateParams, Receta, prescriptionId, $uibModalInstance) {
	    var vm = this;
      vm.prescription = $stateParams.prescription;
      vm.numberToText = numberToText;

      activate();

	    function activate(){
        if(!vm.prescriptions){
          var id;
          if(prescriptionId){
            id = prescriptionId;
          }else{
            id = $stateParams.prescriptionId;
          }
          vm.prescription = Receta.get({id:id}, function (argument) {
            setTimeout(function(){
              window.print();
              $uibModalInstance.close('created');
            },2); 

          });

        }

	    }

      function numberToText(number) {
        switch(number) {
            case 1:
              return 'uno';
            case 2:
              return 'dos';
            case 3:
              return 'tres';
            case 4:
              return 'cuatro';
            case 5:
              return 'cinco';
            case 6:
              return 'seis';
            case 7:
              return 'siete';
            case 8:
              return 'ocho';
            case 9:
              return 'nueve';
            case 10:
              return 'diez';
            case 11:
              return 'once';
            case 12:
              return 'doce';
            case 13:
              return 'trece';
            default:
              return '';
        }
      }
    }
})();