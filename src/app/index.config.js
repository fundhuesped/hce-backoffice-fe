(function() {
  'use strict';

  angular
    .module('hce.app')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, $resourceProvider) {
    // Enable log
    $logProvider.debugEnabled(true);
    $resourceProvider.defaults.stripTrailingSlashes = false;

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
  }

})();
