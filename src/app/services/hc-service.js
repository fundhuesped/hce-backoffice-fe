(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    angular
        .module('hce.services')
        .service('HCService', HCService );

    HCService.$inject = ['Paciente', 'Evolution', 'localStorageService', 'moment'];

    function HCService(Paciente, Evolution, localStorageService, moment){
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
        srv.closeEvolution = closeEvolution;
        srv.cancelEvolution = cancelEvolution;
        srv.getEvolutions = getEvolutions;
        srv.saveNewEvolution = saveNewEvolution;
        srv.openNewEvolution = openNewEvolution;
        srv.getCurrentEvolution = getCurrentEvolution;



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

        function clean() {
            srv.currentEvolution = null;
            srv.evolutions = null;
        }

    }
})();