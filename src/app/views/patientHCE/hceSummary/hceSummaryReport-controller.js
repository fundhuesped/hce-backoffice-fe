(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('HCESummaryReportController', hceSummaryReportController);

        hceSummaryReportController.$inject = [
            '$stateParams',
            'HCService',
            'Evolution',
            'Preference',
            'PatientProblem',
            'PatientClinicalResult',
            'Paciente',
            'PatientArvTreatment',
            'PatientMedication',
            'PatientVaccine',
            'PatientLaboratoryResult'];

    function hceSummaryReportController (
        $stateParams,
        HCService,
        Evolution,
        Preference,
        PatientProblem,
        PatientClinicalResult,
        Paciente,
        PatientArvTreatment,
        PatientMedication,
        PatientVaccine,
        PatientLaboratoryResult
    ) {
	    var vm = this;
        vm.problems = null;
        vm.evolutions = null;
        vm.clinicalResults = null;
        vm.arvTreatments = null;
        vm.medications = null;
        vm.vaccines = null;
        vm.laboratoryResults = null;
        vm.patientIdentification = null;
        vm.patient = null;

        activate();

        function activate(){
            Paciente.get({id:$stateParams.patientId}, function (patient) {
                vm.patient = patient;
                vm.patientIdentification = ($stateParams.patientIdentification == 'pns'? vm.patient.pns : patientFullName(vm.patient));
                console.log($stateParams);
                if($stateParams.problems){
                    PatientProblem.getAllForPaciente({pacienteId:patient.id}, function (results) {
                        vm.problems = results;
                    }, function (err) {
                    });
                }
                     
                if($stateParams.evolutions){
                    Evolution.getAllForPaciente({pacienteId:patient.id}, function (results) {
                        vm.evolutions = results;
                    }, function (err) {
                        
                    });
                }
                if($stateParams.clinicalResults){
                    PatientClinicalResult.getAllForPaciente({pacienteId:patient.id}, function (results) {
                        vm.clinicalResults = results;
                    }, function (err) {
                        
                    });
                }
                if($stateParams.arvTreatments){
                    PatientArvTreatment.getAllForPaciente({pacienteId:patient.id}, function (results) {
                        vm.arvTreatments = results;
                    }, function (err) {
                        
                    });
                }
                if($stateParams.medications){
                        PatientMedication.getAllForPaciente({pacienteId:patient.id}, function (results) {
                        vm.medications = results;
                    }, function (err) {
                        
                    });
                }
                if($stateParams.vaccines){
                    PatientVaccine.getAllForPaciente({pacienteId:patient.id}, function (results) {
                        vm.vaccines = results;
                    }, function (err) {
                        
                    });
                }
                if($stateParams.laboratoryResults){
                    PatientLaboratoryResult.getAllForPaciente({pacienteId:patient.id}, function (results) {
                        vm.laboratoryResults = results;
                    }, function (err) {
                        
                    });
                }
            }, function (argument) {
                // body...
            });

            Preference.get({section:'global', name: 'general__prescription_header_image'}, function (response) {
                vm.headerImage = response.value;
              })
      

        }
        function patientFullName(patient){
            return patient.firstName + (patient.firstName? ' ' + patient.firstName:'') + ' ' + patient.fatherSurname +  + (patient.motherSurname? ' ' + patient.motherSurname:'')
        }

    }
})();