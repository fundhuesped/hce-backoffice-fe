(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewPatientClinicalResultsController', newPatientClinicalResultsController);

	  newPatientClinicalResultsController.$inject = ['$state', 'HCService', 'PatientClinicalResult', 'toastr', 'moment', 'ClinicalStudy', '$uibModalInstance', '$timeout', '$q'];

    function newPatientClinicalResultsController ($state, HCService, PatientClinicalResult, toastr, moment, ClinicalStudy, $uibModalInstance, $timeout, $q) {
	    var vm = this;
      vm.hceService = HCService;
      vm.save = save;
      vm.newPatientClinicalResult = new PatientClinicalResult();
      vm.clinicalStudies = [];
      vm.getClinicalStudies = getClinicalStudies;
      vm.cancel = cancel;
      vm.canSave = canSave;
      vm.waitingToShowError = false;
      vm.loading = false;

      vm.studyDateCalendar = {
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

      function save() {
        var tmpPatientClinicalResult = angular.copy(vm.newPatientClinicalResult);
        tmpPatientClinicalResult.paciente = HCService.currentPaciente.id;
        tmpPatientClinicalResult.studyDate = moment(tmpPatientClinicalResult.studyDate).format('YYYY-MM-DD');

        tmpPatientClinicalResult.$save({pacienteId:HCService.currentPaciente.id},function() {
          HCService.markAsDirty();
          var clinicalResultToDelete = new PatientClinicalResult();
          Object.assign(clinicalResultToDelete, tmpPatientClinicalResult);

          HCService.agregarAlHistorial(function(){
            return $q(function(resolve, reject){
              console.log("Entra a la función de borrado de un estudio clinico");
              clinicalResultToDelete.$delete(function(){
                console.log('Supuestamente pudo eliminar el estudio clinico creado');
                resolve();
              },  function(err){
                console.error(err);
                reject();
              });
            })
          });

          toastr.success('Resultado guardado con exito');
          $uibModalInstance.close('created');
        }, showError);
      }

      function canSave() {
        if(vm.newPatientClinicalResult &&vm.newPatientClinicalResult.clinicalStudy && vm.newPatientClinicalResult.studyDate){
          return true;
        }
        return false;
      }

	    function activate(){
        ClinicalStudy.getActiveList(function(clinicalStudied){
          vm.clinicalStudied = clinicalStudied;
        }, displayComunicationError);
	    }

      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
        }
      }


      function getClinicalStudies($viewValue) {
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
        return ClinicalStudy.getFullActiveList(filters, function(clinicalStudies){
          vm.clinicalStudies = clinicalStudies;
          vm.loading = false;
          if (clinicalStudies.length <= 0 && !vm.waitingToShowError){
            toastr.warning('No se han encontrado resultados');
            vm.waitingToShowError = true;
            $timeout(
              function() {
                vm.waitingToShowError = false;
              }, 1500);
          }
        }, displayComunicationError).$promise;

      }

      function cancel() {
        $uibModalInstance.dismiss('cancel');
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
    }
})();