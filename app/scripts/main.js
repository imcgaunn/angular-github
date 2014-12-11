/*
 * File: app/scripts/main.js
 * 91.461 Assignment 9
 * Ian McGaunn, UMass Lowell Computer Science, imcgaunn@cs.uml.edu
 * Copyright (c) 2014 by Ian McGaunn. All rights reserved.
 * May be freely copied or excerpted for educational purposes with credit to the author
 */

'use strict';

var app = angular.module('ReposApp', []);

app.constant('apiURL', 'https://api.github.com/users');

//the controller function for the app 'ReposApp'
app.controller('ReposCtrl', function ($scope, $http, apiURL) {
    $scope.user = 'bbatsov'; // default the user property of the model
    $scope.query = '';       // make sure the query is set to nothing
    $scope.sortField = 'name';
    $scope.reverse = true;

    // when user changes, fetch new json from github API
    $scope.$watch('user', function(nv, ov) {
        var reqURL = apiURL + '/' + nv + '/repos';

        console.log('user is: ' + nv);
        console.log('api URL: ' + apiURL + '/' + nv + '/repos');

        $http.get(reqURL).
            success(function(data) {
                $scope.reposData = data;
            }).
            error(function(data, status) {
                // get useful error information if json
                // can't be retrieved
                if (status === 404) {
                    $scope.reposData = {
                        'err': "user doesn't exist",
                        'user': nv
                    };
                }
            });
    });

    // only update 'user' property of scope when button is
    // pressed. Reset the query field too because it
    // probably isn't relevant now that the user has changed.
    $scope.updateUser = function() {
        var userField = document.getElementById('userField');
        $scope.user = angular.element(userField).val();

        $scope.query = '';
        var queryinput = document.getElementById('queryinput');
        angular.element(queryinput).val('');
    }

    $scope.valid = function() {
        // check if there's an error, if there is create a useful
        // error message and highlight the input field red.
        var userField = document.getElementById('userField');

        if ($scope.reposData['err'] === "user doesn't exist" ) {
            $scope.errorReason = 'User "' + $scope.reposData['user'] + '"' +
                ' does not refer to a valid github account';

            angular.element(userField).css('borderColor', 'red');
            return false;
        }

        // set borderColor to default if there aren't any problems
        angular.element(userField).css('borderColor', '');

        return true;
    }


    // helper function to avoid using '!' to invert truth values in angular expressions
    $scope.invalid = function() { return !($scope.valid()); }

    // check if JSON has been loaded
    $scope.dataLoaded = function() {
        return ($scope.reposData > 0);
    }

});
