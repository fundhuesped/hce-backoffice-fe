(function() {
  'use strict';

  angular
    .module('hce.app')
    .directive('hceArvCard', hceArvCard);

  /** @ngInject */
  function hceArvCard() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/arvCard/arvCard.html',
      controller: hceArvCardController,
      controllerAs: 'Ctrl',
      scope: true,
    };
    /** @ngInject */
    function hceArvCardController(moment, HCService, PatientArvTreatment, $uibModal, $state, HIVData, $window) {
      var vm = this;
      vm.getSchema = getSchema;
      vm.openEditPatientMedicationModal = openEditPatientMedicationModal;
      vm.goToTreatment = goToTreatment;
      vm.goToLaboratories = goToLaboratories;
      vm.openHivModal = openHivDetails;
      Object.defineProperty(
          vm,
          'treatment', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.currentARVTreatment;
          }
      });

      activate();

      function openHivDetails() {

        var modalInstance = $uibModal.open({
            backdrop: true,
            templateUrl: 'app/views/patientHCE/hceSummary/summaryDetails.html',
            size: 'lg',
            controller: 'SummaryDetailsController',
            controllerAs: 'SummaryDetailsController',
            resolve: {
                patientId: function () {
                    return HCService.currentPacienteId;
                },
                showPNS: function () {
                    return false;
                },
                showHIV: function () {
                    return true;
                },
                showEvolutions: function () {
                    return false;
                },
                showProblems: function () {
                    return false;
                },
                showARV: function () {
                    return false;
                },
                showProfilaxis: function () {
                    return  false;
                },
                showGeneral: function () {
                    return false;
                },
                showLab: function () {
                    return false;
                },
                showOthers: function () {
                    return false;
                },
                showVaccines: function () {
                    return false;
                },
                observations: function () {
                    return false;
                },
            }
        });
        
        modalInstance.result.then(function (resolution) {
          if(resolution==='markedError' || resolution==='edited'){
              searchPatientProblems();
              if(!HCService.currentEvolution){
                  HCService.getCurrentEvolution();
              }
          }
        });
      }

      
      function activate(){
        HCService.getCurrentARVTreatment();
        HIVData.getCD4({patientId: HCService.currentPacienteId}, function (result) {
            vm.cd4 = {value : result.value};
            vm.cd4.date = new Date(result.date);
            vm.cd4.unitOfMeasure = result.unitOfMeasure;
        }, function (err) {
          vm.cd4= {};
        });
        HIVData.getCV({patientId: HCService.currentPacienteId}, function (result) {
            vm.cv = {value : result.value};
            vm.cv.date = new Date(result.date);
            vm.cv.unitOfMeasure = result.unitOfMeasure;
        }, function (err) {
          vm.cv= {};
        });
      }

      function getSchema(medications) {
        var nrti = [];
        var nnrti = [];
        var ip = [];
        var ii = [];
        var combo = [];
        var other = [];
        var schema = '';
        if(!medications){
          return;
        }
        for (var i = medications.length - 1; i >= 0; i--) {
          if(medications[i].medication.medicationType.code == 'NRTI'){
            nrti.push(medications[i].medication.abbreviation);
          }
          if(medications[i].medication.medicationType.code == 'NNRTI'){
            nnrti.push(medications[i].medication.abbreviation);
          }
          if(medications[i].medication.medicationType.code == 'IP'){
            ip.push(medications[i].medication.abbreviation);
          }
          if(medications[i].medication.medicationType.code == 'INI'){
            ii.push(medications[i].medication.abbreviation);
          }
          if(medications[i].medication.medicationType.code == 'COMBO'){
            combo.push(medications[i].medication.abbreviation);
          }
          if(medications[i].medication.medicationType.code == 'OTROS'){
            other.push(medications[i].medication.abbreviation);
          }
        }
        if(nrti.length>0){
          schema += '['; 
          for (var i = nrti.length - 1; i >= 0; i--) {
            schema += nrti[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += '] '; 
        }
        if(nnrti.length>0){
          schema += '['; 
          for (var i = nnrti.length - 1; i >= 0; i--) {
            schema += nnrti[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += '] '; 
        }
        if(ip.length>0){
          schema += '['; 
          for (var i = ip.length - 1; i >= 0; i--) {
            schema += ip[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += '] '; 
        }
        if(ii.length>0){
          schema += '['; 
          for (var i = ii.length - 1; i >= 0; i--) {
            schema += ii[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += '] '; 
        }
        if(combo.length>0){
          schema += '['; 
          for (var i = combo.length - 1; i >= 0; i--) {
            schema += combo[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += '] '; 
        }
        if(other.length>0){
          schema += '['; 
          for (var i = other.length - 1; i >= 0; i--) {
            schema += other[i];
            if(i>0){
              schema += ',';
            }
          }
          schema += ']'; 
        }
        return schema;

      }

      function goToTreatment() {
        $state.go('app.patientHCE.medications')
      }
      function goToLaboratories() {
        $state.go('app.patientHCE.laboratoryResults')
      }

      function openEditPatientMedicationModal() {
        var modalInstance = $uibModal.open({
          backdrop: 'static',
          templateUrl: 'app/views/patientHCE/medications/editPatientARVTreatment.html',
          size: 'lg',
          controller: 'EditPatientARVTreatmentController',
          controllerAs: 'Ctrl',
          resolve: {
            patientArvTreatment: function () {
              return vm.treatment;
            }
          }
        });
        modalInstance.result.then(function (resolution) {
          if(resolution==='markedError' || resolution==='edited'){
            searchPatientTreatments();
            if(!HCService.currentEvolution){
              HCService.getCurrentEvolution();
            }
          }
        });
      }

    }
    return directive;
  }

})();
