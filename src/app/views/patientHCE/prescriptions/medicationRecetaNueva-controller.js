(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('MedicationRecetaNuevaController', medicationRecetaNuevaController);

	  medicationRecetaNuevaController.$inject = ['$state', '$stateParams', 'Preference', 'Receta', 'prescriptions', '$uibModalInstance'];

    function medicationRecetaNuevaController ($state, $stateParams, Preference, Receta, prescriptions, $uibModalInstance) {
	    var vm = this;
      vm.prescriptionsIDs = prescriptions;
      vm.prescriptionsArray = [];
      vm.numberToText = numberToText;
      vm.headerImage = '';
      vm.cancel = cancel;
      vm.canBeClosed = canBeClosed;
      vm.print = print;
      vm.removeDecimals = removeDecimals;

      activate();

	    function activate(){
        Preference.get({section:'global', name: 'general__prescription_header_image'}, function (response) {
          vm.headerImage = response.value;
        })

        vm.prescriptionsIDs.forEach( function(prescriptionID) {
          var prescriptionFound = Receta.get({id: prescriptionID}, function (argument) {
            ; //Blank statement, dont delete
          });
          vm.prescriptionsArray.push(prescriptionFound);
        });
      }
      
      function cancel() {
        $uibModalInstance.dismiss('cancel');
      }

      function canBeClosed() {
        return true;
      }

      function removeDecimals(number) {
        return Math.round(number);
      }

      function print(){      
        //Copy content to parent page (not modal one) so we can Print it
        var contentToCopy = document.getElementById('section-to-copy');
        $( "#section-to-print" ).empty();
        $( "#section-to-copy" ).clone().appendTo( "#section-to-print" );
        window.print();
        this.cancel();
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