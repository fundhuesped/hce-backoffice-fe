(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('PatientLaboratoryResultsListController', patientLaboratoryResultsListController);

	   patientLaboratoryResultsListController.$inject = ['$state', 'HCService', 'PatientLaboratoryResult', 'Determinacion', 'toastr', 'moment', '$uibModal', 'lodash', 'SessionService', '$q'];

    function patientLaboratoryResultsListController ($state, HCService, PatientLaboratoryResult, Determinacion, toastr, moment, $uibModal, lodash, SessionService, $q) {
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
      vm.hasPermissions = false;
      vm.canSave = canSave;
      vm.clear = clear;
      vm.canClear = canClear;
      vm.categoriasDeterminaciones = [];
      vm.toggleCategoria = toggleCategoria;
      vm.todayDate = new Date();

      vm.isLowerThanLimit = isLowerThanLimit;
      vm.isBiggerThanLimit = isBiggerThanLimit;

      vm.newLabDateCalendar = {
        opened: false,
        altInputFormats: ['d!-M!-yyyy'],
        options: {
          showWeeks: false,
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };


      activate();

	    function activate(){
        toastr.info('Cargando..');
        Determinacion.getFullActiveList(function(determinaciones){
          for (var i = vm.categoriasDeterminaciones.length - 1; i >= 0; i--) {
            vm.categoriasDeterminaciones[i].determinaciones = [];
          }
          var found = false;
          for (var i = 0; i < determinaciones.length; i++) {
            found = false;
            for (var j = vm.categoriasDeterminaciones.length - 1; j >= 0; j--) {
              if( determinaciones[i].category && (vm.categoriasDeterminaciones[j].id == determinaciones[i].category.id)){
                vm.categoriasDeterminaciones[j].determinaciones.push(determinaciones[i]);
                found = true;
                break;
              }
            }
            if(!found && determinaciones[i].category){
              var tmpCategory = angular.copy(determinaciones[i].category);
              tmpCategory.determinaciones = [determinaciones[i]];
              tmpCategory.show = false;
              vm.categoriasDeterminaciones.push(tmpCategory);
            }
          }
          vm.categoriasDeterminaciones = lodash.orderBy(vm.categoriasDeterminaciones, 'order');
          
          vm.categoriasDeterminaciones = vm.categoriasDeterminaciones.map( function(elem){
            var temp_elem = angular.copy(elem);
            temp_elem.determinaciones = lodash.orderBy(elem.determinaciones, ['order', 'label']);
            return temp_elem;
          });
          vm.determinaciones = determinaciones;
        }, displayComunicationError);
        vm.newLabValues = [];
        vm.newLab = new PatientLaboratoryResult();
        searchPatientLaboratoryResults();


        SessionService.checkPermission('hc_laboratory.add_labresult')
            .then( function(hasPerm){
                vm.hasPermissions = hasPerm;
            }, function(error){
                vm.hasPermissions = false;
                console.error("=== Error al verificar permisos en controlador ===");
                console.error(error);
                console.trace();
            });
	    }

      function pageChanged() {
        searchPatientLaboratoryResults();
      }

      function save() {
        var tmpNewLab = angular.copy(vm.newLab);
        var determinacionValor;
        // tmpNewLab.date = moment(tmpNewLab.date).format('YYYY-MM-DD');
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
          HCService.markAsDirty();
          var laboratoryToDelete = new PatientLaboratoryResult();
          Object.assign(laboratoryToDelete, tmpNewLab);
          HCService.agregarAlHistorial( function(){
            return $q(function(resolve, reject){
            console.log("Entra a la función de borrado de un laboratorio");
            laboratoryToDelete.$delete({id:laboratoryToDelete.id}, function() {
              console.log('Supuestamente pudo borrar el laboratorio creado');
              resolve();
            },  function(err){
              console.error(err);
              reject();
            });
          })});
          toastr.success('Nuevo laboratorio ingresado con éxito.');
          HCService.getCurrentEvolution();
          activate();
        },showError);
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
        if(vm.hasPermissions == false) return false;
        for (var determinacionCod in vm.newLabValues){
          if (typeof vm.newLabValues[determinacionCod] !== 'function') {
            if(vm.newLabValues[determinacionCod] && vm.newLabValues[determinacionCod] !== ""){
              hasValues = true;
              break;
            } 
          }
        }
        var validDate = new Date(vm.newLab.date) <= vm.todayDate;
        return (vm.newLab.date || hasValues)  && validDate;
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

      function toggleCategoria(category) {
        category.show = !category.show;
      }

      function getValueForDeterminacion(code, result) {
        for (var i = result.values.length - 1; i >= 0; i--) {
          if(result.values[i].determinacion.code == code){
            return result.values[i].value;
          }
        }
      }

      function isLowerThanLimit(determinacion, result) {
        return determinacion.lowerLimit&&parseFloat(determinacion.lowerLimit)>parseFloat(getValueForDeterminacion(determinacion.code,result));
      }

      function isBiggerThanLimit(determinacion, result) {
        return determinacion.upperLimit&&parseFloat(determinacion.upperLimit)<parseFloat(getValueForDeterminacion(determinacion.code,result));
      }


      function parseError(errorData){
        if(errorData && (typeof errorData === 'string' || errorData instanceof String) && errorData.startsWith("AssertionError")){
          var errorAuxArray = (errorData.split('\n'));
          var errorToReturn = errorAuxArray[1];
          return errorToReturn;
        }
        return errorData;
      }
    
      function showError(error) {
        if(error){
          if(error.data){
            var errorToShow = parseError(error.data);
            if(errorToShow.detail){
              toastr.error(errorToShow.detail);
            }else{
              toastr.error(errorToShow);
            }
          }else{
            toastr.error(error);
          }
        }else{
          toastr.error('Ocurrio un error');
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