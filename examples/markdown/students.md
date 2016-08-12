
Student Scores Formatting
===



```python
# Libraries
import pandas as pd
import numpy as np
```


```python
# Global vars & data files

scorecardFile = "../data/in/scorecard/MERGED2013_PP.csv"
crosswalkFile = "../data/in/crosswalks/colleges-xwalk.csv"
majorCrosswalkFile = pd.ExcelFile("../data/in/crosswalks/ACT_Major_x_CIP_111615_v2.xls")


f13File = "../data/in/students/history20132014.csv"
f14File = "../data/in/students/history20142015.csv"
f15File = "../data/in/students/history20152016.csv"

majors = [
    {"cip": 1, "label": 'Agriculture, Agriculture Operations, and Related Sciences'},
    {"cip": 3, "label": 'Natural Resources and Conservation'},
    {"cip": 4, "label": 'Architecture and Related Services'},
    {"cip": 5, "label": 'Area, Ethnic, Cultural, and Gender Studies'},
    {"cip": 9, "label": 'Communication, Journalism, and Related Programs'},
    {"cip": 10, "label": 'Communications Technologies/Technicians and Support Services'},
    {"cip": 11, "label": 'Computer and Information Sciences and Support Services'},
    {"cip": 12, "label": 'Personal and Culinary Services'},
    {"cip": 13, "label": 'Education'},
    {"cip": 14, "label": 'Engineering'},
    {"cip": 15, "label": 'Engineering Technologies/Technicians'},
    {"cip": 16, "label": 'Foreign Languages, Literatures, and Linguistics'},
    {"cip": 19, "label": 'Family and Consumer Sciences/Human Sciences'},
    {"cip": 22, "label": 'Legal Professions and Studies'},
    {"cip": 23, "label": 'English Language and Literature/Letters'},
    {"cip": 24, "label": 'Liberal Arts and Sciences, General Studies and Humanities'},
    {"cip": 26, "label": 'Biological and Biomedical Sciences'},
    {"cip": 27, "label": 'Mathematics and Statistics'},
    {"cip": 30, "label": 'Multi/Interdis"cip"linary Studies'},
    {"cip": 31, "label": 'Parks, Recreation, Leisure, and Fitness Studies'},
    {"cip": 38, "label": 'Philosophy and Religious Studies'},
    {"cip": 39, "label": 'Theology and Religious Vocations'},
    {"cip": 40, "label": 'Physical Sciences'},
    {"cip": 42, "label": 'Psychology'},
    {"cip": 43, "label": 'Security and Protective Services'},
    {"cip": 44, "label": 'Public Administration and Social Service Professions'},
    {"cip": 45, "label": 'Social Sciences'},
    {"cip": 47, "label": 'Mechanic and Repair Technologies/Technicians'},
    {"cip": 49, "label": 'Transportation and Materials Moving'},
    {"cip": 50, "label": 'Visual and Performing Arts'},
    {"cip": 51, "label": 'Health Professions and Related Clinical Sciences'},
    {"cip": 52, "label": 'Business, Management, Marketing, and Related Support Services'},
    {"cip": 54, "label": 'History'},
    {"cip": 99, "label": 'Overall'}
]
```


```python
# Student variables
stuCols = ["REC_NUMBER", 
"STU_RES_STATE_N",
"STU_RES_STATE_A",
"STU_ZIPCODE_5",
"HS_GPA", 
"ACT_C", 
"PAB_ACADEMIC_DISCIPLINE",
"PAB_SOCIAL_ACTIVITY", 
"RETENTION_INDEX", 
"ACADEMIC_SUCCESS_INDEX", 
"PAB_RETENTION_INDEX", 
"PAB_ACADEMIC_SUCCESS_INDEX", 
"INTINV_SCI_PCTL",
"INTINV_ARTS_PCTL",
"INTINV_SSRV_PCTL",
"INTINV_BUSC_PCTL",
"INTINV_BUSO_PCTL",
"INTINV_TECH_PCTL",
"FLAG_REVERSE_T", 
"FLAG_ITEMSD", 
"FLAG_MAXBIN", 
"FLAG_HETERO", 
"HOMEWORK", 
"ABSENT", 
"STU_RES_STATE_N", 
"STU_RES_STATE_A", 
"STU_ZIPCODE_5", 
"STU_ZIPCODE_PLUS4",  
"ENRL_FULL_PART_TIME", 
"COLL_MAJOR", 
"OCC_PLAN_1", 
"OCC_PLAN_2",
"COLL_MAJOR_SURENESS", 
"OCC_SURENESS", 
"EXPECT_EDUC_LVL", 
"NEED_EDUC_OCC_PLANS", 
"NEED_WRITING_SKLS", 
"NEED_READ_SP_COMP", 
"NEED_STUDY_SKLS", 
"NEED_MATH_SKLS", 
"COLLPRG_INDEP_STUDY", 
"COLLPRG_FRESH_HONORS", 
"COLLPRG_STUDY_ABROAD", 
"COLL_APPLY_FINAID", 
"COLL_HELP_FINDWORK", 
"BG_HOME_DIST_PREF", 
"COLLPREF_TYPE", 
"COLLPREF_COED", 
"COLLPREF_STATE1", 
"COLLPREF_STATE2", 
"COLLPREF_STATE3", 
"COLLPREF_STATE4", 
"COLLPREF_STATE5", 
"COLLPREF_TUITION_MAX", 
"COLLPREF_POPL_MAX", 
"COLLRANK_TYPE", 
"COLLRANK_COED_RATIO", 
"COLLRANK_LOCATION", 
"COLLRANK_TUITION", 
"COLLRANK_ENROLL_SIZE", 
"COLLRANK_STUDYFLDS", 
"COLLRANK_OTHER"]
```


