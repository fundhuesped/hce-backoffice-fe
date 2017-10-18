 var soap = require('soap');
  var url = 'https://apppreprod.rentascordoba.gob.ar/turnero/servlet/asolicitartrnws?wsdl';
  var args = {Secid: '56', Wstid: '10.42.39.22', Trnid: '1', Trnnm: '1'};
  soap.createClient(url, function(err, client) {
      client.Execute(args, function(err, result) {
          console.log(result);
      });
  });