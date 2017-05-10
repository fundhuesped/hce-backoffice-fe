(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('OverviewController', overviewController);

	overviewController.$inject = ['HCService', 'toastr'];

    function overviewController (HCService, toastr) {
	    var vm = this;
        vm.saveNewEvolution = saveNewEvolution;
        vm.closeEvolution = closeEvolution;

        activate();


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

	    function activate(){
            HCService.getCurrentEvolution();
	    }

        function saveNewEvolution() {
            HCService.saveNewEvolution().then(function() {
              toastr.success('Visita guardada con exito');
            }, showError);
        }

        function closeEvolution() {
            HCService.closeEvolution().then(function() {
              toastr.success('Visita cerrada con exito');
            }, showError);
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