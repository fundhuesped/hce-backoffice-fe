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
      vm.cleanFilters = cleanFilters;
      vm.newEvolution = {};
      vm.saveNewEvolution = saveNewEvolution;
      vm.closeEvolution = closeEvolution;
      vm.cancelEvolution = cancelEvolution;
      vm.evolutionCanBeCanceled = evolutionCanBeCanceled;
      vm.searchEvolutions = searchEvolutions;
      vm.currentPage = 1;
      vm.pageSize = 5;
      vm.totalItems = null;
      vm.pageChanged = pageChanged;
      vm.evolutionCanBeCanceled = evolutionCanBeCanceled;
      vm.filters = {};
      vm.newEvolutionFocused = false;
      vm.visitTypes = ['Programada', 'Espontanea', 'Otro'];
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
        vm.filters.page = vm.currentPage;
        vm.filters.page_size = vm.pageSize;
        HCService.getEvolutions(vm.filters).$promise.then(function (paginatedResult) {
          if(vm.currentPage===1){
            vm.totalItems = paginatedResult.count;
          }
        });
      }

      function cancelEvolution(evolution) {
        HCService.cancelEvolution(evolution).then(function() {
          toastr.success('Visita anulada con exito');
        }, showError);
      }

      function evolutionCanBeCanceled(evolution) {
        return moment().diff(moment(evolution.date,'YYYY-MM-DD'), 'days') < 1;
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