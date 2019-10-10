(function($scope){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientHCE')
    	.controller('NewPatientArvTreatmentController', newPatientArvTreatmentController);

	  newPatientArvTreatmentController.$inject = ['$state',
                                                'HCService',
                                                'PatientArvTreatment',
                                                'toastr',
                                                'moment',
                                                'Medication',
                                                'PatientProblem',
                                                '$uibModalInstance',
                                                '$filter'];

    function newPatientArvTreatmentController ($state,
                                               HCService,
                                               PatientArvTreatment,
                                               toastr,
                                               moment,
                                               Medication,
                                               PatientProblem,
                                               $uibModalInstance,
                                               $filter) {
	    var vm = this;
      vm.hceService = HCService;
      vm.newPatientArvTreatment = new PatientArvTreatment();
      vm.save = save;
      vm.miAlert = miAlert;
      vm.cancel = cancel;
      vm.canSave = canSave;
      vm.toggleMedicationSelection = toggleMedicationSelection;
      vm.showInfo = showInfo;
      vm.goToProblems = goToProblems;
      vm.changeStatus = changeStatus;
      vm.roundNumber = roundNumber;
      vm.patientProblems = [];
      vm.nrtiMedications = [];
      vm.nnrtiMedications = [];
      vm.ipMedications = [];
      vm.iiMedications = [];
      vm.comboMedications = [];
      vm.otherMedications = [];
      vm.error = false;

      vm.changeReasons = ['Toxicidad', 
                          'Abandono',
                          'Simplificacion',
                          'Fallo'];


      // vm.patientProblems = [{
      //   name:'Infeccion cronica por HIV',
      // },{
      //   name:'Infeccion aguda HIV',
      // },{
      //   name:'Pre',
      // },{
      //   name:'POS Sex',
      // },{
      //   name:'POS Laboral',
      // }]
      // Object.defineProperty(
      //     vm,
      //     'patientProblems', {
      //     enumerable: true,
      //     configurable: false,
      //     get: function () {
      //         return HCService.activeProblems;
      //     }
      // });

      Object.defineProperty(
          vm,
          'currentARVTreatment', {
          enumerable: true,
          configurable: false,
          get: function () {
              return HCService.currentARVTreatment;
          }
      });



     function miAlert(key, value) {
   
       $("#quantityPerDay_"+key).val(value.toFixed(2))

      
       // vm.medication[index].quantityPerDay = quantityPerDayFixed;
    }

      vm.startDateCalendar = {
        opened: false,
        altInputFormats: ['d!-M!-yyyy'],
        updateMaxVal: function (value) {
          this.options.maxDate = (vm.newPatientArvTreatment.endDate?vm.newPatientArvTreatment.endDate:new Date());
        },
        options: {
          showWeeks: false,
          maxDate: new Date()
        },


        open : function(){
          this.opened = true;
        }
      };

      vm.endDateCalendar = {
        opened: false,
        altInputFormats: ['d!-M!-yyyy'],
        updateMinVal: function () {
          this.options.minDate = (vm.newPatientArvTreatment.startDate?vm.newPatientArvTreatment.startDate:new Date());
        },
        options: {
          showWeeks: false,
          maxDate: new Date()
        },
        open : function(){
          this.opened = true;
        }
      };
      activate();

      function save() {
        var tmpPatientArvTreatment = angular.copy(vm.newPatientArvTreatment);
        tmpPatientArvTreatment.paciente = HCService.currentPaciente.id;
        tmpPatientArvTreatment.startDate = moment(tmpPatientArvTreatment.startDate).format('YYYY-MM-DD');
        if(tmpPatientArvTreatment.endDate && tmpPatientArvTreatment.state == 'Closed'){
          tmpPatientArvTreatment.endDate = moment(tmpPatientArvTreatment.endDate).format('YYYY-MM-DD');
        }

        tmpPatientArvTreatment.$save({pacienteId:HCService.currentPaciente.id},function() {
          toastr.success('Tratamiento guardado con exito');
          $uibModalInstance.close('created');
        }, showError);
      }

      function canSave() {
        if(vm.controllerForm.$valid && vm.newPatientArvTreatment &&vm.newPatientArvTreatment.patientARVTreatmentMedications && vm.newPatientArvTreatment.patientARVTreatmentMedications.length > 0){
          return true;
        }
        return false;
      }

      function changeStatus() {
        if(vm.newPatientArvTreatment.state == 'Active'){
          vm.newPatientArvTreatment.endDate = null;
          vm.startDateCalendar.options.maxDate = new Date();
        }
      }

      function showInfo() {
        if(vm.patientProblems && vm.patientProblems.length>0){
          return false;
        }else{
          return true;
        }
      }

	    function activate(){
        Medication.getActiveList({medicationTypeCode:'NRTI'},function(medications){
          vm.nrtiMedications = medications;
        }, displayComunicationError);
        
        Medication.getActiveList({medicationTypeCode:'NNRTI'},function(medications){
          vm.nnrtiMedications = medications;
        }, displayComunicationError);

        Medication.getActiveList({medicationTypeCode:'IP'},function(medications){
          vm.ipMedications = medications;
        }, displayComunicationError);

        Medication.getActiveList({medicationTypeCode:'INI'},function(medications){
          vm.iiMedications = medications;
        }, displayComunicationError);
        
        Medication.getActiveList({medicationTypeCode:'COMBO'},function(medications){
          vm.comboMedications = medications;
        }, displayComunicationError);


        Medication.getActiveList({medicationGroup:'ARV', medicationTypeCode: 'OTROS'},function(medications){
          vm.otherMedications = medications;
        }, displayComunicationError);
          // HCService.getPatientProblems();
          
          var noContains5arvProblems = function(problems){
            return !(
              problems.includes("Infección por HIV") || problems.includes("Profilaxis post exposición ocupacional") || problems.includes("Profilaxis post exposición sexual") || problems.includes("Profilaxis post exposición vertical") || problems.includes("Profilaxis pre exposición (PrEP)")
            )
          }

          PatientProblem.getForPaciente({pacienteId: HCService.currentPaciente.id, problemType:'HIV', state:'Active'}, function (result) {
              vm.patientProblems = result;
              var currentProblemsString = result.map( function(element){
                return element.problem.name
              });
              if( noContains5arvProblems(currentProblemsString) ){
                vm.error = true;
              }
          }, function (err) {
               
          });

          if(vm.currentARVTreatment){
            vm.newPatientArvTreatment.state = 'Closed';
          }
	    }


	    function toggleMedicationSelection(medication) {
	    	if(vm.newPatientArvTreatment.patientARVTreatmentMedications){
	    		if(vm.newPatientArvTreatment.patientARVTreatmentMedications.length==0){
	    			vm.newPatientArvTreatment.patientARVTreatmentMedications.push({medication:medication});
	    			return;
	    		}
		    	for (var i = vm.newPatientArvTreatment.patientARVTreatmentMedications.length - 1; i >= 0; i--) {
		    		if(vm.newPatientArvTreatment.patientARVTreatmentMedications[i].medication.id == medication.id){
	    			    vm.newPatientArvTreatment.patientARVTreatmentMedications.splice(i, 1);
		    			return;
		    		}
		    	}
    			vm.newPatientArvTreatment.patientARVTreatmentMedications.push({medication:medication});
	    	}else{
	    		vm.newPatientArvTreatment.patientARVTreatmentMedications = [{medication:medication}];
	    	}
	    }


      function goToProblems() {      
        $state.go('app.patientHCE.problems');
        $uibModalInstance.dismiss('cancel');
      }

      function displayComunicationError(loading){
        if(!toastr.active()){
          toastr.warning('Ocurrió un error en la comunicación, por favor intente nuevamente.');
        }
        if(loading){
        }
      }

      function cancel() {
        $uibModalInstance.dismiss('cancel');
      }

      function parseError(errorData){
        if(errorData.startsWith("AssertionError")){
          var errorAuxArray = (errorData.split('\n'));
          var errorToReturn = errorAuxArray[1];
          return errorToReturn;
        }
        return errorData;
      }

      function showError(error) {
        if(error){
          if(error.data){
            var errorToShow = parseError(error.data);
            if(errorToShow.detail){
              toastr.error(errorToShow.detail);
            }else{
              toastr.error(errorToShow);
            }
          }else{
            toastr.error(error);
          }
        }else{
          toastr.error('Ocurrio un error');
        }
      }

      function roundNumber(number) {
        return (Math.round(number*10)/10);
      }
    }
})();