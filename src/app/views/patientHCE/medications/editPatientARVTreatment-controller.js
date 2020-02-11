(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('EditPatientARVTreatmentController', editPatientARVTreatmentController);

	  editPatientARVTreatmentController.$inject = ['$state', 'HCService', 'PatientArvTreatment', 'toastr', 'moment', 'Medication', '$uibModalInstance', '$filter', 'patientArvTreatment','SessionService', '$q'];

    function editPatientARVTreatmentController ($state, HCService, PatientArvTreatment, toastr, moment, Medication, $uibModalInstance, $filter, patientArvTreatment, SessionService, $q) {
	    var vm = this;
      vm.hceService = HCService;
      vm.patientArvTreatment = angular.copy(patientArvTreatment);
      vm.markAsError = markAsError;
      vm.cancel = cancel;
      vm.hasPermissions = false;
      vm.canEdit = canEdit;
      vm.nrtiMedications = [];
      vm.nnrtiMedications = [];
      vm.ipMedications = [];
      vm.iiMedications = [];
      vm.comboMedications = [];
      vm.otherMedications = [];

      vm.changeReasons = ['Toxicidad', 
                          'Abandono',
                          'Simplificacion',
                          'Fallo'];


      Object.defineProperty(
          vm,
          'patientProblems', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.activeProblems;
          }
      });

      vm.startDateCalendar = {
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

      vm.endDateCalendar = {
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
        Medication.getActiveList({medicationTypeCode:'NRTI'},function(medications){
          for (var i = patientArvTreatment.patientARVTreatmentMedications.length - 1; i >= 0; i--) {
            for (var j = medications.length - 1; j >= 0; j--) {
              if(medications[j].id == patientArvTreatment.patientARVTreatmentMedications[i].medication.id){
                medications[j].selected = true;
                break;
              }
            }
          }
          vm.nrtiMedications = medications;
        }, displayComunicationError);
        
        Medication.getActiveList({medicationTypeCode:'NNRTI'},function(medications){
          for (var i = patientArvTreatment.patientARVTreatmentMedications.length - 1; i >= 0; i--) {
            for (var j = medications.length - 1; j >= 0; j--) {
              if(medications[j].id == patientArvTreatment.patientARVTreatmentMedications[i].medication.id){
                medications[j].selected = true;
                break;
              }
            }
          }
          vm.nnrtiMedications = medications;
        }, displayComunicationError);

        Medication.getActiveList({medicationTypeCode:'IP'},function(medications){
          for (var i = patientArvTreatment.patientARVTreatmentMedications.length - 1; i >= 0; i--) {
            for (var j = medications.length - 1; j >= 0; j--) {
              if(medications[j].id == patientArvTreatment.patientARVTreatmentMedications[i].medication.id){
                medications[j].selected = true;
                break;
              }
            }
          }
          vm.ipMedications = medications;
        }, displayComunicationError);

        Medication.getActiveList({medicationTypeCode:'INI'},function(medications){
          for (var i = patientArvTreatment.patientARVTreatmentMedications.length - 1; i >= 0; i--) {
            for (var j = medications.length - 1; j >= 0; j--) {
              if(medications[j].id == patientArvTreatment.patientARVTreatmentMedications[i].medication.id){
                medications[j].selected = true;
                break;
              }
            }
          }
          vm.iiMedications = medications;
        }, displayComunicationError);
        
        Medication.getActiveList({medicationTypeCode:'COMBO'},function(medications){
          for (var i = patientArvTreatment.patientARVTreatmentMedications.length - 1; i >= 0; i--) {
            for (var j = medications.length - 1; j >= 0; j--) {
              if(medications[j].id == patientArvTreatment.patientARVTreatmentMedications[i].medication.id){
                medications[j].selected = true;
                break;
              }
            }
          }
          vm.comboMedications = medications;
        }, displayComunicationError);


        Medication.getActiveList({medicationGroup:'ARV', medicationTypeCode: 'OTROS'},function(medications){
          for (var i = patientArvTreatment.patientARVTreatmentMedications.length - 1; i >= 0; i--) {
            for (var j = medications.length - 1; j >= 0; j--) {
              if(medications[j].id == patientArvTreatment.patientARVTreatmentMedications[i].medication.id){
                medications[j].selected = true;
                break;
              }
            }
          }
          vm.otherMedications = medications;
        }, displayComunicationError);

        vm.patientArvTreatment.startDate = new Date(vm.patientArvTreatment.startDate + 'T03:00:00');

        if(vm.patientArvTreatment.endDate && (vm.patientArvTreatment.state == 'Closed' || vm.patientArvTreatment.state == 'Error') ){
          vm.patientArvTreatment.endDate = new Date(vm.patientArvTreatment.endDate + 'T03:00:00');
        }

        SessionService.checkPermission('hc_hce.add_patientarvtreatment')
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

      function canEdit() {
        return patientArvTreatment.profesional.id == SessionService.currentUser.id && (moment().diff(moment(patientArvTreatment.createdOn), 'hours') <= 8);
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel');
      }

      function markAsError() {
        var tmpPatientArvTreatment = angular.copy(vm.patientArvTreatment);
        tmpPatientArvTreatment.startDate = moment(tmpPatientArvTreatment.startDate).format('YYYY-MM-DD');
        if(tmpPatientArvTreatment.endDate){
          tmpPatientArvTreatment.endDate = moment(tmpPatientArvTreatment.endDate).format('YYYY-MM-DD');
        }

        var treatmentToUnmarkAsError = new PatientArvTreatment();
        Object.assign(treatmentToUnmarkAsError, tmpPatientArvTreatment);
        
        HCService.agregarAlHistorial(function(){
          return $q(function(resolve, reject){
            console.log("Entra a la función de deshacer marcado de error de un arvTreatmente");
            treatmentToUnmarkAsError.$delete(function(){
              console.log('Supuestamente pudo borrar el arvTreatment marcado como error');
              treatmentToUnmarkAsError.$save({pacienteId:HCService.currentPacienteId}, function(){
                console.log('Supuestamente pudo volver a crear el arvTreatment antes de ser marcado como error');
              },  console.error);
              resolve();
            },  function(err){
              console.error(err);
              reject();
            });
          })
        });

        tmpPatientArvTreatment.state = PatientArvTreatment.stateChoices.STATE_ERROR;
        PatientArvTreatment.update(tmpPatientArvTreatment, function (response) {
          HCService.markAsDirty();
          toastr.success('Medicación marcada como error');
          $uibModalInstance.close('markedError');
        }, function (err) {
            console.error(err);
            toastr.error('Ocurrio un error');
        });
      }
    }
})();