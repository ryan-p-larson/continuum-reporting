
Majors Formatting and Crosswalk
===

Purposes of this notebook:
1. Merge the ACT *major codes* with the Classification of Instructional Programs (*CIP* codes), which organize majors into logical heirarchies.
2. Make a major data file that will serve as a lookup for the web application.


```python
# Libraries
import pandas as pd
import numpy as np
```


```python
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
# Global vars and data files
actMajors = pd.read_excel("../data/in/majors/majors and occupations.xlsx")
majorFitFile = "../data/in/majors/major-interest-fit.json"

print ("There are {} individual majors".format(actMajors.shape[0]))
print ("\t...under {} categories.".format(len(set(actMajors["category"]))))
print ("\t...and {} sub categories.".format(len(set(actMajors["subcategory"]))))

actMajors.head()
```

    There are 295 individual majors
    	...under 19 categories.
    	...and 75 sub categories.
    




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>maj_occ_number</th>
      <th>maj_occ</th>
      <th>subcategory</th>
      <th>category</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>999</td>
      <td>Undecided</td>
      <td>Undecided</td>
      <td>UNDECIDED</td>
    </tr>
    <tr>
      <th>1</th>
      <td>110</td>
      <td>Agriculture, General</td>
      <td>Agriculture, General</td>
      <td>AGRICULTURE &amp; NATURAL RESOURCES CONSERVATION</td>
    </tr>
    <tr>
      <th>2</th>
      <td>111</td>
      <td>Agribusiness Operations</td>
      <td>Agriculture, General</td>
      <td>AGRICULTURE &amp; NATURAL RESOURCES CONSERVATION</td>
    </tr>
    <tr>
      <th>3</th>
      <td>112</td>
      <td>Agricultural Business &amp; Management</td>
      <td>Agriculture, General</td>
      <td>AGRICULTURE &amp; NATURAL RESOURCES CONSERVATION</td>
    </tr>
    <tr>
      <th>4</th>
      <td>113</td>
      <td>Agricultural Economics</td>
      <td>Agriculture, General</td>
      <td>AGRICULTURE &amp; NATURAL RESOURCES CONSERVATION</td>
    </tr>
  </tbody>
</table>
</div>



### Categories


```python
# Look at the major categories
categoryCount = actMajors.groupby(['category'])['category'].count().sort_values(ascending=False)
subcategoryCount = actMajors.groupby(['category', 'subcategory'])['subcategory'].count()#.sort_values(ascending=False)
```


```python
categoryCount
```




    category
    BUSINESS                                        31
    HEALTH SCIENCES & TECHNOLOGIES                  31
    COMMUNITY, FAMILY, & PERSONAL SERVICES          27
    EDUCATION                                       25
    SOCIAL SCIENCES & LAW                           17
    ENGINEERING TECHNOLOGY & DRAFTING               17
    AGRICULTURE & NATURAL RESOURCES CONSERVATION    16
    ARTS: VISUAL & PERFORMING                       16
    REPAIR, PRODUCTION, & CONSTRUCTION              16
    ENGINEERING                                     14
    SCIENCES: BIOLOGICAL & PHYSICAL                 14
    ENGLISH & FOREIGN LANGUAGES                     13
    AREA, ETHNIC, & MULTIDISCIPLINARY STUDIES       13
    COMMUNICATIONS                                  12
    COMPUTER SCIENCE & MATHEMATICS                  11
    HEALTH ADMINISTRATION & ASSISTING               10
    PHILOSOPHY, RELIGION, & THEOLOGY                 6
    ARCHITECTURE                                     5
    UNDECIDED                                        1
    Name: category, dtype: int64




