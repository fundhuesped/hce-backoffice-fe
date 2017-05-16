(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientSearch')
    	.controller('PatientSearchController', patientSearchController);

	patientSearchController.$inject = ['Paciente', 'Document', 'toastr', 'HCService', '$state', 'moment', 'Profesional', '$loading'];

    function patientSearchController (Paciente, Document, toastr, HCService, $state, moment,  Profesional, $loading) {
	    var vm = this;
      vm.openPatient = openPatient;
      vm.patients = null;
      vm.shouldLookForPacient = shouldLookForPacient;
      vm.lookForPacientes = lookForPacientes;
      vm.documentTypes = [];
      vm.clearFilters = clearFilters;
      vm.filter = {};
      vm.profesionales = [];

      vm.changePacientModal = {
          style: {},
          isShown: false,
          show :  function showModal(patient){
                      this.patient = patient;
                      this.style = {display:'block'};
                      this.isShown = true;
                  },
          hide:   function hideModal() {
                      this.patient = null;
                      this.style = {};
                      this.isShown = false;
                  },
          cancel:    function cancelModal(){
                          this.hide();
                      },
          confirm:    function confirmModal(){
                        $state.go('app.patientHCE.resumen',{patientId: this.patient.id});
                      }
      };

      vm.birthDateCalendarPopup = {
        opened: false,
        options: {
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };


      vm.visitFromDateCalendarPopup = {
        opened: false,
        options: {
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };

      vm.visitToDateCalendarPopup = {
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
        Document.getActiveList(function(documentTypes){
          vm.documentTypes = documentTypes;
        }, displayComunicationError);

        Profesional.getActiveList(function(profesionales){
          vm.profesionales = profesionales;
        }, displayComunicationError);


      }

      function lookForPacientes() {
        if (vm.shouldLookForPacient()) {
          $loading.start('app');
          vm.message = '';

          var searchObject = {};

          if(vm.filter.documentType && vm.filter.documentNumber){
            searchObject.documentType = vm.filter.documentType;
            searchObject.documentNumber = vm.filter.documentNumber;
          }

          if(vm.filter.firstName){
            searchObject.firstName = vm.filter.firstName;
          }

          if(vm.filter.fatherSurname){
            searchObject.fatherSurname = vm.filter.fatherSurname;
          }

          if(vm.filter.birthDate){
            searchObject.birthDate = moment(vm.filter.birthDate).format('YYYY-MM-DD');
          }

          if(vm.filter.seenBy){
            searchObject.seenBy = vm.filter.seenBy;
          }

          if(vm.filter.visitFromDate){
            searchObject.visitFromDate = moment(vm.filter.visitFromDate).format('YYYY-MM-DD');
          }

          if(vm.filter.visitToDate){
            searchObject.visitToDate = moment(vm.filter.visitToDate).format('YYYY-MM-DD');
          }

          if(vm.filter.pnsCode){
            searchObject.pnsCode = vm.filter.pnsCode;
          }

          Paciente.getActiveList(searchObject,
            function(patients){
              $loading.finish('app');
              if(patients.length === 0){
                vm.patients = [];
                vm.message = 'No se encontraron pacientes con los criterios de busqueda';
                return;
              }
              vm.patients = patients;
            }, function(err){
                if(err.status == 400 && err.data && angular.fromJson(err.data).error){
                  toastr.error(angular.fromJson(err.data).error);
                }else{
                  vm.message = 'Ocurrió un error en la comunicación, por favor intente nuevamente.';
                  displayComunicationError('recomendations');
                }
              }
          );
        }
      }

      function shouldLookForPacient() {
        var populatedFields = 0;

        if (vm.filter.documentType && vm.filter.documentNumber) {
          return true;
        }

        if(vm.filter.seenBy && vm.filter.visitFromDate && vm.filter.visitToDate){
          return true;
        }

        if(vm.filter.pnsCode){
          return true;
        }

        if (vm.filter.firstName && vm.filter.firstName.length >= 3) {
          populatedFields++;
        }

        if (vm.filter.fatherSurname && vm.filter.fatherSurname.length >= 3) {
          populatedFields++;
        }

        if(vm.filter.birthDate){
          populatedFields++;
        }

        if (populatedFields > 1) {
          return true;
        }

        return false;
      }

      function clearFilters() {
        vm.filter = {};
      }

      function openPatient(patient) {
          if(HCService.isDirty()){
            vm.changePacientModal.show(patient);
          }else{
            $state.go('app.patientHCE.resumen',{patientId: patient.id});
          }
      }

      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
          $loading.finish(loading);
        }
      }
    }
})();