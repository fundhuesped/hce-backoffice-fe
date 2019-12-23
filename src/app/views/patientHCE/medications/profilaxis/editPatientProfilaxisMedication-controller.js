(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('EditPatientProfilaxisMedicationController', editPatientProfilaxisMedicationController);

	  editPatientProfilaxisMedicationController.$inject = ['$state', 'HCService', 'PatientMedication', 'toastr', 'moment', 'Medication', 'PatientProblem', '$uibModalInstance', 'patientMedication', 'SessionService'];

    function editPatientProfilaxisMedicationController ($state, HCService, PatientMedication, toastr, moment, Medication, PatientProblem, $uibModalInstance, patientMedication, SessionService ) {
	    var vm = this;
      vm.hceService = HCService;
      vm.save = save;
      vm.patientMedication = {};
      vm.getMedications = getMedications;
      vm.cancel = cancel;
      vm.hasPermissions = false;
      vm.canSave = canSave;
      vm.markAsError = markAsError;
      vm.changeStatus = changeStatus;
      vm.canEdit = canEdit;
      vm.activeProblems = [];
      vm.uneditedPatientMedication = patientMedication;
      vm.applicationDateCalendar = {
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


      vm.startDateCalendar = {
        opened: false,
        altInputFormats: ['d!-M!-yyyy'],
        updateMaxVal: function (value) {
          this.options.maxDate = (vm.patientMedication.endDate?vm.patientMedication.endDate:new Date());
        },
        options: {
          showWeeks: false,
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };

      vm.endDateCalendar = {
        opened: false,
        altInputFormats: ['d!-M!-yyyy'],
        updateMinVal: function () {
          this.options.minDate = (vm.patientMedication.startDate?vm.patientMedication.startDate:new Date());
        },
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

        var tmpPatientMedication = angular.copy(vm.patientMedication);
        tmpPatientMedication.startDate = moment(tmpPatientMedication.startDate).format('YYYY-MM-DD');
        if(tmpPatientMedication.endDate && tmpPatientMedication.state == 'Closed'){
          tmpPatientMedication.endDate = moment(tmpPatientMedication.endDate).format('YYYY-MM-DD');
        }
        if(tmpPatientMedication.endDate && tmpPatientMedication.state == 'Active'){
         tmpPatientMedication.endDate = null; 
        }
        delete tmpPatientMedication.medicationPresentation;

        var medicationToUnedit = new PatientMedication();
        Object.assign(medicationToUnedit, vm.uneditedPatientMedication); //como lo estoy copiando sin el parseo, se lo recreo abajo
        medicationToUnedit.startDate = moment(medicationToUnedit.startDate).format('YYYY-MM-DD');
        if(medicationToUnedit.endDate && medicationToUnedit.state == 'Closed'){
          medicationToUnedit.endDate = moment(medicationToUnedit.endDate).format('YYYY-MM-DD');
        }
        if(medicationToUnedit.endDate && medicationToUnedit.state == 'Active'){
          medicationToUnedit.endDate = null; 
        }
        delete medicationToUnedit.medicationPresentation;
        HCService.agregarAlHistorial(function(){
          medicationToUnedit.$delete(function(){
            console.log('Supuestamente pudo borrar el tratamiento de profilaxis editado');
            medicationToUnedit.$save({pacienteId:HCService.currentPacienteId}, function(){
              console.log('Supuestamente pudo volver a crear el tratamiento de profilaxis previo a ser editado');
            },  console.error);
          },  console.error);
        });

        PatientMedication.update(tmpPatientMedication, function (response) {
          HCService.markAsDirty();
          toastr.success('Medicación guardada con exito');
          $uibModalInstance.close('edited');
        }, showError);
      }

      function canEdit() {
        return patientMedication.profesional.id == SessionService.currentUser.id && (moment().diff(moment(patientMedication.createdOn), 'hours') <= 8);
      }
      function canSave() {
        if(vm.controllerForm.$valid){
          return true;
        }
        return false;
      }

	    function activate(){
        Medication.getActiveList(function(medications){
          vm.medications = medications;
        }, displayComunicationError);
        HCService.getPatientProblems();
        vm.patientMedication = angular.copy(patientMedication);
        vm.patientMedication.quantityPerDay = Number(patientMedication.quantityPerDay);
        vm.patientMedication.quantityPerMonth = Number(patientMedication.quantityPerMonth);
        vm.patientMedication.startDate = new Date(vm.patientMedication.startDate + 'T03:00:00');
        vm.endDateCalendar.options.minDate = vm.patientMedication.startDate;

        if(vm.patientMedication.endDate && vm.patientMedication.state == 'Closed' || vm.patientMedication.state == 'Error' ){
          vm.patientMedication.endDate = new Date(vm.patientMedication.endDate + 'T03:00:00');
        }else{
          vm.patientMedication.endDate = null;
        }
        PatientProblem.getAllForPaciente({pacienteId: HCService.currentPaciente.id, state:'Active', }, function (result) {
          vm.activeProblems = result;
        }, function (err) {
            
        });

        SessionService.checkPermission('hc_hce.add_patientmedication')
          .then( function(hasPerm){
              vm.hasPermissions = hasPerm;
          }, function(error){
              vm.hasPermissions = false;
              console.error("=== Error al verificar permisos en controlador ===");
              console.error(error);
              console.trace();
          });
      }
      
      function changeStatus() {
        if(vm.patientMedication.state == 'Active'){
          vm.patientMedication.endDate = null;
          vm.startDateCalendar.options.maxDate = new Date();
        }
      }
      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
        }
      }


      function getMedications($viewValue) {
        var filters = {
          name : $viewValue
        };

        return Medication.getFullActiveList(filters, function(medications){
          vm.medications = medications;
        }, displayComunicationError).$promise;

      }


      function markAsError() {
        var tmpPatientMedication = angular.copy(vm.patientMedication);
        tmpPatientMedication.startDate = moment(tmpPatientMedication.startDate).format('YYYY-MM-DD');
        delete tmpPatientMedication.medicationPresentation;
        if(tmpPatientMedication.endDate){
          tmpPatientMedication.endDate = moment(tmpPatientMedication.endDate).format('YYYY-MM-DD');
        }

        var medicationToUnmarkAsError = new PatientMedication();
        Object.assign(medicationToUnmarkAsError, tmpPatientMedication);
        HCService.agregarAlHistorial(function(){
          medicationToUnmarkAsError.$delete(function(){
            console.log('Supuestamente pudo borrar el tratamiento de profilaxis marcado como error');
            medicationToUnmarkAsError.$save({pacienteId:HCService.currentPacienteId}, function(){
              console.log('Supuestamente pudo volver a crear el tratamiento de profilaxis previo a ser marcado como error');
            },  console.error);
          },  console.error);
        });

        tmpPatientMedication.state = PatientMedication.stateChoices.STATE_ERROR;
        PatientMedication.update(tmpPatientMedication, function (response) {
          HCService.markAsDirty();
          toastr.success('Medicación marcada como error');
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