```python
subcategoryCount
```




    category                                      subcategory                                                    
    AGRICULTURE & NATURAL RESOURCES CONSERVATION  Agriculture, General                                               11
                                                  Natural Resources Conservation, General                             5
    ARCHITECTURE                                  Architecture, General                                               5
    AREA, ETHNIC, & MULTIDISCIPLINARY STUDIES     Area Studies, General (e.g., African, Middle Eastern)               5
                                                  Ethnic & Minority Studies, General                                  5
                                                  Liberal Arts & General Studies                                      1
                                                  Library Science                                                     1
                                                  Multi/Interdisciplinary Studies                                     1
    ARTS: VISUAL & PERFORMING                     Art, General                                                        3
                                                  Cinema/Film                                                         1
                                                  Cinematography/Film/Vide Production                                 1
                                                  Dance                                                               1
                                                  Design & Visual Communications, General                             5
                                                  Music, General                                                      3
                                                  Photography                                                         1
                                                  Theatre Arts/Drama                                                  1
    BUSINESS                                      Accounting                                                          1
                                                  Accounting Technician                                               1
                                                  Business Administration & Management, General                      15
                                                  Business/Management Quantitative Methods, General                   2
                                                  Business/Managerial Economics                                       1
                                                  Finance, General                                                    5
                                                  Management Information Systems                                      1
                                                  Real Estate                                                         1
                                                  Sales, Merchandising, & Marketing, General                          3
                                                  Secretarial Studies & Office Administration                         1
    COMMUNICATIONS                                Communications Technology, General                                  4
                                                  Communications, General                                             8
    COMMUNITY, FAMILY, & PERSONAL SERVICES        Family & Consumer Sciences, General                                 7
                                                  Parks, Recreation, & Leisure, General                               5
                                                                                                                     ..
    HEALTH ADMINISTRATION & ASSISTING             Health Services Administration,General                              4
                                                  Medical/Clinical Assisting, General                                 6
    HEALTH SCIENCES & TECHNOLOGIES                Chiropractic (Pre-Chiropractic)                                     1
                                                  Dental Hygiene                                                      1
                                                  Dentistry (Pre-Dentistry)                                           1
                                                  Emergency Medical Technology                                        1
                                                  Health-Related Professions & Services, General                      4
                                                  Health/Medical Technology, General                                  6
                                                  Medicine (Pre-Medicine)                                             1
                                                  Nursing, Practical/Vocational (LPN)                                 1
                                                  Nursing, Registered (BS/RN)                                         1
                                                  Optometry (Pre-Optometry)                                           1
                                                  Osteopathic Medicine                                                1
                                                  Pharmacy (Pre-Pharmacy)                                             1
                                                  Physician Assisting                                                 1
                                                  Therapy & Rehabilitation, General                                   9
                                                  Veterinary Medicine (Pre-Veterinarian)                              1
    PHILOSOPHY, RELIGION, & THEOLOGY              Philosophy                                                          1
                                                  Religion                                                            1
                                                  Theology, General                                                   4
    REPAIR, PRODUCTION, & CONSTRUCTION            Aviation & Airway Science, General                                  3
                                                  Construction Trades (e.g., carpentry, plumbing, electrical)         1
                                                  Mechanics & Repairers, General                                      8
                                                  Precision Production Trades, General                                3
                                                  Transportation & Materials Moving (e.g., air, ground, & marine)     1
    SCIENCES: BIOLOGICAL & PHYSICAL               Biology, General                                                    8
                                                  Physical Sciences, General                                          6
    SOCIAL SCIENCES & LAW                         Legal Studies, General                                              5
                                                  Social Sciences, General                                           12
    UNDECIDED                                     Undecided                                                           1
    Name: subcategory, dtype: int64



### Major Fit


```python
# Pandas to read and merge data frames
majorFit = pd.read_json(majorFitFile)
majors = pd.DataFrame(majors)

# Validity check?
#if (majorFit.shape[0] == majors.shape[0]-1):
    #print ("There are the same number of rows in head data frame !")
print (majorFit.shape[0])
print (len(majors))
majorFit.head()
```

    33
    34
    




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>ACTcom</th>
      <th>Arts</th>
      <th>BusinesOp</th>
      <th>BusinessAdmNSales</th>
      <th>ScienceNTechnology</th>
      <th>SocialService</th>
      <th>Technical</th>
      <th>sum</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>22.373210</td>
      <td>48.0</td>
      <td>50.8</td>
      <td>51.1</td>
      <td>54.1</td>
      <td>50.0</td>
      <td>53.5</td>
      <td>307.5</td>
    </tr>
    <tr>
      <th>1</th>
      <td>23.465804</td>
      <td>51.2</td>
      <td>48.2</td>
      <td>48.3</td>
      <td>59.2</td>
      <td>49.9</td>
      <td>57.3</td>
      <td>314.1</td>
    </tr>
    <tr>
      <th>2</th>
      <td>24.405588</td>
      <td>55.7</td>
      <td>49.4</td>
      <td>49.8</td>
      <td>52.4</td>
      <td>49.6</td>
      <td>55.4</td>
      <td>312.3</td>
    </tr>
    <tr>
      <th>3</th>
      <td>23.213763</td>
      <td>54.4</td>
      <td>49.4</td>
      <td>54.4</td>
      <td>52.7</td>
      <td>51.3</td>
      <td>49.3</td>
      <td>311.5</td>
    </tr>
    <tr>
      <th>4</th>
      <td>22.698096</td>
      <td>55.6</td>
      <td>48.4</td>
      <td>54.9</td>
      <td>49.8</td>
      <td>53.2</td>
      <td>48.6</td>
      <td>310.5</td>
    </tr>
  </tbody>
</table>
</div>




```python
# Normalize the columns

majorFitCols = ["ACTcom", "Arts", "BusinesOp", "BusinessAdmNSales", "ScienceNTechnology", "SocialService", "Technical", "sum"]
majorFitNames = ["actComposite", "arts", "busOper", "busAdminSales", "sciTech", "socServ", "technical", "sum"]
majorFit.rename(columns=dict(zip(majorFitCols, majorFitNames)), inplace=True)
```


```python
# make it
mergedMajorFit = pd.concat([majors, majorFit], axis=1, join="inner")
for i in mergedMajorFit.columns.values:
    print (i)
```

    cip
    label
    actComposite
    arts
    busOper
    busAdminSales
    sciTech
    socServ
    technical
    sum
    


```python
# write out as csv so it's easy for others
mergedMajorFit.to_csv("../data/out/majorFit.csv", index=False, encoding='utf-8')
```


```python
# Write it out to JSON so we can use the ccode as a look up key
mergedMajorFit.set_index("cip").to_json("../data/out/majorFit.json", orient="index", double_precision=4)
```
