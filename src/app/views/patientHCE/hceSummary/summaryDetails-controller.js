(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('SummaryDetailsController', summaryDetailsController);

  summaryDetailsController.$inject = ['toastr', '$stateParams', 'HIVData', 'Paciente', 'Evolution', 'PatientProblem', 'PatientArvTreatment', 'PatientMedication', 'PatientClinicalResult', 'PatientLaboratoryResult', 'PatientVaccine', '$scope'];

    function summaryDetailsController (toastr, $stateParams, HIVData, Paciente, Evolution, PatientProblem, PatientArvTreatment, PatientMedication, PatientClinicalResult, PatientLaboratoryResult, PatientVaccine, $scope) {
      var vm = this;
      vm.cancel = cancel;
      vm.canBeClosed = canBeClosed;
      vm.hiv_details = null;
      vm.patient_details = null;
      vm.patientIdentification = null;
      vm.showHIV = false;
      vm.evolutions = [];
      vm.showEvolutions = false;
      vm.problems = [];
      vm.showProblems = false;
      vm.arvTreatments = [];
      vm.showARV = false;
      vm.showProfilaxis = false;
      vm.medications = [];
      vm.showOthers = false;
      vm.clinicalResults = [];
      vm.showGeneral = false;
      vm.generalMedications = [];
      vm.showLab = false;
      vm.laboratoryResults = [];
      vm.showVaccines = false;
      vm.vaccines = [];
      vm.$stateParams = $stateParams;
      vm.observations = $stateParams.observations;
      vm.issuedDate = new Date();
      vm.showPNS = showPNS;
      vm.getSchema = getSchema;
      vm.exportPDF = exportPDF;
      init();

      function init() {
        getDetails();
      }

      function exportPDF() {
        console.warn("--- called export pdf ---");

        //Global document parameters
        var margins = {
            top: 60,
            left: 30,
            bottom: 60,
            right: 50
        };

        var compression = {
            enable: true,
            type: {FAST:'FAST', MEDIUM: 'MEDIUM', SLOW: 'SLOW', NONE:'NONE'}
        };

        html2canvas(document.getElementById('exportthis'))
        .then(function(canvas) {

            var dimensions = {
                width: canvas.width + margins.right,
                height: canvas.height + margins.bottom
            };

            if(canvas.width > canvas.height)
                var doc = new jsPDF('l', 'mm', [dimensions.width, dimensions.height], compression.enable); //Landscape
            else
                var doc = new jsPDF('p', 'mm', [dimensions.width, dimensions.height], compression.enable); //Portrait

            doc.addImage(canvas, 'png', margins.left, margins.top, canvas.width, canvas.height, undefined, compression.type.MEDIUM);
            doc.save('Resumen.pdf');
        });
      }


      function cancel() {
        
      }

      function canBeClosed() {
        return true;
      }
      
      function checkTrue(string){
        return string == "true";
      }
      
      function showPNS(){
       return checkTrue($stateParams.showPNS) 
      }

      function getDetails() {
        Paciente.get({id:$stateParams.patientId}, function(patient){
          vm.patient_details = patient;
          vm.patientIdentification = (showPNS())
                                      ? patient.pns
                                      : (patient.firstName + " " + patient.fatherSurname); 
        }, function (err) {
          console.error(err);
          vm.patient_details = null;
        });

        vm.showHIV = checkTrue($stateParams.showHIV);
        if(checkTrue($stateParams.showHIV)) getHIVdetails();

        vm.showEvolutions = checkTrue($stateParams.showEvolutions);
        if(checkTrue($stateParams.showEvolutions)) getEvolutionsDetails();

        vm.showProblems = checkTrue($stateParams.showProblems);
        if(checkTrue($stateParams.showProblems)) getPatienProblems();
        
        vm.showARV = checkTrue($stateParams.showARV);
        if(checkTrue($stateParams.showARV)) getArvTreatments();
        
        vm.showProfilaxis = checkTrue($stateParams.showProfilaxis);
        if(checkTrue($stateParams.showProfilaxis)) getProfilaxis();
        
        vm.showGeneral = checkTrue($stateParams.showGeneral);
        if(checkTrue($stateParams.showGeneral)) getGeneralTreatments();
        
        vm.showLab = checkTrue($stateParams.showLab);
        if(checkTrue($stateParams.showLab)) getLabResults();
        
        vm.showOthers = checkTrue($stateParams.showOthers);
        if(checkTrue($stateParams.showOthers)) getOthers();
        
        vm.showVaccines = checkTrue($stateParams.showVaccines);
        if(checkTrue($stateParams.showVaccines)) getVaccines();
      }

      function getHIVdetails() {
        HIVData.getHIVChart({patientId: $stateParams.patientId}, function (result) {
            vm.hiv_details = result;
        }, function (err) {
          console.error(err);
          vm.hiv_details = null;
        });
      }

      function getEvolutionsDetails() {
        Evolution.getAllForPaciente({pacienteId: $stateParams.patientId, notState:'Error'}, function (results) {
          vm.evolutions = results;
        }, function (err) {
          console.error(err);
          vm.evolutions = [];
        });
      }

      function getPatienProblems() {
        PatientProblem.getAllForPaciente({pacienteId: $stateParams.patientId, notState:'Error'}, function (results) {
          vm.problems = results;
        }, function (err) {
          console.error(err);
          vm.problems = [];
        });
      }

      function getArvTreatments() {
        PatientArvTreatment.getAllForPaciente({pacienteId: $stateParams.patientId, notState:'Error'}, function (results) {
          vm.arvTreatments = results;
        }, function (err) {
          console.error(err);
          vm.arvTreatments = [];
        });
      }

      function getProfilaxis() {
        PatientMedication.getAllForPaciente({pacienteId: $stateParams.patientId, notState:'Error'}, function (results) {
          vm.medications = results.filter( function (med) {  return med.medication.medicationType.name == "Profilaxis"; } );
        }, function (err) {
          console.error(err);
          vm.medications = [];
        });
      }


      function getGeneralTreatments() {
        PatientMedication.getForPaciente({pacienteId: $stateParams.patientId, notState:'Error'}, function (results) {
          vm.generalMedications = results.filter( function(med) { return med.medication.medicationType.name != "Profilaxis";} );
        }, function (err) {
          console.error(err);
          vm.generalMedications = [];
        });
      }

      function getOthers() {
        PatientClinicalResult.getAllForPaciente({pacienteId: $stateParams.patientId, notState:'Error'}, function (results) {
          vm.clinicalResults = results;
        }, function (err) {
          console.error(err);
          vm.clinicalResults = [];
        });
      }

      function getLabResults() {
        PatientLaboratoryResult.getForPaciente({pacienteId: $stateParams.patientId}, function (results) {
          vm.laboratoryResults = results;
        }, function (err) {
          console.error(err);
          vm.laboratoryResults = [];
        });
      }

      function getVaccines() {
        PatientVaccine.getAllForPaciente({pacienteId: $stateParams.patientId, notState:'Error'}, function (results) {
          vm.vaccines = results;
        }, function (err) {
          console.error(err);
          vm.vaccines = [];
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


    }
})();