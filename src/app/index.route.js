(function() {
  'use strict';

  angular
    .module('hce.app')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
          abstract: true,
          url: '/app',
          templateUrl: 'app/views/app-layout/app-layout.html',
          controller: 'AppLayoutController',
          controllerAs: 'AppLayoutController',
      })
      .state('app.home', {
          url: '/home',
          views: {
            'content': {
              templateUrl: 'app/main/main.html',
              controller: 'MainController',
              controllerAs: 'MainController'        
            }
          },
      })
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'MainController'
      });
    $urlRouterProvider.otherwise('/');
  }
})();
