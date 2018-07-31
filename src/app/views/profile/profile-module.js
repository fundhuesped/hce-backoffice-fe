(function(){
    'use strict';
    angular.module('hce.profile',[])
        .config(routerConfig);

    /** @ngInject */
    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('changePassword', {
                url: '/user/changePassword',
                templateUrl: 'app/views/profile/changepassword.html',
                controller: 'ChangePasswordCtrl',
                controllerAs: 'ChangePasswordCtrl'
            });
    }
})();



