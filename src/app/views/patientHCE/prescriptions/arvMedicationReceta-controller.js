(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
      .module('hce.patientHCE')
      .controller('ArvMedicationRecetaController', arvMedicationRecetaController);

    arvMedicationRecetaController.$inject = ['$state', '$stateParams', 'ARVReceta', 'Preference', '$uibModalInstance'];

    function arvMedicationRecetaController ($state, $stateParams, ARVReceta, Preference, $uibModalInstance) {
      var vm = this;
      vm.prescriptionsIDs = $stateParams.prescriptions;
      vm.prescriptions = [];
      vm.numberToText = numberToText;
      vm.removeDecimals = removeDecimals;
      vm.headerImage = '';
      vm.cancel = cancel;
      vm.canBeClosed = canBeClosed;
      vm.print = print;

      activate();

      function activate(){
        Preference.get({section:'global', name: 'general__prescription_header_image'}, function (response) {
          vm.headerImage = response.value;
        })
        vm.prescriptionsIDs.array.forEach(prescriptionID => {
          const prescriptionFound = ARVReceta.get({id: prescriptionID}, function (argument) {
            ; //Blank statement, dont delete
          });
          vm.prescriptions.push(prescriptionFound);
        });
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel');
      }

      function canBeClosed() {
        return true;
      }

      function print(){      
        //Copy content to parent page (not modal one) so we can Print it
        var contentToCopy = document.getElementById('section-to-copy');
        console.log("--- copy ---");
        console.log(contentToCopy);
        $( "#section-to-print" ).empty();
        $( "#section-to-copy" ).clone().appendTo( "#section-to-print" );
        window.print();
        this.cancel();
      }

      function removeDecimals(number) {
        var splitted = number.split('.');
        if(splitted.length == 1){
          return number;
        }
        if(parseInt(splitted[1])>0){
          return number;          
        }
        return splitted[0];
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