(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    angular
        .module('hce.services')
        .service('HCService', HCService );

    HCService.$inject = ['$q', 'Paciente', 'Evolution', 'PatientProblem', 'PatientVaccine', 'PatientMedication', 'PatientArvTreatment', 'localStorageService', 'moment', 'lodash', '$state', 'toastr'];

    function HCService($q, Paciente, Evolution, PatientProblem, PatientVaccine, PatientMedication, PatientArvTreatment, localStorageService, moment, lodash, $state, toastr){
        var srv = this;

        //Common
        srv.isDirty = isDirty;
        srv.canOpenPatient = canOpenPatient;
        //Paciente
        srv.currentPaciente = null;
        srv.setCurrentPaciente = setCurrentPaciente;
        srv.setPaciente = setPaciente;
        srv.refreshPacienteInformation = refreshPacienteInformation; 
        srv.currentPacienteId = null;
        
        // Evolutions
        srv.currentEvolution = null;
        srv.canSaveEvolution = canSaveEvolution;
        srv.closeEvolution = closeEvolution;
        srv.cancelEvolution = cancelEvolution;
        srv.getEvolutions = getEvolutions;
        srv.getEvolution = getEvolution;
        srv.saveNewEvolution = saveNewEvolution;
        srv.openNewEvolution = openNewEvolution;
        srv.getCurrentEvolution = getCurrentEvolution;
        srv.cleanAll = cleanAll;
        srv.cleanEvolution = cleanEvolution;
        srv.discardChanges = discardChanges;
        srv.historyStack = null;
        srv.agregarAlHistorial = agregarAlHistorial;
        srv.revertHistory = revertHistory;
        srv.hasBeenModified = false;
        srv.markAsDirty = markAsDirty;
        srv.unmarkAsDirty = unmarkAsDirty;
        srv.cleanHistoryStack = cleanHistoryStack;
        srv.finishDiscardChanges = finishDiscardChanges;

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


        //General Medications
        srv.getPatientMedications = getPatientMedications;
        srv.patientMedications = null;
        srv.summaryPatientMedications = null;
        srv.activePatientMedicationsCount = null;
        srv.getPatientMedicationsForRecipe = getPatientMedicationsForRecipe;
        srv.recipePatientMedications = null;
        srv.activeRecipePatientMedicationsCount = null;

        //Profilaxis Medications
        srv.activePatientProfilaxisMedicationsCount = null;

        //ARV Treatments
        srv.currentARVTreatment = null;
        srv.getCurrentARVTreatment = getCurrentARVTreatment;
        srv.getActivePatientProfilaxisMedications = getActivePatientProfilaxisMedications;

        activate();


        function activate() {
            // if(localStorageService.get('currentPaciente')){
            //     srv.setCurrentPaciente(localStorageService.get('currentPaciente'));
            // }
        }

        function isDirty() {
            if(srv.hasBeenModified) return true;
            if( srv.currentEvolution && !srv.currentEvolution.id ){
                return true;
            }
            if(srv.currentEvolution && srv.currentEvolution.notaClinica != srv.currentEvolutionCopy.notaClinica){
                return true;
            }
            if(srv.currentEvolution && srv.currentEvolution.reason != srv.currentEvolutionCopy.reason){
                return true;
            }
            return false;
        }

        function markAsDirty(){
            srv.hasBeenModified = true;
            $state.reload();
        }

        function unmarkAsDirty(){
            srv.hasBeenModified = false;
            $state.reload();
        }

        function canOpenPatient(patient) {
            if(isDirty()){
                return false;
            }
            return true;
        }

        function setPaciente(pacienteId) {
            srv.currentPacienteId = pacienteId;
            Paciente.get({id:pacienteId}, function (paciente) {
                localStorageService.set('currentPaciente', srv.currentPaciente);
                setCurrentPaciente(paciente);
                srv.currentEvolution = null;
                getActivePatientVaccines();
                getActivePatientMedications();
                getActivePatientProfilaxisMedications();
            }, function (argument) {
                // body...
            });
        }
        function refreshPacienteInformation() {
            Paciente.get({id:srv.currentPacienteId}, function (paciente) {
                localStorageService.set('currentPaciente', srv.currentPaciente);
                setCurrentPaciente(paciente);
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

        function discardChanges(cbOk, cbNok) {
            try{
                console.log("Entra a discardChanges");
                srv.currentEvolution = srv.currentEvolutionCopy;
                revertHistory();
                console.log("Esto es despues de revertHistory()");
                toastr.success("Se revirtieron los cambios con éxito");
                if(cbOk){
                    cbOk();
                }
            }catch (error){
                console.error(error);
                if(cbNok){
                    cbNok();
                }
            }
        }

        function revertHistory(){
            if(!srv.historyStack || !srv.historyStack.length){
                return;
            }
            var revertChange = null;
            revertChange = srv.historyStack.pop();
            revertChange().then(function(){
                console.log("Se revirtio una accion guardada en el historial");
                console.log(srv.historyStack);
                revertHistory();
            }).catch(console.trace);
        }

        function cleanHistoryStack(){
            srv.historyStack = null;
        }

        function agregarAlHistorial(revertingFunction){
            if(!srv.historyStack){
                srv.historyStack = new Array();
                console.log("Se inicializo historyStack exitosamente!");
            }
            srv.historyStack.push(revertingFunction);
            console.log("Se pusheo una funcion al historial!");
            console.log(srv.historyStack);
        }

        function getCurrentEvolution(){
            try{
                return Evolution.getCurrentVisit({pacienteId:srv.currentPacienteId}, function (evolution) {
                    srv.currentEvolution = evolution;
                    srv.currentEvolutionCopy = angular.copy(evolution);
                }, function (err) {
                    openNewEvolution();
                    console.error(err);
                });
            }catch(e){
                console.error("Entra en el catch de getCurrentVisit");
                console.error(e.name || e || "");
                console.error(e.message || e || "");
                openNewEvolution();
            }
        }

        function openNewEvolution() {
            if(!srv.currentEvolution){
                srv.currentEvolution = new Evolution();
            }
        }

        function saveNewEvolution(cbOK, cbNok) {
            if(srv.currentEvolution.id){
                return $q(function(resolve, reject) {
                    return( srv.currentEvolution.$update(function (evolution) {
                        srv.currentEvolution = evolution;
                        srv.currentEvolutionCopy = angular.copy(evolution);
                        if(cbOK){
                            cbOK(evolution);
                        }
                        resolve();
                    }, function (err) {
                        console.log(err);
                        if(cbNok){
                            cbNok(err);
                        }
                        reject(err);
                    }).$promise);
                });
            }else{
                return srv.currentEvolution.$save({pacienteId:srv.currentPaciente.id}, function (evolution) {
                    srv.currenEvolution = evolution;
                    srv.currentEvolutionCopy = angular.copy(evolution);
                    if(cbOK){
                        cbOK(evolution);
                    }
                }, function (err) {
                    console.log(err);
                    if(cbNok){
                        cbNok(err);
                    }
                    reject(err);
                }).$promise;
            }
        }

        function cleanAll() {
            return closeEvolution(true);
        }

        function cleanEvolution() {
            srv.currentEvolution = null;
        }

        function checkEvolutionIsComplete() {
            var evolution = angular.copy(srv.currentEvolution);
            if(!evolution.reason && !evolution.notaClinica){
                return 'Por favor ingrese motivo de consulta y texto de la evolución'
            }
            if(!bypass && evolution.reason && !evolution.notaClinica){
                return 'Por favor ingrese texto de la evolución'
            }
            if(!bypass && !evolution.reason && evolution.notaClinica){
                return 'Por favor ingrese motivo de consulta'
            }
            return null;
        }

        function closeEvolution(force) {
            var evolution = angular.copy(srv.currentEvolution);
            if(isDirty()){
                return $q(function(resolve, reject) {
                    reject('ISDIRTY');
                });
            }
            if(!evolution.reason && !evolution.notaClinica){
                return $q(function(resolve, reject) {
                    reject('Por favor ingrese motivo de consulta y texto de la evolución');
                }); 
            }
            if(evolution.reason && !evolution.notaClinica){
                return $q(function(resolve, reject) {
                    reject('Por favor ingrese texto de la evolución');
                }); 
            }
            if(!evolution.reason && evolution.notaClinica){
                return $q(function(resolve, reject) {
                    reject('Por favor ingrese motivo de consulta');
                }); 
            }

            evolution.state = Evolution.stateChoices.STATE_CLOSED;

            return evolution.$update(function () {
                srv.currentEvolution = null;
                srv.getEvolutions();
                srv.hasBeenModified = false;
            }, function (err) {
                if(err.status == 400 && err.data == 'Solo se pueden modificar dentro de las 8 horas'){
                    srv.currentEvolution = null;
                    srv.getEvolutions();
                }
                console.log(err);
            });
        }

        function finishDiscardChanges() {
            srv.currentEvolution = null;
            srv.getEvolutions();
            srv.hasBeenModified = false;
            srv.historyStack = null;
        }

        function cancelEvolution(evolution) {
            var evolutionModified = angular.copy(evolution);
            evolutionModified.state = 'Canceled';
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
                    console.error(err);
                });                
            }else{
                return Evolution.getPaginatedForPaciente({pacienteId:srv.currentPaciente.id}, function (paginatedResult) {
                    srv.evolutions = paginatedResult.results;
                }, function (err) {
                    console.error(err);
                });

            }
        }


        function getEvolution(idEvolution){
            if(srv.isDirty()){
                return $q(function(resolve, reject) {
                    reject('Debe guardar los cambios antes de continuar');
                });
            }
            return Evolution.getEvolution(idEvolution, function (result) {
                    srv.currentEvolution = result;
            }, function (err) {
                console.error(err);
            });
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
                markAsDirty();
                srv.newPatientProblem = null;
                var problemToDelete = new PatientProblem();
                problemToDelete.id = patientProblem.id;
                agregarAlHistorial(function(){
                    return $q(function(resolve, reject){
                        console.log("Entra a la función de borrado de un problema");
                        problemToDelete.$delete(function() {
                            console.log('Supuestamente pudo borrar el problema creado');
                            resolve();
                        },  function(err){
                            console.error(err);
                            reject();
                        });
                    })
                });
            }, function (err) {
                console.log(err);
            });
        }

        function getActivePatientProblems() {
            return PatientProblem.getPaginatedForPaciente({pacienteId:srv.currentPacienteId, page_size:99, state:'Active'}, function (paginatedResult) {
                srv.activeProblemsCount = paginatedResult.count;
                srv.summaryActiveProblems = paginatedResult.results;
            }, function (err) {
                console.error(err);
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
                    console.error(err);
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


        function getPatientAllVaccines() {
            // body...
        }

        function getPatientVaccines(filters) {
            getActivePatientVaccines();
            if(filters){
                var localFilters = angular.copy(filters);
                localFilters.pacienteId = srv.currentPacienteId;
                localFilters.order = 'name';
                if(filters.all){
                    return PatientVaccine.getFullList(localFilters, function (paginatedResult) {
                        srv.patientVaccines = paginatedResult;
                    }, function (err) {
                    });                
                }else{
                    return PatientVaccine.getPaginatedForPaciente(localFilters, function (paginatedResult) {
                        srv.patientVaccines = paginatedResult.results;
                    }, function (err) {
                    });                
                }

            }else{
                return PatientVaccine.getPaginatedForPaciente({pacienteId:srv.currentPaciente.id}, function (paginatedResult) {
                    srv.patientVaccines = paginatedResult.results;
                }, function (err) {
                });

            }
        }

        function getActivePatientVaccines() {
            return PatientVaccine.getPaginatedForPaciente({pacienteId:srv.currentPacienteId, state:'Applied'}, function (result) {
                srv.activePatientVaccinesCount = result.count;
                srv.summaryPatientVaccines = result.results;
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
            return PatientMedication.getPaginatedForPaciente({pacienteId:srv.currentPacienteId, page_size:3, state:'Active',  notMedicationTypeCode : 'PROF'}, function (paginatedResult) {
                srv.activePatientMedicationsCount = paginatedResult.count;
                srv.summaryPatientMedications = paginatedResult.results;
            }, function (err) {
                 
            });
        }

        function getPatientMedicationsForRecipe(filters) {
            if(filters){
                var localFilters = angular.copy(filters);
                localFilters.pacienteId = srv.currentPacienteId;
                localFilters.page_size = srv.activePatientMedicationsCount;
                return PatientMedication.getPaginatedForPaciente(localFilters, function (paginatedResult) {
                    srv.recipePatientMedications = paginatedResult.results;
                }, function (err) {
                     
                });                
            }else{
                return PatientMedication.getPaginatedForPaciente({pacienteId:srv.currentPacienteId, page_size:srv.activePatientMedicationsCount}, function (paginatedResult) {
                    srv.recipePatientMedications = paginatedResult.results;
                }, function (err) {
                     
                });

            }
        }

        function getActivePatientProfilaxisMedications() {
            return PatientMedication.getPaginatedForPaciente({pacienteId:srv.currentPacienteId, page_size:3, state:'Active', medicationTypeCode : 'PROF'}, function (paginatedResult) {
                srv.activePatientProfilaxisMedicationsCount = paginatedResult.count;
                srv.summaryPatientProfilaxisMedications = paginatedResult.results;
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