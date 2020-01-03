(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewPatientProblemController', newPatientProblemController);

	  newPatientProblemController.$inject = ['$state', 'HCService', 'PatientProblem', 'toastr', 'moment', 'Problem', '$uibModalInstance', '$timeout'];

    function newPatientProblemController ($state, HCService, PatientProblem, toastr, moment, Problem, $uibModalInstance, $timeout) {
	    var vm = this;
      vm.hceService = HCService;
      vm.newPatientProblem = {
        aditionalData:{}
      };
      vm.saveNewPatientProblem = saveNewPatientProblem;
      vm.radio = {};
      vm.getProblems = getProblems;
      vm.cancelNewPatientProblem = cancelNewPatientProblem;
      vm.newProblemDateOption = null;
      vm.newProblemDate = null;
      vm.canSaveNewProblem = canSaveNewProblem;
      vm.changeStatus = changeStatus;
      vm.isHIV = isHIV;
      vm.error = null;
      vm.waitingToShowError = false;
      vm.loading = false;


      Object.defineProperty(
          vm,
          'newPatientProblem', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.newPatientProblem;
          },
          set: function (value) {
            if(!HCService.newPatientProblem){
              HCService.openNewPatientProblem();
            }
          }
      });

      activate();

      vm.startDateCalendarPopup = {
        altInputFormats: ['d!-M!-yyyy'],
        opened: false,
        options: {
          showWeeks: false,
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        },
        updateMaxDate: function () {
          this.options.maxDate = (vm.newPatientProblem.closeDate?vm.newPatientProblem.closeDate:new Date());
        }
      };

      vm.closeDateCalendarPopup = {
        altInputFormats: ['d!-M!-yyyy'],
        opened: false,
        options: {
          showWeeks: false,
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        },
        updateMinDate: function () {
          this.options.minDate = (vm.newPatientProblem.startDate?vm.newPatientProblem.startDate:new Date());
        }

      };

      vm.dateDiagnosticPopup = {
        altInputFormats: ['d!-M!-yyyy'],
        opened: false,
        options: {
          showWeeks: false,
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };

      vm.dateCalendarPopup = {
        altInputFormats: ['d!-M!-yyyy'],
        opened: false,
        options: {
          showWeeks: false,
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };

      function saveNewPatientProblem() {
        
        vm.error = null;
        if(moment(vm.newPatientProblem.startDate).diff(moment())>0){
          vm.error = 'La fecha de inicio no puede ser mayor a hoy';
          return;
        }
        if(moment(vm.newPatientProblem.closeDate).diff(moment())>0){
          vm.error = 'La fecha de fin no puede ser mayor a hoy';
          return;
        }
        if(vm.newPatientProblem.closeDate && moment(vm.newPatientProblem.startDate).diff(vm.newPatientProblem.closeDate)>0){
          vm.error = 'La fecha de fin no puede ser mayor a la fecha de inicio';
          return;
        }

        HCService.saveNewPatientProblem().then(function() {
          
          toastr.success('Problema guardado con exito');
          $uibModalInstance.close('created');

        }, showError);
      }

      function hasSelectedTransmission() {
        return vm.newPatientProblem.aditionalData.vertical || vm.newPatientProblem.aditionalData.mujeres || vm.newPatientProblem.aditionalData.hombres || vm.newPatientProblem.aditionalData.trans || vm.newPatientProblem.aditionalData.inyeccion || vm.newPatientProblem.aditionalData.accidente || vm.newPatientProblem.aditionalData.transfusion || vm.newPatientProblem.aditionalData.otraCheck || vm.newPatientProblem.aditionalData.desconocida;
      }

      function canSaveNewProblem() {
        if(vm.controllerForm.$valid){
          if(!isHIV()){
            return true;
          }else{
            if(vm.newPatientProblem.aditionalData.clinicalState && hasSelectedTransmission()){
              return true; 
            }
          }
        }
        return false;
      }

	    function activate(){
        Problem.getActiveList(function(problems){
          vm.problems = problems;
        }, displayComunicationError);
	    }

      function changeStatus() {
        if(vm.newPatientProblem.state == 'Active'){
          vm.newPatientProblem.closeDate = null;
          vm.startDateCalendarPopup.options.maxDate = new Date();
        }
      }

      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
        }
      }

      function getProblems($viewValue) {
        if($viewValue.includes(";")){
          toastr.warning("No se permite el uso de \';\' en el buscador");
          return;
        }
        if(vm.loading==false){
          toastr.info('Cargando..');
          vm.loading = true;
          $timeout(
            function() {
              vm.loading = false;
            }, 1500);
        }

        var filters = {
          name : $viewValue
        };

        return Problem.getFullActiveList(filters, function(problems){
          vm.problems = problems;
          vm.loading = false;
          if (problems.length <= 0 && !vm.waitingToShowError){
            toastr.warning('No se han encontrado resultados');
            vm.waitingToShowError = true;
            $timeout(
              function() {
                vm.waitingToShowError = false;
              }, 1500);
          }
        }, displayComunicationError).$promise;

      }

      function isHIV() {
        return vm.newPatientProblem&&vm.newPatientProblem.problem ?vm.newPatientProblem.problem.name=='Infección por HIV' || vm.newPatientProblem.problem=='Infección por HIV':false;
      }

      function cancelNewPatientProblem() {
        $uibModalInstance.dismiss('cancel');
      }

      function parseError(errorData){
        if(errorData && errorData.startsWith("AssertionError")){
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
    }
})();