```python
# ACT Score dicts
questions = {
    # example OR // for javascript
    'EXPECT_EDUC_LVL': {
        "question": "whats the highest level of education you expect to complete?",
        1: "Business/technical program",
        2: "Associate's",
        3: "Bachelor's",
        4: "One or 2 years of graduate study",
        5: "Doctorate or Professional degree",
        6: "Other"
    },
    
    #Preferences

    #profile  q 63
    'BG_HOME_DIST_PREF': {
        "question": "how far away do you live from the college you expect to attend?",
        1: "< 10",
        2: "10-25",
        3: "26-100 miles",
        4: "> 100 miles",
        5: "I have no particular college in mindn yet"},

    #profile q 66
    'COLLPREF_TYPE': {
        "question": "I prefer to attend the following type of college:",
        1: "Public college or university (4-year)",
        2: "Private college or university (4-year)",
        3: "Public community or junior college (2-year)",
        4: "Private junior college (2-year)",
        5: "Career/technical school (2-year or less)",
        6: "School of nursing"},

    #q 67
    'COLLPREF_COED': {
        "question": "I prefer to attend a college that is",
        1: "coeducational",
        2: "all male",
        3: "all female",
        4: "no preference"},

    #68-1
    'COLLPREF_STATE1': {
        "question": "in which state do you prefer to attend college? up to two in order of preference",
        1: "Alabama",
        2: "Alaska",
        3: "Arizona",
        4: "Arkansas",
        5: "California",
        6: "Colorado",
        7: "Connecticut",
        8: "Deleware",
        9: "D.C.",
        10: "Florida",
        11: "Georia",
        12: "Hawaii",
        13: "Idaho",
        14: "Illinois",
        15: "Indiana",
        16: "Iowa",
        17: "Kansas",
        18: "Kentucky",
        19: "Louisiana",
        20: "Maine",
        21: "Maryland",
        22: "Massachusetts",
        23: "Michigan",
        24: "Minnesota",
        25: "Mississippi",
        26: "Missouri",
        27: "Montana",
        28: "Nebraska",
        29: "Nevada",
        30: "New Hampshire",
        31: "New Jersey",
        32: "New Mexico",
        33: "New York",
        34: "North Carolina",
        35: "North Dakota",
        36: "Ohio",
        37: "Oklahoma",
        38: "Oregon",
        39: "Pennsylvania",
        40: "Rhode Island",
        41: "South Carolina",
        42: "South Dakota",
        43: "Tennessee",
        44: "Texas",
        45: "Utah",
        46: "Vermont",
        47: "Virginia",
        48: "Washington",
        49: "West Virginia",
        50: "Wisconsin",
        51: "Wyoming",
        52: "Canada",
        53: "All Other",
        55: "Other"},

    #q 69
    'COLLPREF_TUITION_MAX': {
        "question": "I prefer to attend a college with a maximum yearly tuition of (w/o room and board)",
        1: 500,
        2: 1000,
        3: 2000,
        4: 3000,
        5: 4000,
        6: 5000,
        7: 7500,
        8: 10000,
        9: 0
    },

    #q 70
    'COLLPREF_POPL_MAX': {
        "question": "The size of the student body of the college I prefer to attend is",
        1: "under 1,000 students",
        2: "1,000 to 5,000 students",
        3: "5,000 to 10,000 students",
        4: "10,000 to 20,000 students",
        5: "20,000 students and over"
    },

    #71-77 are ranking! could be 1-7 (1 is MOST important)
    #71
    'COLLRANK_TYPE': {
        "question": "Type of institution (private, public, 4-yr, 2yr)",
        1: "Highest importance",
        2: "Higher importance",
        3: "High importance",
        4: "Medium importance",
        5: "Low importance",
        6: "Lower importance",
        7: "Lowest importance"
    },
    
    'HS_GPA': {
        1.0: 0.75,
        2.0: 1.2,
        3.0: 1.7,
        4.0: 2.2,
        5.0: 2.7,
        6.0: 3.2,
        7.0: 3.75
    },
    
    'COLLRANK_COED_RATIO': {"question": "Male/female composition of student body"},
    'COLLRANK_LOCATION': {"question": "Location (state or region)"},
    'COLLRANK_TUITION': {"question": "Tuition, cost"},
    'COLLRANK_ENROLL_SIZE': {"question": "Size of enrollment"},
    'COLLRANK_STUDYFLDS': {"question": "Field of study (major, curriculum)"},
    'COLLRANK_OTHER': {"question": "A factor other than those listed above"}
}
```

