(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
      .module('hce.patientHCE')
      .controller('ArvMedicationRecetaController', arvMedicationRecetaController);

    arvMedicationRecetaController.$inject = ['$state', '$stateParams', 'ARVReceta', 'Preference'];

    function arvMedicationRecetaController ($state, $stateParams, ARVReceta, Preference) {
      var vm = this;
      vm.prescription = $stateParams.prescription;
      vm.numberToText = numberToText;
      vm.removeDecimals = removeDecimals;
      vm.headerImage = '';

      activate();

      function activate(){
        vm.headerImage = '/assets/images/prescription_logo.png';
        if(!vm.prescriptions){
          vm.prescription = ARVReceta.get({id:$stateParams.prescriptionId}, function (argument) {
            setTimeout(function(){
              // window.print();
            },2); 

          });

        }

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