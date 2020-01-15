(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewPatientVaccineController', newPatientVaccineController);

	  newPatientVaccineController.$inject = ['$state', 'HCService', 'PatientVaccine', 'toastr', 'moment', 'Vaccine', '$uibModalInstance', '$timeout', '$q'];

    function newPatientVaccineController ($state, HCService, PatientVaccine, toastr, moment, Vaccine, $uibModalInstance, $timeout, $q) {
	    var vm = this;
      vm.hceService = HCService;
      vm.newPatientVaccine = new PatientVaccine();
      vm.save = save;
      vm.getVaccines = getVaccines;
      vm.cancel = cancel;
      vm.newProblemDateOption = null;
      vm.newProblemDate = null;
      vm.canSave = canSave;
      vm.error = null;
      vm.waitingToShowError = false;
      vm.loading = false;

      vm.applicationDateCalendar = {
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

      activate();

      function save() {
        vm.error = null;
        var tmpPatientVaccine = angular.copy(vm.newPatientVaccine);
        tmpPatientVaccine.paciente = HCService.currentPaciente.id;
        tmpPatientVaccine.appliedDate = moment(tmpPatientVaccine.appliedDate).format('YYYY-MM-DD');
        if(moment(tmpPatientVaccine.appliedDate).diff(moment())>0){
          vm.error = 'La fecha de aplicación no puede ser mayor a hoy';
          return;
        }

        tmpPatientVaccine.$save({pacienteId:HCService.currentPaciente.id},function() {
          HCService.markAsDirty();
          var vaccineToDelete = new PatientVaccine();
          Object.assign(vaccineToDelete, tmpPatientVaccine);

          HCService.agregarAlHistorial(function(){
            return $q(function(resolve, reject){
              console.log("Entra a la función de borrado de una vacuna");
              vaccineToDelete.$delete(function(){
                console.log('Supuestamente pudo borrar la vacuna creada');
                resolve();
              },  function(err){
                console.error(err);
                reject();
              });
            })
          });

          toastr.success('Aplicación guardada con exito');
          $uibModalInstance.close('created');
        }, showError);
      }

      function canSave() {
        if(vm.newPatientVaccine &&vm.newPatientVaccine.vaccine && vm.newPatientVaccine.appliedDate){
          return true;
        }
        return false;
      }

	    function activate(){
        Vaccine.getActiveList(function(vaccines){
          vm.vaccines = vaccines;
        }, displayComunicationError);
	    }

      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
        }
      }

      function getVaccines($viewValue) {
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

        return Vaccine.getFullActiveList(filters, function(vaccines){
          vm.vaccines = vaccines;
          vm.loading = false;
          if (vaccines.length <= 0 && !vm.waitingToShowError){
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