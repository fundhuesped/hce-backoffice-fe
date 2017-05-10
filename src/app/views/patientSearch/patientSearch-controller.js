(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientSearch')
    	.controller('PatientSearchController', patientSearchController);

	patientSearchController.$inject = ['Paciente', 'Document', 'toastr', 'HCService', '$state', '$loading'];

    function patientSearchController (Paciente, Document, toastr, HCService, $state, $loading) {
	    var vm = this;
      vm.openPatient = openPatient;
      vm.patients = null;
      vm.shouldLookForPacient = shouldLookForPacient;
      vm.lookForPacientes = lookForPacientes;
      vm.documentTypes = [];
      vm.filter = {};


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

      activate();

      function activate(){
        Document.getActiveList(function(documentTypes){
          vm.documentTypes = documentTypes;
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

          Paciente.getActiveList(searchObject,
            function(patients){
              $loading.finish('app');
              if(patients.length === 0){
                vm.patients = [];
                vm.message = 'No se encontraron pacientes con los criterios de busqueda';
                return;
              }
              vm.patients = patients;
            }, function(){
              vm.message = 'Ocurrió un error en la comunicación, por favor intente nuevamente.';
              displayComunicationError('recomendations');
            }
          );
          }
      }

      function shouldLookForPacient() {
        var populatedFields = 0;

        if (vm.filter.documentType && vm.filter.documentNumber) {
          return true;
        }

        if (vm.filter.firstName && vm.filter.firstName.length >= 3) {
          populatedFields++;
        }

        if (vm.filter.fatherSurname && vm.filter.fatherSurname.length >= 3) {
          populatedFields++;
        }

        if (populatedFields > 1) {
          return true;
        }

        return false;
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