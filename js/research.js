/*
This is a D3 & lodash version of Ty Cruce's Rsearch functions
It uses a model determination to determine which model to use 
when evaluating a person's sucess at college.

In addition to those lookups, there are a couple of correlation and probability functions baked in as well.
This includeds academic fit, interest fit, and 2/4/B probabilities given any student/major combo

For calculating probs: 
    1. getModel -> model #
    2. probReturning(model #, majorCip) -> model lookup
    3. probability(student, )
*/


// ===========| Function | ===============//

// Utils
function getModel(student) {
    // Given a student, check which properties are available and return correct model #
    if (student.act === null) { return null; }

    // Mapping this in a way to more easily code and yet still match what Krista setup
    // within her spreadsheet
    var modelMap = [1,6,5,7,3,12,11,13,2,9,8,10,4,15,14,16];

    var mask = (student.engageSocial !== '' ) ? 1 : 0;
        mask |= (student.academicDiscipline !== '') ? 2 : 0;
        mask |= (student.interest !== '') ? 4 : 0;
        mask |= (student.gpa !== '') ? 8 : 0;

    model = modelMap[mask];
    return model;
}
function getactrange(student) {
    if (student.act > 27) return '28-36';
    if (student.act > 23) return '24-27';
    if (student.act > 19) return '20-23';
    if (student.act > 15) return '16-19';
    return '01-15';
}

// Major-interest
function calcInterestFit(student, major) {
    // Returns major interest correlation for a given student and major

    // Data validation before going on
    if (majorFit === null) { console.log("majors is null"); };

    // Average out all of the student's(!) interest vars
    var avgx = (parseFloat(+student.arts) +  
            parseFloat(+student.socServ) + 
            parseFloat(+student.busOper) + 
            parseFloat(+student.busAdminSales) + 
            parseFloat(+student.sciTech) + 
            parseFloat(+student.technical))/6;

    var avgy = +major.sum/6,
        num = (parseFloat(+student.arts) - avgx) * (major.arts - avgy) + 
            (parseFloat(+student.socServ) - avgx) * (major.socServ - avgy) +
            (parseFloat(+student.busOper) - avgx) * (major.busOper - avgy) +
            (parseFloat(+student.busAdminSales) - avgx) * (major.busAdminSales - avgy) +
            (parseFloat(+student.sciTech) - avgx) * (major.sciTech - avgy) +
            (parseFloat(+student.technical) - avgx) * (major.technical - avgy);

    var den = (Math.pow((parseFloat(+student.arts) - avgx), 2) + 
            Math.pow((parseFloat(+student.socServ) - avgx), 2) + 
            Math.pow((parseFloat(+student.busOper) - avgx), 2) + 
            Math.pow( (parseFloat(+student.busAdminSales) - avgx), 2) + 
            Math.pow((parseFloat(+student.sciTech) - avgx), 2) + 
            Math.pow((parseFloat(+student.technical) - avgx), 2)) 
            * 
            (Math.pow((+major.arts - avgy), 2) +
            Math.pow((+major.socServ - avgy), 2) +
            Math.pow((+major.busOper - avgy), 2) +
            Math.pow((+major.busAdminSales - avgy), 2) +
            Math.pow((+major.sciTech - avgy), 2) +
            Math.pow((+major.technical - avgy), 2)
            );

    var interestFit = num / Math.sqrt(den);

    return interestFit;
}
function calcAcademicFit(student, major) {
    // Returns the difference between a student and major's ACT scores
    var calc = (+major.actComposite- +student.actComposite);
    return calc;
}

// Probs
function probability(student, probVars) {
    // takes from both
    //  -act comp, gpa, interest???, engageDiscipline, engageSocial

    if (probVars === undefined) { return null; }
    return  +(100 * (Math.pow(Math.E, probVars.intercept + 
        (+student.act * probVars.act) +
        (+student.gpa * probVars.gpa) +
        (+student.interest * probVars.interest) +
        (+student.engageDiscipline * probVars.engageDiscipline) +
        (+student.engageSocial * probVars.engageSocial))) 
        /
        (1 + Math.pow(Math.E, probVars.intercept + 
        (+student.act * probVars.act) +
        (+student.gpa * probVars.gpa) +
        (+student.interest * probVars.interest) +
        (+student.engageDiscipline * probVars.engageDiscipline) +
        (+student.engageSocial * probVars.engageSocial)))).toFixed(1);
};

// These take model(1-16) and cip code (1-99)
// return {act, cip, engageDisc, engageSoc, gpa, intercept, interest, model}
function probReturning(model, cip) { return _.find(probReturningValues, { 'cip': cip, 'model': model }); };
function probB(model, cip) { return _.find(probBValues, { 'cip': cip, 'model': model }); };
function probGrad(model, cip) { return _.find(probGradValues, { 'cip': cip, 'model': model }); };


// College Recommender
function findZips(state) { return _.filter(recZips, {'homestate' : state}); };
function findRecColleges(state, actrange) { return _.filter(collegeRec, {'stcat':state, 'actcat':actrange}); };
function findLikeColleges(ccode, actrange) { return _.filter(collegeLike, {'ccode':ccode, 'actcat':actrange}); };
function findCollege(ccode) { return _.filter(recColleges, {'ccode':ccode}); };