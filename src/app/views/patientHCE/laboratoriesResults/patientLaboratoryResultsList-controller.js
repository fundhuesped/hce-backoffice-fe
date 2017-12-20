(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientLaboratoryResultsListController', patientLaboratoryResultsListController);

	   patientLaboratoryResultsListController.$inject = ['$state', 'HCService', 'PatientLaboratoryResult', 'Determinacion', 'toastr', 'moment', '$uibModal'];

    function patientLaboratoryResultsListController ($state, HCService, PatientLaboratoryResult, Determinacion, toastr, moment, $uibModal) {
	    var vm = this;
      vm.hceService = HCService;
      vm.searchPatientLaboratoryResults = searchPatientLaboratoryResults;
      vm.currentPage = 1;
      vm.pageSize = 6;
      vm.totalItems = null;
      vm.problems = [];
      vm.filters = {};
      vm.pageChanged = pageChanged;
      vm.labResults = [];
      vm.determinaciones = [];
      vm.newLab = {};
      vm.newLabValues = [];
      vm.getValueForDeterminacion = getValueForDeterminacion;
      vm.save = save;
      vm.canSave = canSave;
      vm.clear = clear;
      vm.canClear = canClear;

      vm.newLabDateCalendar = {
        opened: false,
        options: {
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };


      activate();

	    function activate(){
        Determinacion.getFullActiveList(function(determinaciones){
          vm.determinaciones = determinaciones;
        }, displayComunicationError);
        vm.newLabValues = [];
        vm.newLab = new PatientLaboratoryResult();
        searchPatientLaboratoryResults();
	    }

      function pageChanged() {
        searchPatientLaboratoryResults();
      }

      function save() {
        var tmpNewLab = angular.copy(vm.newLab);
        var determinacionValor;
        tmpNewLab.date = moment(tmpNewLab.date).format('YYYY-MM-DD');
        tmpNewLab.values = [];
        for (var determinacionCod in vm.newLabValues){
            if (typeof vm.newLabValues[determinacionCod] !== 'function') {
              determinacionValor = {
                value: vm.newLabValues[determinacionCod],
              };

              for (var i = vm.determinaciones.length - 1; i >= 0; i--) {
                if(vm.determinaciones[i].code == determinacionCod){
                  determinacionValor.determinacion = vm.determinaciones[i];
                  break;
                }
              }
              tmpNewLab.values.push(determinacionValor);
            }
        }
        tmpNewLab.$save({pacienteId:HCService.currentPaciente.id}, function () {
          toastr.success('Nuevo laboratorio ingresado con éxito.');
          HCService.getCurrentEvolution();
          activate();
        },displayComunicationError);
      }

      function searchPatientLaboratoryResults() {
        vm.filters.page = vm.currentPage;
        vm.filters.page_size = vm.pageSize;
        vm.filters.pacienteId = HCService.currentPacienteId;
        PatientLaboratoryResult.getPaginatedForPaciente(vm.filters, function (paginatedResult) {
          vm.labResults = paginatedResult.results;
          if(vm.currentPage===1){
            vm.totalItems = paginatedResult.count;
          }
        },displayComunicationError);
      }

      function canSave() {
        var hasValues = false;
        for (var determinacionCod in vm.newLabValues){
          if (typeof vm.newLabValues[determinacionCod] !== 'function') {
            if(vm.newLabValues[determinacionCod] && vm.newLabValues[determinacionCod] !== ""){
              hasValues = true;
              break;
            } 
          }
        }
        return vm.newLab.date && hasValues;
      }

      function clear() {
        vm.newLabValues = [];
        vm.newLab = new PatientLaboratoryResult();
      }
      function canClear() {
        var hasValues = false;
        for (var determinacionCod in vm.newLabValues){
          if (typeof vm.newLabValues[determinacionCod] !== 'function') {
            if(vm.newLabValues[determinacionCod] && vm.newLabValues[determinacionCod] !== ""){
              hasValues = true;
              break;
            } 
          }
        }
        return vm.newLab.date || hasValues;
      }

      function getValueForDeterminacion(code, result) {
        for (var i = result.values.length - 1; i >= 0; i--) {
          if(result.values[i].determinacion.code == code){
            return result.values[i].value;
          }
        }
      }

      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
        }
      }
    }
})();