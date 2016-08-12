// =====| Functions |===== //

var Student = function (x) {
	stu = {
		majorsCanonical: majorFit,
		majorsCurrent: majorFit,
		scoresCanonical: students[x],
		scoresCurrent: students[x],
	};
	//Add functions
	Object.keys(studentFunctions).forEach(function(d) {
		stu[d] = studentFunctions[d];
	});

	// Init student calcs
	stu.initScores();

	//Set the slider values
	//stu.setSliders();

	// Calc which majors are shown
	stu.labelMajors();
	return stu;
};

var studentFunctions = {
	// Functions
	getScores: function getScores() { return this.scoresCurrent; },
	getMajors: function getMajors() { return this.majorsCurrent; },
	initScores: function initScores() {
		var _this = this.getScores();

		this.majorsCurrent = majorFit;
		this.majorsCurrent.forEach(function(d) {
			var comparator = d.probGrad;

			d.interestFit = calcInterestFit(_this, d);
			d.academicFit = calcAcademicFit(_this, d); 

			// Model object to pass to prob model lookup functions
			var modelLookup = {
				act: _this.actComposite,
				gpa: _this.gpa,
				interest: d.interestFit,
				engageDiscipline: _this.acadDisc,
				engageSocial: _this.socAct
			};
			d.probB = probability(modelLookup, probB(16, +d.cip));
			d.probTwo = probability(modelLookup, probReturning(16, +d.cip));
			d.probGrad = probability(modelLookup, probGrad(16, +d.cip));
			d.probSum = (d.probB + d.probTwo + d.probGrad) / 3;
			d.visible = 0;
		});
		
		this.labelMajors();
	},
	updateScores: function updateScores() {
		var _this = this;

		this.majorsCurrent.forEach(function(d) {

			d.interestFit = calcInterestFit(_this.getScores(), d); 
			// Model object to pass to prob model lookup functions
			var modelLookup = {
				act: _this.scoresCurrent.actComposite,
				gpa: _this.scoresCurrent.gpa,
				interest: d.interestFit,
				engageDiscipline: _this.scoresCurrent.acadDisc,
				engageSocial: _this.scoresCurrent.socAct
			};
			d.probB = probability(modelLookup, probB(16, +d.cip));
			d.probTwo = probability(modelLookup, probReturning(16, +d.cip));
			d.probGrad = probability(modelLookup, probGrad(16, +d.cip));
		});
	},
	getACTRange: function getACTRange() {
	// returns the range for college lookups
		var act = this.scoresCanonical.actComposite;
	    if (act > 27) return '28-36';
	    if (act > 23) return '24-27';
	    if (act > 19) return '20-23';
	    if (act > 15) return '16-19';
	    return '01-15';
	},
	getMajorsInterest: function getMajorsInterest() {
	// return majors sorted by interst fit
		temp = this.majorsCurrent;
		temp.sort(function(a, b) {
			return b.interestFit - a.interestFit; 
		});
		return temp;
	},
	getMajorsAcademic: function getMajorsAcademic() {
	// return majors sorted academic
		temp = this.majorsCurrent;
		temp.sort(function(a, b) {
			return a.academicFit - b.academicFit;
		});
		return temp;
	},
	getMajorsProb: function getMajorsProb() {
		// Grab Majors
		temp = this.majorsCurrent;
		//create avg
		//temp.forEach(function(d) { d.probSum = ((d.probB + d.probTwo + d.probFour)/3); });
		// sort by sum of probs
		temp.sort(function(a, b) {
			return b.probSum - a.probSum;
			//return b.probGrad - a.probGrad;
		});
		return temp;
	},
	getMajorsVisible: function getMajorsVisible() {
	// return list of visible (selected) majors
		temp = this.majorsCurrent;
		temp = temp.filter(function(d) {
			return d.visible === 1;
		});
		return temp;
	},
	getMajorsInvisible: function getMajorsInvisible() {
		temp = this.getMajors();
		temp = temp.filter(function(d) {
			return d.visible === 0;
		});
		return temp;
	},
	getRecColleges: function getRecColleges() {
		stuSt = this.scoresCanonical["schoolSt1"];
		stuAct = this.getACTRange();
		return findRecColleges(stuSt, stuAct);	
	},
	getRecCollegesFilter: function getRecCollegesFilter() {
		var recCollege = this.getRecColleges()[0],
			topMatch = findLikeColleges(+recCollege.ccode, this.getACTRange());

		var temp = [];
		for (var i=1; i<11; i++) {
			temp.push(colleges[topMatch[0]['col' + i]]);
		};

		return temp.filter(function(d) { return d !== undefined; });
	},
	getSankey: function getSankey() {
		var majors = this.getMajorsVisible().map(function(d) { 
				var pad = ('00'+d.cip).slice(-2);
				return "CIP" + pad; }),
			recColleges = this.getRecCollegesFilter(),
			nodes = [],
			links = [];

		recColleges.forEach(function(d) {
			var name = d.schoolName;

			//add college node
			nodes.push(name);

			for (var i=0; i<majors.length; i++) {
				if (d[majors[i]] === 1) {
					links.push({"source":majors[i], "target": name, "value": 1});
				};
			};
		});
		majors.forEach(function(d) { nodes.push(d); });

		// Loop through and create indexed positions instead of name
     	links.forEach(function (d, i) {
       		links[i].source = nodes.indexOf(links[i].source);
        	links[i].target = nodes.indexOf(links[i].target);
     	});
     	// Same with the nodes
     	nodes.forEach(function (d, i) {
       		nodes[i] = { "name": d };
     	});
		
		return {"nodes":nodes, "links":links};
	},
	setSliders: function setSliders() {
		//Create temp to reference the scores when we're in the loop
		temp = this.scoresCanonical;

		// Array of objects created and sorted
		var interests = ["arts","busAdminSales", "busOper", "sciTech", "socServ", "technical"]
			.map(function(d) { return {"interest": d, "value": temp[d]}; })
			.sort(function(a, b) { return +b.value - +a.value; });
		
		//use d3 to init the sliders
		// ideally create them but whaterver
		interests.forEach(function(d) { 
			d3.select("#" + d.interest).node().value = +d.value;
		});

	},
	labelMajors: function labelMajors() {
		var filtered = this.getMajorsInterest()
			.forEach(function(d) {  
				
				if ((d.cip == "1") || (d.cip == "3") || (d.cip == "31")) { 
					return d.visible = 1; 
				} else if (d.cip == "50") {
					d.visible =2;
				};
			});

		return filtered;	
	},
	saveMajorToggle: function saveMajor(maj) {
		var record = _.find(student.majorsCurrent, {'cip':maj});
		if (record.visible === 0) {
			return record.visible = 1;
		} else {
			return record.visible = 0;
		};
	},
	saveCheck: function saveCheck(maj) {
		return _.find(student.majorsCurrent, {'cip':maj}).visible;
	}

};