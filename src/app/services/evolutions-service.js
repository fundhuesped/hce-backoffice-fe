(function(){
    'use strict';
    /* jshint validthis: true */
    /*jshint latedef: nofunc */
    angular
        .module('hce.services')
        .service('EvolutionsService', EvolutionsService );

    EvolutionsService.$inject = ['Evolution', 'localStorageService'];

        function EvolutionsService(Evolution, localStorageService){
        var srv = this;
        srv.newEvolution = {};
        activate();
        function activate() {
            srv.newEvolution = new Evolution();
        }
    }
})();