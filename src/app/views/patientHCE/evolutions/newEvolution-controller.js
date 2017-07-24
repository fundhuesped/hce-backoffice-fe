(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewEvolutionController', newEvolutionController);

	newEvolutionController.$inject = ['$state', 'HCService', 'toastr', 'moment'];

    function newEvolutionController ($state, HCService, toastr, moment) {
	    var vm = this;
      vm.hceService = HCService;
      vm.newEvolution = {};
      vm.canSaveEvolution = HCService.canSaveEvolution;
      vm.saveNewEvolution = saveNewEvolution;
      vm.closeEvolution = closeEvolution;
      vm.newEvolutionFocused = false;
      vm.visitTypes = ['Programada', 'Demanda Espontánea', 'Otro'];
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


      vm.fromCalendarPopup = {
        opened: false,
        options: {
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };

      vm.toCalendarPopup = {
        opened: false,
        options: {
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };

      function saveNewEvolution() {
        HCService.saveNewEvolution().then(function() {
          toastr.success('Visita guardada con exito');
          vm.newEvolutionFocused = false;
        }, showError);
      }

      function closeEvolution() {
        HCService.closeEvolution().then(function() {
          toastr.success('Visita cerrada con exito');
        }, showError);
      }

	    function activate(){
        HCService.getCurrentEvolution();
	    }

      function showError(error) {
        if(error){
          toastr.error(error);
        }else{
          toastr.error('Ocurrio un error');
        }
      }
    }
})();