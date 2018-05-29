(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    
    angular
        .module('hce.patient')
        .controller('NewPatientController',newPatientController);

    newPatientController.$inject = ['$loading', '$filter', 'moment', 'Document', 'Sex', 'Province', 'District', 'Location', 'SocialService', 'CivilStatus', 'Education', 'Paciente', 'Country', 'toastr', '$state'];

    function newPatientController ($loading, $filter, moment, Document, Sex, Province, District, Location, SocialService, CivilStatus, Education, Paciente, Country, toastr, $state) {
        var vm = this;
        vm.paciente = new Paciente();
        vm.errorMessage = null;
        vm.confirm = confirm;
        vm.clean = clean;
        vm.nextPage = nextPage;
        vm.previousPage = previousPage;
        vm.searchLocations = searchLocations;
        vm.searchDistricts = searchDistricts;
        vm.hideErrorMessage = hideErrorMessage;
        vm.activeTab = 0;
        vm.birthDateCalendarPopup = {
          opened: false,
          options: {
            maxDate: new Date(),
          }
        };
        vm.firstTimeCalendarPopup = {
          opened: false,
          options: {
            maxDate: new Date(),
          }
        };

        vm.openBirthDateCalendar = openBirthDateCalendar;
        vm.openFirstTimeCalendar = openFirstTimeCalendar;


        activate();

        function activate(){
            Document.getFullActiveList(function(documents){
                vm.documents = documents;
            }, function(){displayComunicationError('app');});
            
            Sex.getFullActiveList(function(sexTypes){
                vm.sexTypes = sexTypes;
            }, function(){displayComunicationError('app');});
            
            Country.getFullActiveList(function(countries){
                vm.countries = countries;
            }, function(){displayComunicationError('app');});

            Province.getFullActiveList(function(provinces){
                vm.provinces = provinces;
            }, function(){displayComunicationError('app');});
            
            SocialService.getFullActiveList(function(socialServices){
                vm.socialServices = socialServices;
            }, function(){displayComunicationError('app');});
            
            CivilStatus.getFullActiveList(function(civilStatusTypes){
                vm.civilStatusTypes = civilStatusTypes;
            }, function(){displayComunicationError('app');});
            
            Education.getFullActiveList(function(educationTypes){
                vm.educationTypes = educationTypes;
            }, function(){displayComunicationError('app');});

            vm.paciente.consent = 'Not asked';
        }

        function confirm () {
            if(vm.pacienteForm.$valid){
                vm.hideErrorMessage();
                $loading.start('app');
                var paciente  = angular.copy(vm.paciente);
                paciente.prospect = false;
                paciente.birthDate = $filter('date')(paciente.birthDate, 'yyyy-MM-dd');
                paciente.firstVisit = $filter('date')(paciente.firstVisit, 'yyyy-MM-dd');
                paciente.$save(function(){
                    $loading.finish('app');
                    toastr.success('Paciente creado con éxito');
                    $state.go('app.patientSearch');
                },function(){
                    displayComunicationError('app');
                });
            }else{
                vm.errorMessage = 'Por favor revise el formulario';
            }
        }

        function nextPage() {
            vm.activeTab = 1;
        }
        function previousPage() {
            vm.activeTab = 0;
        }

        function clean (){
            vm.patient = new Patient();
        }

        function openFirstTimeCalendar() {
            vm.firstTimeCalendarPopup.opened = true;
        }

        function openBirthDateCalendar() {
          vm.birthDateCalendarPopup.opened = true;
        }

        function searchLocations() {
            if (vm.selectedDistrict) {
                Location.getFullActiveList({district: vm.selectedDistrict.id},function(locations){
                    vm.locations = locations;
                }, displayComunicationError);
            }
        }

        function searchDistricts() {
            vm.locations = null;
            if (vm.selectedProvince) {
                District.getFullActiveList({province: vm.selectedProvince.id}, function(districts){
                    vm.districts = districts;
                }, displayComunicationError);
            }
        }
        
        function hideErrorMessage(){
            vm.errorMessage = null;
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