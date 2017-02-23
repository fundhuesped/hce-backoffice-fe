(function(){
    'use strict';
    /* jshint validthis: true */
     /*jshint latedef: nofunc */
    angular
    	.module('hce.patientSearch')
    	.controller('PatientSearchController', patientSearchController);

	patientSearchController.$inject = ['$state'];

    function patientSearchController ($state) {
	    var vm = this;
        activate();
        vm.openPatient = openPatient;
        vm.patients = [
    {
      "id": 915,
      "idpaciente": "915",
      "prospect": false,
      "firstName": "DANIEL",
      "otherNames": null,
      "fatherSurname": "MARCHITTO",
      "motherSurname": null,
      "birthDate": "1955-03-08",
      "email": null,
      "street": null,
      "postal": null,
      "status": "Active",
      "consent": "Not asked",
      "documentType": {
        "id": 1,
        "name": "DNI",
        "description": "DNI",
        "status": "Active",
        "url": "http://turnos.cmhuesped.com/api/comun/documentType/1/"
      },
      "documentNumber": "11633238",
      "genderAtBirth": null,
      "genderOfChoice": null,
      "location": null,
      "occupation": null,
      "civilStatus": null,
      "education": null,
      "socialService": {
        "id": 1,
        "name": "UP",
        "description": "UP",
        "status": "Active",
        "url": "http://turnos.cmhuesped.com/api/comun/socialService/1/"
      },
      "socialServiceNumber": "31588500000000/000",
      "bornPlace": null,
      "firstVisit": null,
      "notes": null,
      "primaryPhoneNumber": "1557516451",
      "primaryPhoneContact": null,
      "primaryPhoneMessage": false,
      "secondPhoneNumber": null,
      "secondPhoneContact": null,
      "secondPhoneMessage": null,
      "thirdPhoneNumber": null,
      "thirdPhoneContact": null,
      "thirdPhoneMessage": null
    },
    {
      "id": 2730,
      "idpaciente": null,
      "prospect": true,
      "firstName": "Daniel",
      "otherNames": null,
      "fatherSurname": "martinez",
      "motherSurname": null,
      "birthDate": null,
      "email": null,
      "street": null,
      "postal": null,
      "status": "Active",
      "consent": "Not asked",
      "documentType": {
        "id": 1,
        "name": "DNI",
        "description": "DNI",
        "status": "Active",
        "url": "http://turnos.cmhuesped.com/api/comun/documentType/1/"
      },
      "documentNumber": "26892705",
      "genderAtBirth": null,
      "genderOfChoice": null,
      "location": null,
      "occupation": null,
      "civilStatus": null,
      "education": null,
      "socialService": {
        "id": 133,
        "name": "SMG",
        "description": "SMG",
        "status": "Active",
        "url": "http://turnos.cmhuesped.com/api/comun/socialService/133/"
      },
      "socialServiceNumber": null,
      "bornPlace": null,
      "firstVisit": null,
      "notes": null,
      "primaryPhoneNumber": "1530687961",
      "primaryPhoneContact": null,
      "primaryPhoneMessage": null,
      "secondPhoneNumber": null,
      "secondPhoneContact": null,
      "secondPhoneMessage": null,
      "thirdPhoneNumber": null,
      "thirdPhoneContact": null,
      "thirdPhoneMessage": null
    },
    {
      "id": 2427,
      "idpaciente": null,
      "prospect": false,
      "firstName": "Daniel",
      "otherNames": null,
      "fatherSurname": "Martinez",
      "motherSurname": null,
      "birthDate": "2016-10-06",
      "email": null,
      "street": "ver",
      "postal": "ver",
      "status": "Active",
      "consent": "Not asked",
      "documentType": {
        "id": 1,
        "name": "DNI",
        "description": "DNI",
        "status": "Active",
        "url": "http://turnos.cmhuesped.com/api/comun/documentType/1/"
      },
      "documentNumber": "ver",
      "genderAtBirth": {
        "id": 1,
        "name": "Masculino",
        "description": "Masculino",
        "status": "Active",
        "url": "http://turnos.cmhuesped.com/api/comun/sexType/1/"
      },
      "genderOfChoice": {
        "id": 1,
        "name": "Masculino",
        "description": "Masculino",
        "status": "Active",
        "url": "http://turnos.cmhuesped.com/api/comun/sexType/1/"
      },
      "location": {
        "id": 1,
        "name": "AGRONOMÍA",
        "description": "AGRONOMÍA",
        "status": "Active",
        "district": {
          "id": 1,
          "name": "CIUDAD AUTONOMA DE BUENOS AIRES",
          "description": "CIUDAD AUTONOMA DE BUENOS AIRES",
          "status": "Active",
          "province": {
            "id": 1,
            "name": "CIUDAD AUTÓNOMA DE BUENOS AIRES",
            "description": "CIUDAD AUTÓNOMA DE BUENOS AIRES",
            "status": "Active",
            "url": "http://turnos.cmhuesped.com/api/comun/province/1/"
          },
          "url": "http://turnos.cmhuesped.com/api/comun/district/1/"
        },
        "url": "http://turnos.cmhuesped.com/api/comun/location/1/"
      },
      "occupation": null,
      "civilStatus": null,
      "education": null,
      "socialService": {
        "id": 133,
        "name": "SMG",
        "description": "SMG",
        "status": "Active",
        "url": "http://turnos.cmhuesped.com/api/comun/socialService/133/"
      },
      "socialServiceNumber": null,
      "bornPlace": null,
      "firstVisit": null,
      "notes": null,
      "primaryPhoneNumber": "1564505791",
      "primaryPhoneContact": "daniel",
      "primaryPhoneMessage": false,
      "secondPhoneNumber": null,
      "secondPhoneContact": null,
      "secondPhoneMessage": null,
      "thirdPhoneNumber": null,
      "thirdPhoneContact": null,
      "thirdPhoneMessage": null
    },
    {
      "id": 1390,
      "idpaciente": "1390",
      "prospect": false,
      "firstName": "DANIEL",
      "otherNames": null,
      "fatherSurname": "MARTINEZ",
      "motherSurname": null,
      "birthDate": "1955-12-09",
      "email": null,
      "street": null,
      "postal": null,
      "status": "Active",
      "consent": "Not asked",
      "documentType": {
        "id": 1,
        "name": "DNI",
        "description": "DNI",
        "status": "Active",
        "url": "http://turnos.cmhuesped.com/api/comun/documentType/1/"
      },
      "documentNumber": "11982080",
      "genderAtBirth": null,
      "genderOfChoice": null,
      "location": null,
      "occupation": null,
      "civilStatus": null,
      "education": null,
      "socialService": {
        "id": 108,
        "name": "OSPLAD",
        "description": "OSPLAD",
        "status": "Active",
        "url": "http://turnos.cmhuesped.com/api/comun/socialService/108/"
      },
      "socialServiceNumber": "4-11982080-200",
      "bornPlace": null,
      "firstVisit": null,
      "notes": null,
      "primaryPhoneNumber": "+541149519442",
      "primaryPhoneContact": null,
      "primaryPhoneMessage": false,
      "secondPhoneNumber": null,
      "secondPhoneContact": null,
      "secondPhoneMessage": null,
      "thirdPhoneNumber": null,
      "thirdPhoneContact": null,
      "thirdPhoneMessage": null
    }
  ];


	    function activate(){
	    }

        function openPatient(patient) {
            $state.go('app.patientHCE.resumen',{patientId: patient.id});
        }

    }
})();