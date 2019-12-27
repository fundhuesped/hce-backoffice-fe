(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('EditPatientVaccineController', editPatientVaccineController);

	  editPatientVaccineController.$inject = ['$state', 'HCService', 'PatientVaccine', 'toastr', 'moment', 'Vaccine', '$uibModalInstance', 'patientVaccine', 'SessionService'];

    function editPatientVaccineController ($state, HCService, PatientVaccine, toastr, moment, Vaccine, $uibModalInstance, patientVaccine, SessionService) {
	    var vm = this;
      vm.hceService = HCService;
      vm.save = save;
      vm.patientVaccine = {};
      vm.getVaccines = getVaccines;
      vm.cancel = cancel;
      vm.hasPermissions = false;
      vm.canSave = canSave;
      vm.markAsError = markAsError;
      vm.error = null;
      vm.uneditedVaccine = patientVaccine;

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
        var tmpPatientVaccine = angular.copy(vm.patientVaccine);
        tmpPatientVaccine.appliedDate = moment(tmpPatientVaccine.appliedDate).format('YYYY-MM-DD');

        if(moment(tmpPatientVaccine.appliedDate).diff(moment())>0){
          vm.error = 'La fecha de aplicación no puede ser mayor a hoy';
          return;
        }

        var vaccineToUnedit = new PatientVaccine();
        vaccineToUnedit.appliedDate = moment(vaccineToUnedit.appliedDate).format('YYYY-MM-DD');
        Object.assign(vaccineToUnedit, tmpVaccine);
        HCService.agregarAlHistorial(function(){
          vaccineToUnedit.$delete(function(){
            console.log('Supuestamente pudo borrar la vacuna editada');
            vaccineToUnedit.$save({pacienteId:HCService.currentPacienteId}, function(){
              console.log('Supuestamente pudo volver a crear la vacuna previo a ser editada');
            },  console.error);
          },  console.error);
        });

        PatientVaccine.update(tmpPatientVaccine,function() {
          HCService.markAsDirty();
          toastr.success('Aplicación guardada con exito');
          $uibModalInstance.close('edited');
        }, showError);
      }

      function canSave() {
        if(vm.patientVaccine &&vm.patientVaccine.vaccine && vm.patientVaccine.appliedDate){
          return true;
        }
        return false;
      }

	    function activate(){
        Vaccine.getActiveList(function(vaccines){
          vm.vaccines = vaccines;
        }, displayComunicationError);
        vm.patientVaccine = angular.copy(patientVaccine);
        vm.patientVaccine.appliedDate = new Date(vm.patientVaccine.appliedDate + 'T03:00:00');

        SessionService.checkPermission('hc_hce.add_patientvaccine')
            .then( function(hasPerm){
                vm.hasPermissions = hasPerm;
            }, function(error){
                vm.hasPermissions = false;
                console.error("=== Error al verificar permisos en controlador ===");
                console.error(error);
                console.trace();
            });
	    }

      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
        }
      }

      function getVaccines($viewValue) {
        var filters = {
          name : $viewValue
        };

        return Vaccine.getFullActiveList(filters, function(vaccines){
          vm.vaccines = vaccines;
        }, displayComunicationError).$promise;

      }

      function markAsError() {
        var tmpVaccine = angular.copy(vm.patientVaccine);
        tmpVaccine.appliedDate = moment(tmpVaccine.appliedDate).format('YYYY-MM-DD');

        var vaccineToUnmarkAsError = new PatientVaccine();
        Object.assign(vaccineToUnmarkAsError, tmpVaccine);
        HCService.agregarAlHistorial(function(){
          vaccineToUnmarkAsError.$delete(function(){
            console.log('Supuestamente pudo borrar la vacuna marcada como error');
            vaccineToUnmarkAsError.$save({pacienteId:HCService.currentPacienteId}, function(){
              console.log('Supuestamente pudo volver a crear la vacuna previo a ser marcada como error');
            },  console.error);
          },  console.error);
        });

        tmpVaccine.state = PatientVaccine.stateChoices.STATE_ERROR;
        PatientVaccine.update(tmpVaccine, function (response) {
          HCService.markAsDirty();
          toastr.success('Aplicación marcada como error');
          $uibModalInstance.close('markedError');
        }, function (err) {
            console.error(err);
            toastr.error('Ocurrio un error');
        });
      }


      function cancel() {
        $uibModalInstance.dismiss('cancel');
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