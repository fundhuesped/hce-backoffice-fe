(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewEvolutionController', newEvolutionController);

	newEvolutionController.$inject = ['$state', 'HCService', 'toastr', 'moment','$timeout'];

    function newEvolutionController ($state, HCService, toastr, moment, $timeout) {
      var LAST_EVOLUTION = "LAST_EVOLUTION";
	    var vm = this;
      vm.hceService = HCService;
      vm.newEvolution = {};
      vm.canSaveEvolution = HCService.canSaveEvolution;
      vm.saveNewEvolution = saveNewEvolution;
      vm.updateCurrentEvolution = updateCurrentEvolution;
      vm.closeEvolution = closeEvolution;
      vm.newEvolutionFocused = false;
      vm.isOpened = isOpened;
      vm.show = null;
      vm.toggleDropdown = toggleDropdown;


      vm.visitTypes = ['Programada', 'Demanda Espontánea', 'Ingreso de datos no presencial', 'Epicrisis', 'Otro'];
      Object.defineProperty(
          vm,
          'currentEvolution', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.currentEvolution;
          },
          set: function (value) {
            if(!HCService.currentEvolution){
              HCService.openNewEvolution();
            }
          }
      });

      activate();

      function saveNewEvolution() {
        return HCService.saveNewEvolution().then(function() {
          HCService.getEvolutions();
          toastr.success('Recargue la pagina para ver los datos guardados');
          toastr.success('Evolucion guardada con exito');
          vm.newEvolutionFocused = false;
          window.localStorage.removeItem(LAST_EVOLUTION);
        }, showError);
      }

      function updateCurrentEvolution() {
        window.localStorage.setItem(LAST_EVOLUTION, JSON.stringify(vm.currentEvolution) );
      }

      function closeEvolution() {
        HCService.closeEvolution().then(function() {
          toastr.success('Visita cerrada con exito');
        }, showError);
      }

      function toggleDropdown(section) {
        if(vm.show == section){
          vm.show = null;
        }else{
          vm.show = section;
        }
      }

	    function activate(){
        var lastEvolution = window.localStorage.getItem(LAST_EVOLUTION);
        HCService.getCurrentEvolution().$promise.then(function(){
          if( angular.isDefined(lastEvolution) && lastEvolution ){
            lastEvolution = JSON.parse( lastEvolution ); //Parse stringified object to JS objec
            vm.currentEvolution.reason = lastEvolution.reason;
            vm.currentEvolution.visitType = lastEvolution.visitType;
            vm.currentEvolution.notaClinica = lastEvolution.notaClinica;
          }
        });
	    }

      function isOpened() {
        return vm.newEvolutionFocused || vm.currentEvolution || vm.show;
      }

      function showError(error) {
        if(error){
          if(error.data){
            if(error.data.detail){
              toastr.error(error.data.detail);
            }else{
              toastr.error(error.data);
            }
          }else{
            toastr.error(error);
          }
        }else{
          toastr.error('Ocurrio un error');
        }
      }
    }
})();