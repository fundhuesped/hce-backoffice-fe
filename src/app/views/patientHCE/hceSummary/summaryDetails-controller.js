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
        toastr.info('Imprima dando click derecho -> "imprimir"', 'Instrucciones');
        toastr.info('Por favor espere unos segundos antes de imprimir', 'Cargando información...');
      }

      function exportPDF() {
        console.warn("--- called export pdf ---");

        var quotes = document.getElementById('export-this');
        html2canvas(quotes)
        .then(function(canvas) {
          var pdf = new jsPDF('p', 'pt', 'a4');

          for (var i = 0; i <= quotes.clientHeight/980; i++) {
              // This is all just html2canvas stuff
              var srcImg  = canvas;
              var sX      = 0;
              var sWidth  = 778;
              var sHeight = 1100;
              var sY      = sHeight*i; // start 980 pixels down for every new page
              var dX      = 0;
              var dY      = 0;
              var dWidth  = sWidth;
              var dHeight = sHeight;

              window.onePageCanvas = document.createElement("canvas");
              onePageCanvas.setAttribute('width', sWidth);
              onePageCanvas.setAttribute('height', sHeight);
              var ctx = onePageCanvas.getContext('2d');
              // details on this usage of this function: 
              // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
              ctx.drawImage(srcImg,sX,sY,sWidth,sHeight,dX,dY,dWidth,dHeight);

              // document.body.appendChild(canvas);
              var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);

              var width         = onePageCanvas.width;
              var height        = onePageCanvas.clientHeight;

              // If we're on anything other than the first page, add another page
              if (i > 0) {
                  pdf.addPage(595, 842); //8.5" x 11" in pts (in*72)
              }
              // now we declare that we're working on that page
              pdf.setPage(i+1);
              // now we add content to that page!
              pdf.addImage(canvasDataURL, 'png', 0, 0, (width*.72), (height*.71));

          };
          pdf.autoPrint();
          pdf.save('Resumen.pdf');
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