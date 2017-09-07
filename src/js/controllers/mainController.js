var app = angular.module('app', ['ui.router', 'ionic']);

app.controller('home', function($scope) {
	$scope.tasks = [
    { title: 'Collect coins' },
    { title: 'Eat mushrooms' },
    { title: 'Get high enough to grab the flag' },
    { title: 'Find the Princess' }
  ];
});