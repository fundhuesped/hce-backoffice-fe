(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('EvolutionsController', evolutionsController);

	evolutionsController.$inject = ['$state', 'HCService', 'toastr', 'moment'];

    function evolutionsController ($state, HCService, toastr, moment) {
	    var vm = this;
      vm.hceService = HCService;
      vm.newEvolution = {};
      vm.canSaveEvolution = HCService.canSaveEvolution;
      vm.saveNewEvolution = saveNewEvolution;
      vm.closeEvolution = closeEvolution;
      vm.cancelEvolution = cancelEvolution;
      vm.canEditEvolution = canEditEvolution;
      vm.canCancelEvolution = canCancelEvolution;
      vm.searchEvolutions = searchEvolutions;
      vm.editEvolution = editEvolution;
      vm.currentPage = 1;
      vm.pageSize = 10;
      vm.totalItems = null;
      vm.pageChanged = pageChanged;
      vm.filters = {};
      vm.newEvolutionFocused = false;
      vm.visitTypes = ['Programada', 'Espontanea', 'Otro'];
      vm.isSearching = false;

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

      Object.defineProperty(
          vm,
          'evolutions', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.evolutions;
          }
      });

      activate();

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
        searchEvolutions();
	    }

      function cleanFilters() {
        vm.filters = {};
        searchEvolutions();
      }
      function pageChanged() {
        searchEvolutions();
      }
      function searchEvolutions() {
        vm.isSearching = true;
        vm.filters.page = vm.currentPage;
        vm.filters.page_size = vm.pageSize;
        HCService.getEvolutions(vm.filters).$promise.then(function (paginatedResult) {
          vm.isSearching = false;

          if(vm.currentPage===1){
            vm.totalItems = paginatedResult.count;
          }
        }, function (err) {
          vm.isSearching = false;
          displayComunicationError();
        });
      }

      function cancelEvolution(evolution) {
        HCService.cancelEvolution(evolution).then(function() {
          toastr.success('Visita anulada con exito');
        }, showError);
      }

      function canEditEvolution(evolution) {
        return evolution.status == 'Active' && moment().diff(moment(evolution.date), 'hours') <= 8;
      }

      function canCancelEvolution(evolution) {
        return evolution.status == 'Active';
      }

      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
        }
      }


      function editEvolution(evolution) {
        HCService.getEvolution({id:evolution.id}).then(function () {
        }, showError)
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