// ========| Data |===========\\
var students = null;
d3.csv('data/out/students.csv', function(data) {
        students = data;
    }).on("error", function() {
        console.log('failed to load student\'s score data.');
    });

var majorFit = null;
d3.csv('data/out/majorFit.csv', function(data) {
        majorFit = data;
    }).on("error", function() {
        console.log('failed to load major-interest lookup data.');
    });

var majorFitJson = null;
d3.json("data/out/majorFit.json", function(data) {
    majorFitJson = data;
});

var majorLookupJson = null;
d3.json("data/out/majorLookup.json", function(data) {
    majorLookupJson = data;
});

var probReturningValues = null;
d3.json('data/in/research/probReturning.json', function(data) {
        probReturningValues = data;
    }).on("error", function() {
        console.log('failed to load probability of returning map data.');
    });

var probBValues = null;
d3.json('data/in/research/probB.json', function(data) {
        probBValues = data;
    }).on("error", function() {
        console.log('failed to load probability of obtaining a B data.');
    });

var probGradValues = null;
d3.json('data/in/research/probGrad.json', function(data) {
        probGradValues = data;
    }).on("error", function() {
        console.log('failed to load probability of graduating data.');
    });

var colleges = null;
d3.json('data/out/colleges.json', function(data) {
        colleges = data;
    }).on("error", function() {
        console.log('failed to load probability of recommendor colleges data.');
    });

var collZips = null;
d3.json('data/in/research/recommendor-zips.json', function(data) {
        collegeZips = data;
    }).on("error", function() {
        console.log('failed to load probability of recommendor zips data.');
    });

var collegeRec = null;
d3.csv('data/out/rec-recommended.csv', function(data) {
        collegeRec = data;
    }).on("error", function() {
        console.log('failed to load probability of recommendor college lookup data.');
    });

var collegeLike = null;
d3.json('data/in/research/recommendor-lookup.json', function(data) {
        collegeLike = data;
    }).on("error", function() {
        console.log('failed to load probability of similar college lookup data.');
    });

// FOR PRESENTATION
var graph = null;
d3.json('data/temp/bigten-sankey.json', function(data) {
    graph = data;
});