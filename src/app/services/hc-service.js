(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    angular
        .module('hce.services')
        .service('HCService', HCService );

    HCService.$inject = ['Paciente', 'Evolution', 'PatientProblem', 'PatientVaccine', 'PatientMedication', 'PatientArvTreatment', 'localStorageService', 'moment'];

    function HCService(Paciente, Evolution, PatientProblem, PatientVaccine, PatientMedication, PatientArvTreatment, localStorageService, moment){
        var srv = this;

        //Common
        srv.isDirty = isDirty;

        //Paciente
        srv.currentPaciente = null;
        srv.setCurrentPaciente = setCurrentPaciente;
        srv.setPaciente = setPaciente;
        srv.currentPacienteId = null;
        
        // Evolutions
        srv.currentEvolution = null;
        srv.canSaveEvolution = canSaveEvolution;
        srv.closeEvolution = closeEvolution;
        srv.cancelEvolution = cancelEvolution;
        srv.getEvolutions = getEvolutions;
        srv.saveNewEvolution = saveNewEvolution;
        srv.openNewEvolution = openNewEvolution;
        srv.getCurrentEvolution = getCurrentEvolution;


        //Problems
        srv.getActivePatientProblems = getActivePatientProblems;
        srv.getPatientProblems = getPatientProblems;
        srv.getClosedPatientProblems = getClosedPatientProblems;
        srv.openNewPatientProblem = openNewPatientProblem;
        srv.newPatientProblem = null;
        srv.activeProblems = null;
        srv.closedProblems = null;
        srv.familyProblems = null;
        srv.saveNewPatientProblem = saveNewPatientProblem;
        srv.activeProblemsCount = null;
        srv.summaryActiveProblems = null;
        srv.clearNewPatientProblem = clearNewPatientProblem;


        //Vaccines
        srv.getPatientVaccines = getPatientVaccines;
        srv.patientVaccines = null;
        srv.summaryPatientVaccines = null;
        srv.activePatientVaccinesCount = null;


        //Vaccines
        srv.getPatientMedications = getPatientMedications;
        srv.patientMedications = null;
        srv.summaryPatientMedications = null;
        srv.activePatientMedicationsCount = null;

        //ARV Treatments
        srv.currentARVTreatment = null;
        srv.getCurrentARVTreatment = getCurrentARVTreatment;


        activate();


        function activate() {
            // if(localStorageService.get('currentPaciente')){
            //     srv.setCurrentPaciente(localStorageService.get('currentPaciente'));
            // }
        }

        function isDirty() {
            if( srv.currentEvolution && !srv.currentEvolution.id ){
                return true;
            }
            if(srv.currentEvolution && srv.currentEvolution.notaClinica != srv.currentEvolutionCopy.notaClinica){
                return true;
            }
            return false;
        }

        function setPaciente(pacienteId) {
            srv.currentPacienteId = pacienteId;
            Paciente.get({id:pacienteId}, function (paciente) {
                localStorageService.set('currentPaciente', srv.currentPaciente);
                setCurrentPaciente(paciente);
                srv.currentEvolution = null;
                getActivePatientVaccines();
                getActivePatientMedications();
            }, function (argument) {
                // body...
            });
        }

        function setCurrentPaciente(paciente) {
            if(srv.currentPaciente && srv.currentPaciente.id != paciente.id){
                clean();
            }
            srv.currentPaciente = paciente;
        }


        function canSaveEvolution() {
            return srv.currentEvolution && srv.currentEvolution.notaClinica && srv.currentEvolution.reason;
        }

        function getCurrentEvolution(){
            return Evolution.getCurrentVisit({pacienteId:srv.currentPacienteId}, function (evolution) {
                srv.currentEvolution = evolution;
                srv.currentEvolutionCopy = angular.copy(evolution);
            }, function (err) {
                
            });
        }

        function openNewEvolution() {
            if(!srv.currentEvolution){
                srv.currentEvolution = new Evolution();
            }
        }

        function saveNewEvolution() {
            if(srv.currentEvolution.id){
                return srv.currentEvolution.$update(function (evolution) {
                    srv.currentEvolution = evolution;
                    srv.currentEvolutionCopy = angular.copy(evolution);
                }, function (err) {
                    console.log(err);
                });
            }else{
                return srv.currentEvolution.$save({pacienteId:srv.currentPaciente.id}, function (evolution) {
                    srv.currenEvolution = evolution;
                    srv.currentEvolutionCopy = angular.copy(evolution);
                }, function (err) {
                    console.log(err);
                });
            }
        }

        function closeEvolution() {
            var evolution = angular.copy(srv.currentEvolution);
            evolution.state = Evolution.stateChoices.STATE_CLOSED;
            return evolution.$update(function () {
                srv.currentEvolution = null;
                srv.getEvolutions();
            }, function (err) {
                console.log(err);
            }).$promise;
        }

        function cancelEvolution(evolution) {
            var evolutionModified = angular.copy(evolution);
            evolutionModified.status = 'Inactive';
            return Evolution.update(evolutionModified,function () {
                srv.getEvolutions();
            }, function (err) {
                console.log(err);
            }).$promise;
        }

        function saveAndClose() {
            return srv.currentEvolution.$save({pacienteId:srv.currentPaciente.id}, function () {
                srv.getEvolutions();
            }, function (err) {
                console.log(err);
            });
        }

        function getEvolutions(filters) {
            if(filters){
                var localFilters = angular.copy(filters);
                if(filters.fromDate)
                {
                    localFilters.fromDate = moment(filters.fromDate).format('YYYY-MM-DD');
                }
                if(filters.toDate)
                {
                    localFilters.toDate = moment(filters.toDate).format('YYYY-MM-DD');
                }
                localFilters.pacienteId = srv.currentPacienteId;
                return Evolution.getPaginatedForPaciente(localFilters, function (paginatedResult) {
                    srv.evolutions = paginatedResult.results;
                }, function (err) {
                     
                });                
            }else{
                return Evolution.getPaginatedForPaciente({pacienteId:srv.currentPaciente.id}, function (paginatedResult) {
                    srv.evolutions = paginatedResult.results;
                }, function (err) {
                     
                });

            }
        }


        function openNewPatientProblem() {
            if(!srv.newPatientProblem){
                srv.newPatientProblem = new PatientProblem();
            }
        }


        function saveNewPatientProblem() {

            var patientProblem = angular.copy(srv.newPatientProblem);
            patientProblem.startDate = moment(srv.newPatientProblem.startDate).format('YYYY-MM-DD');
            if (srv.newPatientProblem.closeDate) {
                patientProblem.closeDate = moment(srv.newPatientProblem.closeDate).format('YYYY-MM-DD');
            }

            return patientProblem.$save({pacienteId:srv.currentPaciente.id}, function (patientProblem) {
                getActivePatientProblems();
                srv.newPatientProblem = null;
            }, function (err) {
                console.log(err);
            });
        }

        function getActivePatientProblems() {
            return PatientProblem.getPaginatedForPaciente({pacienteId:srv.currentPacienteId, page_size:99, state:'Active'}, function (paginatedResult) {
                srv.activeProblemsCount = paginatedResult.count;
                srv.summaryActiveProblems = paginatedResult.results;
            }, function (err) {
                 
            });
        }

        function getPatientProblems(filters) {
            getActivePatientProblems();
            if(filters){
                var localFilters = angular.copy(filters);
                localFilters.pacienteId = srv.currentPacienteId;
                return PatientProblem.getPaginatedForPaciente(localFilters, function (paginatedResult) {
                    srv.activeProblems = paginatedResult.results;
                }, function (err) {
                     
                });                
            }else{
                return PatientProblem.getPaginatedForPaciente({pacienteId:srv.currentPaciente.id}, function (paginatedResult) {
                    srv.activeProblems = paginatedResult.results;
                }, function (err) {
                     
                });

            }
        }

        function getClosedPatientProblems(filters) {
            if(filters){
                var localFilters = angular.copy(filters);
                localFilters.pacienteId = srv.currentPacienteId;
                localFilters.state = 'Closed';
                return PatientProblem.getPaginatedForPaciente(localFilters, function (paginatedResult) {
                    srv.closedProblems = paginatedResult.results;
                }, function (err) {
                     
                });                
            }else{
                return PatientProblem.getPaginatedForPaciente({pacienteId:srv.currentPaciente.id, state:'Closed'}, function (paginatedResult) {
                    srv.closedProblems = paginatedResult.results;
                }, function (err) {
                     
                });

            }
        }

        function clearNewPatientProblem() {
            srv.newPatientProblem = null;
        }

        function clean() {
            srv.currentEvolution = null;
            srv.evolutions = null;
        }


        function getPatientVaccines(filters) {
            getActivePatientVaccines();
            if(filters){
                var localFilters = angular.copy(filters);
                localFilters.pacienteId = srv.currentPacienteId;
                return PatientVaccine.getPaginatedForPaciente(localFilters, function (paginatedResult) {
                    srv.patientVaccines = paginatedResult.results;
                }, function (err) {
                     
                });                
            }else{
                return PatientVaccine.getPaginatedForPaciente({pacienteId:srv.currentPaciente.id}, function (paginatedResult) {
                    srv.patientVaccines = paginatedResult.results;
                }, function (err) {
                     
                });

            }
        }

        function getActivePatientVaccines() {
            return PatientVaccine.getPaginatedForPaciente({pacienteId:srv.currentPacienteId, page_size:3, state:'Applied'}, function (paginatedResult) {
                srv.activePatientVaccinesCount = paginatedResult.count;
                srv.summaryPatientVaccines = paginatedResult.results;
            }, function (err) {
                 
            });
        }

        function getPatientMedications(filters) {
            getActivePatientMedications();
            if(filters){
                var localFilters = angular.copy(filters);
                localFilters.pacienteId = srv.currentPacienteId;
                return PatientMedication.getPaginatedForPaciente(localFilters, function (paginatedResult) {
                    srv.patientMedications = paginatedResult.results;
                }, function (err) {
                     
                });                
            }else{
                return PatientMedication.getPaginatedForPaciente({pacienteId:srv.currentPacienteId}, function (paginatedResult) {
                    srv.patientMedications = paginatedResult.results;
                }, function (err) {
                     
                });

            }
        }

        function getActivePatientMedications() {
            return PatientMedication.getPaginatedForPaciente({pacienteId:srv.currentPacienteId, page_size:3, state:'Active'}, function (paginatedResult) {
                srv.activePatientMedicationCount = paginatedResult.count;
                srv.summaryPatientMedications = paginatedResult.results;
            }, function (err) {
                 
            });
        }

        function getCurrentARVTreatment() {
            return PatientArvTreatment.getForPaciente({pacienteId:srv.currentPacienteId, state: 'Active'}, function (result) {
                if(result.length>0){
                    srv.currentARVTreatment = result[0];
                }else{
                    srv.currentARVTreatment = null;
                }
            }, function (err) {
                 
            });
        }

    }
})();