### Students

Enough of that, lets read in the data and encode it according to our questions dictionairy (thanks Kate!).


```python
# Data File, pandas
students = pd.read_csv(f13File, usecols=stuCols, index_col=False)
students.shape
```




    (10422, 59)




```python
# Columns, make a dict to rename them to human readable formatting
# Use the values as a list to filter the dataset again

stuColForm = {
    # Information
    "STU_RES_STATE_N": "stuStN",
    "STU_RES_STATE_A": "stuStA",
    "STU_ZIPCODE_5": "stuZip",
    # Score
    "HS_GPA": "gpa",
    "ACT_C": "actComposite",
    
    # Measures
    "PAB_ACADEMIC_DISCIPLINE": "acadDisc",
    "PAB_SOCIAL_ACTIVITY": "socAct",
    "INTINV_SCI_PCTL": "sciTech",
    "INTINV_ARTS_PCTL": "arts",
    "INTINV_SSRV_PCTL": "socServ",
    "INTINV_BUSC_PCTL": "busAdminSales",
    "INTINV_BUSO_PCTL": "busOper",
    "INTINV_TECH_PCTL": "technical",
    
    # Major & Jobs
    "COLL_MAJOR": "majSel",
    "COLL_MAJOR_SURENESS": 'majSureness',
    "OCC_PLAN_1": "jobOne",
    "OCC_PLAN_2": "jobTwo",
    "OCC_SURENESS": "jobSureness",
    
    #Preferences
    'EXPECT_EDUC_LVL': 'schoolHighDeg',
    'BG_HOME_DIST_PREF': 'schoolLocation',
    'COLLPREF_TYPE': 'schoolType',
    'COLLPREF_COED': "schoolCoed",
    'COLLPREF_STATE1': 'schoolSt1',
    'COLLPREF_STATE2': 'schoolSt2',
    'COLLPREF_STATE3': 'schoolSt3',
    'COLLPREF_STATE4': 'schoolSt4',
    'COLLPREF_STATE5': 'schoolSt5',
    'COLLPREF_TUITION_MAX': 'schoolCost',
    'COLLPREF_POPL_MAX': 'schoolSize',
    'COLLRANK_TYPE': 'rankType',
    'COLLRANK_COED_RATIO': 'rankCoed',
    'COLLRANK_LOCATION': 'rankLocation',
    'COLLRANK_TUITION': 'rankCost',
    'COLLRANK_ENROLL_SIZE': 'rankSize',
    'COLLRANK_STUDYFLDS': 'rankStudy',
    'COLLRANK_OTHER': "rankOther"
}
students.rename(columns=stuColForm, inplace=True)

outCols = list(stuColForm.values())
```


```python
# Drop all rows that don't have the req vars
out = students[outCols].dropna(subset=
                               ["gpa", "actComposite", "arts", "busAdminSales", "busOper", "technical", "sciTech", "socServ", 
                                "majSel", "schoolType", "schoolCost"])

print ("The out file has {} remaining valid records.".format(out.shape[0]))
print ("\t-records deleted: {}".format((students.shape[0] - out.shape[0])))
```

    The out file has 3286 remaining valid records.
    	-records deleted: 7136
    


```python
# Write it out
out.to_csv("../data/out/students.csv", encoding='utf-8', index=False)
```
