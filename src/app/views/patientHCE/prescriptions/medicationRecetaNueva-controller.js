(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('MedicationRecetaNuevaController', medicationRecetaNuevaController);

	  medicationRecetaNuevaController.$inject = ['$state', '$stateParams', 'Preference', 'Receta'];

    function medicationRecetaNuevaController ($state, $stateParams, Preference, Receta) {
	    var vm = this;
      vm.prescription = $stateParams.prescription;
      vm.issuedDate = $stateParams.issuedDate;
      vm.numberToText = numberToText;
      vm.headerImage = '';

      activate();

	    function activate(){
        if(!vm.prescriptions){
          Preference.get({section:'global', name: 'general__prescription_header_image'}, function (response) {
            vm.headerImage = response.value;
          })

          vm.prescription = Receta.get({id:$stateParams.prescriptionId}, function (argument) {
            setTimeout(function(){
              // window.print();
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