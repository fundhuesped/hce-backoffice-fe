(function() {
  	'use strict';
	angular
    .module('hce.app')
    .filter('translateRelationship', translateRelationship);
    function translateRelationship(FamilyPatientProblem) {
	    return function(name) {
			for (var key in FamilyPatientProblem.relationshipChoices) {
	          if( FamilyPatientProblem.relationshipChoices[key].name == name ){
	            return FamilyPatientProblem.relationshipChoices[key].label;
	          }
			}
	    };
  }
})();
