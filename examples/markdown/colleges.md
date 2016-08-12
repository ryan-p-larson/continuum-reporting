
Colleges
===

### Merging ACT *ccode*'s and IPED *unitid*'s / OPEID *opeid*'s

ACT has historically kept their information in silos. In an effort to consolidate information for the Continuum Reporting internship project I'm documenting considerations. This notebook is a record of the data discovery process.


```python
# Libraries
import pandas as pd
import numpy as np
import simplejson as json

# pandas formatting
```


```python
# Global vars & data files

scorecardFile = "../data/in/scorecard/MERGED2013_PP.csv"
recommenderCollegesFile = "../data/in/research/recommendor-colleges-2.json"
crosswalkFile = "../data/in/crosswalks/colleges-xwalk.csv"


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

### Scorecard

From the Department of Education. Has *a lot* of information about colleges, too much. We'll be narrowing down the relevant columns to make working with it easier. **But** it's important to note that there's many more variabels that could be relevant based on a student's attributes (e.g. % first generation students at an college is included, but only if the student is first generational themselves).


```python
# Variable filtering, too much data otherwise

scorecardCols = [
# School vars
"INSTNM", "PREDDEG", "HIGHDEG", "CONTROL", "ZIP","UGDS", #size = grad seeking undergrad, not just part time
# School IDS
'﻿UNITID', "opeid6",
# ACT Composite
"ACTCMMID",

# Tuition vars
"TUITIONFEE_IN",
"TUITIONFEE_OUT"]

# Major vars, the Scorecard data has columns for each CIP 2 digit code, for each type of degree
for i in majors:
    # scorecard doesn't have an 'all majors'(99)
    if (i["cip"] == 99):
        continue
        
    # str for dict comprehension, zfill to make it 1 -> 01
    cip = str(i["cip"]).zfill(2)
    scorecardCols.append("CIP" + cip + "ASSOC") #Associates major
    scorecardCols.append("CIP" + cip + "BACHL") #Bachelors major
    scorecardCols.append("CIP" + cip + "CERT1")
    scorecardCols.append("CIP" + cip + "CERT2")
    scorecardCols.append("CIP" + cip + "CERT4")
```


```python
scorecard = pd.read_csv(scorecardFile, usecols=scorecardCols)
scorecard.rename(columns={'﻿UNITID':'UNITID'}, inplace=True) #WTF is this formatting?
scorecard.head()
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>UNITID</th>
      <th>opeid6</th>
      <th>INSTNM</th>
      <th>ZIP</th>
      <th>PREDDEG</th>
      <th>HIGHDEG</th>
      <th>CONTROL</th>
      <th>ACTCMMID</th>
      <th>CIP01CERT1</th>
      <th>CIP01CERT2</th>
      <th>...</th>
      <th>CIP52CERT4</th>
      <th>CIP52BACHL</th>
      <th>CIP54CERT1</th>
      <th>CIP54CERT2</th>
      <th>CIP54ASSOC</th>
      <th>CIP54CERT4</th>
      <th>CIP54BACHL</th>
      <th>UGDS</th>
      <th>TUITIONFEE_IN</th>
      <th>TUITIONFEE_OUT</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>100654</td>
      <td>1002</td>
      <td>Alabama A &amp; M University</td>
      <td>35762</td>
      <td>3</td>
      <td>4</td>
      <td>1</td>
      <td>17.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>...</td>
      <td>0.0</td>
      <td>2.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>4051.0</td>
      <td>7182.0</td>
      <td>12774.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>100663</td>
      <td>1052</td>
      <td>University of Alabama at Birmingham</td>
      <td>35294-0110</td>
      <td>3</td>
      <td>4</td>
      <td>1</td>
      <td>25.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>...</td>
      <td>1.0</td>
      <td>2.0</td>
      <td>0.0</td>
      <td>1.0</td>
      <td>0.0</td>
      <td>1.0</td>
      <td>2.0</td>
      <td>11200.0</td>
      <td>7206.0</td>
      <td>16398.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>100690</td>
      <td>25034</td>
      <td>Amridge University</td>
      <td>36117-3553</td>
      <td>3</td>
      <td>4</td>
      <td>2</td>
      <td>NaN</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>...</td>
      <td>0.0</td>
      <td>2.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>322.0</td>
      <td>6870.0</td>
      <td>6870.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>100706</td>
      <td>1055</td>
      <td>University of Alabama in Huntsville</td>
      <td>35899</td>
      <td>3</td>
      <td>4</td>
      <td>1</td>
      <td>26.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>...</td>
      <td>0.0</td>
      <td>2.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>2.0</td>
      <td>5525.0</td>
      <td>9192.0</td>
      <td>21506.0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>100724</td>
      <td>1005</td>
      <td>Alabama State University</td>
      <td>36104-0271</td>
      <td>3</td>
      <td>4</td>
      <td>1</td>
      <td>17.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>...</td>
      <td>0.0</td>
      <td>2.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>2.0</td>
      <td>5354.0</td>
      <td>8720.0</td>
      <td>15656.0</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 176 columns</p>
</div>




```python
# clean up those zips
scorecard["ZIP"] = scorecard["ZIP"].apply(lambda x: str(x)[:5])
scorecard.head(1)
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>UNITID</th>
      <th>opeid6</th>
      <th>INSTNM</th>
      <th>ZIP</th>
      <th>PREDDEG</th>
      <th>HIGHDEG</th>
      <th>CONTROL</th>
      <th>ACTCMMID</th>
      <th>CIP01CERT1</th>
      <th>CIP01CERT2</th>
      <th>...</th>
      <th>CIP52CERT4</th>
      <th>CIP52BACHL</th>
      <th>CIP54CERT1</th>
      <th>CIP54CERT2</th>
      <th>CIP54ASSOC</th>
      <th>CIP54CERT4</th>
      <th>CIP54BACHL</th>
      <th>UGDS</th>
      <th>TUITIONFEE_IN</th>
      <th>TUITIONFEE_OUT</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>100654</td>
      <td>1002</td>
      <td>Alabama A &amp; M University</td>
      <td>35762</td>
      <td>3</td>
      <td>4</td>
      <td>1</td>
      <td>17.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>...</td>
      <td>0.0</td>
      <td>2.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>0.0</td>
      <td>4051.0</td>
      <td>7182.0</td>
      <td>12774.0</td>
    </tr>
  </tbody>
</table>
<p>1 rows × 176 columns</p>
</div>




```python
print (scorecard.shape)
scorecard.dropna(subset=["ACTCMMID"], inplace=True)
print (scorecard.shape)
```

    (7804, 176)
    (1342, 176)
    


```python
# Helper function
def hasMaj(row, maj):
    
    if len(maj) == 1:
        print (maj)
    
    # Make the column names
    assoc = "CIP" + maj + "ASSOC"
    bachl = "CIP" + maj + "BACHL"
    cert1 = "CIP" + maj + "CERT1"
    cert2 = "CIP" + maj + "CERT2"
    cert4 = "CIP" + maj + "CERT4"
    
    # Grab row values
    hasAssoc = row[assoc]
    hasBachl = row[bachl]
    hasCert1 = row[cert1]
    hasCert2 = row[cert2]
    hasCert4 = row[cert4]
    
    #print (hasAssoc, hasBachl)
    if (hasAssoc == (1.0 or 2.0 or 1 or 2)) or (hasBachl == (1.0 or 2.0 or 1 or 2)):
        del row[assoc]
        del row[bachl]
        del row[cert1]
        del row[cert2]
        del row[cert4]
        return 1
    else:
        del row[assoc]
        del row[bachl]
        del row[cert1]
        del row[cert2]
        del row[cert4]
        return 0
```


```python
# Make single cols for each major

# Create dicts because pandas is hard
schools = scorecard.to_dict("records")

for school in schools: 
    for maj in majors:
        
        if (maj["cip"] == 99):
            continue  
        cip = str(maj["cip"]).zfill(2)

        school["CIP" + cip] = hasMaj(school, cip)    
```


```python
# Redfine the scorecard to keep it clean
scorecardCom = pd.DataFrame(schools)
scorecardCom.head()
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>ACTCMMID</th>
      <th>CIP01</th>
      <th>CIP03</th>
      <th>CIP04</th>
      <th>CIP05</th>
      <th>CIP09</th>
      <th>CIP10</th>
      <th>CIP11</th>
      <th>CIP12</th>
      <th>CIP13</th>
      <th>...</th>
      <th>CONTROL</th>
      <th>HIGHDEG</th>
      <th>INSTNM</th>
      <th>PREDDEG</th>
      <th>TUITIONFEE_IN</th>
      <th>TUITIONFEE_OUT</th>
      <th>UGDS</th>
      <th>UNITID</th>
      <th>ZIP</th>
      <th>opeid6</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>17.0</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>...</td>
      <td>1</td>
      <td>4</td>
      <td>Alabama A &amp; M University</td>
      <td>3</td>
      <td>7182.0</td>
      <td>12774.0</td>
      <td>4051.0</td>
      <td>100654</td>
      <td>35762</td>
      <td>1002</td>
    </tr>
    <tr>
      <th>1</th>
      <td>25.0</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>...</td>
      <td>1</td>
      <td>4</td>
      <td>University of Alabama at Birmingham</td>
      <td>3</td>
      <td>7206.0</td>
      <td>16398.0</td>
      <td>11200.0</td>
      <td>100663</td>
      <td>35294</td>
      <td>1052</td>
    </tr>
    <tr>
      <th>2</th>
      <td>26.0</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>...</td>
      <td>1</td>
      <td>4</td>
      <td>University of Alabama in Huntsville</td>
      <td>3</td>
      <td>9192.0</td>
      <td>21506.0</td>
      <td>5525.0</td>
      <td>100706</td>
      <td>35899</td>
      <td>1055</td>
    </tr>
    <tr>
      <th>3</th>
      <td>17.0</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>...</td>
      <td>1</td>
      <td>4</td>
      <td>Alabama State University</td>
      <td>3</td>
      <td>8720.0</td>
      <td>15656.0</td>
      <td>5354.0</td>
      <td>100724</td>
      <td>36104</td>
      <td>1005</td>
    </tr>
    <tr>
      <th>4</th>
      <td>26.0</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>...</td>
      <td>1</td>
      <td>4</td>
      <td>The University of Alabama</td>
      <td>3</td>
      <td>9450.0</td>
      <td>23950.0</td>
      <td>28692.0</td>
      <td>100751</td>
      <td>35487</td>
      <td>1051</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 44 columns</p>
</div>



### Recommender


```python
# Load all the college recommender probs
recCollegesCols = ["ccode", "x", "y", "zip"]

recColleges = pd.read_json(recommenderCollegesFile)
```


```python
# Filter just neccesary attrs
recColleges = recColleges[recCollegesCols]

print ("Recommender size: {}".format(recColleges.shape))
recColleges.head()
```

    Recommender size: (3270, 4)
    




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>ccode</th>
      <th>x</th>
      <th>y</th>
      <th>zip</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>-85.938360</td>
      <td>32.913360</td>
      <td>35010</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>-86.569000</td>
      <td>34.792912</td>
      <td>35762</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>-86.246181</td>
      <td>32.380663</td>
      <td>36109</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>-86.848920</td>
      <td>33.135720</td>
      <td>35115</td>
    </tr>
    <tr>
      <th>4</th>
      <td>7</td>
      <td>-87.517160</td>
      <td>33.157819</td>
      <td>35405</td>
    </tr>
  </tbody>
</table>
</div>



### Crosswalk


```python
# Load xWalk
crosswalkCols = ["COLLEGE_CODE", "FICE_CODE", "IPED_UNIT_ID", "ZIP_CODE"]
crosswalk = pd.read_csv(crosswalkFile, usecols=crosswalkCols, index_col=False)

# Delete the rows without any FICE or IPED codes, we can't map them anyway
crosswalk.dropna(subset=["FICE_CODE", "IPED_UNIT_ID"], how="all",inplace=True)

# Checked, all ccodes are in the rec colleges

#make the zips pretty
crosswalk["ZIP_CODE"] = crosswalk["ZIP_CODE"].apply(lambda x: str(x)[:5])

print ("Crosswalk size: {}".format(crosswalk.shape[0]))
crosswalk.head()
```

    Crosswalk size: 2954
    




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>COLLEGE_CODE</th>
      <th>ZIP_CODE</th>
      <th>FICE_CODE</th>
      <th>IPED_UNIT_ID</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1</td>
      <td>35010</td>
      <td>1007.0</td>
      <td>100760.0</td>
    </tr>
    <tr>
      <th>1</th>
      <td>2</td>
      <td>35762</td>
      <td>1002.0</td>
      <td>100654.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>3</td>
      <td>36109</td>
      <td>1003.0</td>
      <td>101189.0</td>
    </tr>
    <tr>
      <th>3</th>
      <td>4</td>
      <td>35115</td>
      <td>1004.0</td>
      <td>101709.0</td>
    </tr>
    <tr>
      <th>4</th>
      <td>7</td>
      <td>35405</td>
      <td>5691.0</td>
      <td>102067.0</td>
    </tr>
  </tbody>
</table>
</div>



**Duplicates** and mapping issues with the ACT College Code (from here on known as *ccode*).


```python
# Duplicates! Lots of them

dupIPED = pd.concat(g for _, g in crosswalk.groupby("IPED_UNIT_ID") if len(g) > 1)
dupOPEID = pd.concat(g for _, g in crosswalk.groupby("FICE_CODE") if len(g) > 1)

crosswalkCleanIPED = crosswalk.drop_duplicates(subset=["IPED_UNIT_ID"])
crosswalkCleanOPEID = crosswalk.drop_duplicates(subset=["FICE_CODE"])

print ("# of unique duplicate IPED id's: {}".format(len(set(dupIPED["IPED_UNIT_ID"]))))
print ("# of duplicate IPED id's: {}".format(dupIPED.shape[0]))
print ("# of IPED entries deleted: {}\n".format(crosswalk.shape[0] - crosswalkCleanIPED.shape[0]))

print ("# of unique duplicate OPEID id's: {}".format(len(set(dupIPED["FICE_CODE"]))))
print ("# of duplicate OPEID id's: {}".format(dupOPEID.shape[0]))
print ("# of OPEID entries deleted: {}\n".format(crosswalk.shape[0] - crosswalkCleanOPEID.shape[0]))
```

    # of unique duplicate IPED id's: 10
    # of duplicate IPED id's: 25
    # of IPED entries deleted: 161
    
    # of unique duplicate OPEID id's: 17
    # of duplicate OPEID id's: 39
    # of OPEID entries deleted: 206
    
    

---
### Blending

There's a lot of work to be done! We've loaded and filtered the data to what attributes we want. In order to make a unified college data file, I'll be shuffling the *ccodes* to the Scorecard data frame. In order to get to our ideal data set, we have to do the following:
- One. Merge inner on the Research College Recommender and the Crosswalk on *ccodes* -> only keep rows that were present for the original and records that we have data for
- Two. Merge left (keep those that don't match) on One and the filtered Scorecard data, match on *zip and IPED* -> add ccode to scorecard
- Three. Merge left on Two and One -> add the ccode via *zip and OPEID*
- Format, clean up, beg the data gods, etc.


```python
recColleges.columns, crosswalk.columns
```




    (Index(['ccode', 'x', 'y', 'zip'], dtype='object'),
     Index(['COLLEGE_CODE', 'ZIP_CODE', 'FICE_CODE', 'IPED_UNIT_ID'], dtype='object'))




```python
# make dicts to map ID to ccodes
crosswalkIPED = crosswalk.dropna(subset=["IPED_UNIT_ID"]).set_index(["IPED_UNIT_ID", "ZIP_CODE"]).to_dict("index")
crosswalkOPEID = crosswalk.dropna(subset=["FICE_CODE"]).set_index(["FICE_CODE", "ZIP_CODE"]).to_dict("index")

# create a function to return the correct ccode
def getCcode(iped, opeid, zipp):
    try:
        ccode = (crosswalkIPED[(iped, zipp)]["COLLEGE_CODE"]) or (crosswalkOPEID[(opeid, zipp)]["COLLEGE_CODE"])
        return (ccode)
    except:
        return (0)
```


```python
# filter the scorecard to only the schools which have an ID 

filterFrame = pd.merge(crosswalk.set_index("COLLEGE_CODE"), 
                 recColleges[["ccode", "x", "y"]], 
                 left_index="COLLEGE_CODE", right_on="ccode")

filterIpeds = set(filterFrame["IPED_UNIT_ID"].dropna())
filterOpeids = set(filterFrame["FICE_CODE"].dropna())
```


```python
#first merge, keep only colleges (ccodes) that are in both the Recommender and Crosswalk
first = pd.merge(crosswalk.set_index("COLLEGE_CODE"), 
                 recColleges[["ccode", "x", "y"]], 
                 left_index="COLLEGE_CODE", right_on="ccode")
print ("First merge rows: {}".format(first.shape[0]))
print("First merge (without duplicate IPED) rows: {}".format(first["IPED_UNIT_ID"].dropna().shape[0]))
first.head()
```

    First merge rows: 2943
    First merge (without duplicate IPED) rows: 2800
    




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>ZIP_CODE</th>
      <th>FICE_CODE</th>
      <th>IPED_UNIT_ID</th>
      <th>ccode</th>
      <th>x</th>
      <th>y</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>35010</td>
      <td>1007.0</td>
      <td>100760.0</td>
      <td>1</td>
      <td>-85.938360</td>
      <td>32.913360</td>
    </tr>
    <tr>
      <th>1</th>
      <td>35762</td>
      <td>1002.0</td>
      <td>100654.0</td>
      <td>2</td>
      <td>-86.569000</td>
      <td>34.792912</td>
    </tr>
    <tr>
      <th>2</th>
      <td>36109</td>
      <td>1003.0</td>
      <td>101189.0</td>
      <td>3</td>
      <td>-86.246181</td>
      <td>32.380663</td>
    </tr>
    <tr>
      <th>3</th>
      <td>35115</td>
      <td>1004.0</td>
      <td>101709.0</td>
      <td>4</td>
      <td>-86.848920</td>
      <td>33.135720</td>
    </tr>
    <tr>
      <th>4</th>
      <td>35405</td>
      <td>5691.0</td>
      <td>102067.0</td>
      <td>7</td>
      <td>-87.517160</td>
      <td>33.157819</td>
    </tr>
  </tbody>
</table>
</div>




```python
# Second merge, add IPED code to first merge but keep colleges that don't have them (left join)
second = pd.merge(first[["ZIP_CODE", "IPED_UNIT_ID", "ccode"]].set_index(["ZIP_CODE", "IPED_UNIT_ID"]),
                 scorecardCom,
                 left_index=["ZIP_CODE", "IPED_UNIT_ID"], right_on=["ZIP", "UNITID"], how="left")
print (second.shape)
second.head()
```

    (2943, 45)
    




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>ccode</th>
      <th>ACTCMMID</th>
      <th>CIP01</th>
      <th>CIP03</th>
      <th>CIP04</th>
      <th>CIP05</th>
      <th>CIP09</th>
      <th>CIP10</th>
      <th>CIP11</th>
      <th>CIP12</th>
      <th>...</th>
      <th>CONTROL</th>
      <th>HIGHDEG</th>
      <th>INSTNM</th>
      <th>PREDDEG</th>
      <th>TUITIONFEE_IN</th>
      <th>TUITIONFEE_OUT</th>
      <th>UGDS</th>
      <th>UNITID</th>
      <th>ZIP</th>
      <th>opeid6</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1341</th>
      <td>1</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>...</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>100760.0</td>
      <td>35010</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>0</th>
      <td>2</td>
      <td>17.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>...</td>
      <td>1.0</td>
      <td>4.0</td>
      <td>Alabama A &amp; M University</td>
      <td>3.0</td>
      <td>7182.0</td>
      <td>12774.0</td>
      <td>4051.0</td>
      <td>100654.0</td>
      <td>35762</td>
      <td>1002.0</td>
    </tr>
    <tr>
      <th>1341</th>
      <td>3</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>...</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>101189.0</td>
      <td>36109</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>14</th>
      <td>4</td>
      <td>23.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>...</td>
      <td>1.0</td>
      <td>4.0</td>
      <td>University of Montevallo</td>
      <td>3.0</td>
      <td>10000.0</td>
      <td>19690.0</td>
      <td>2610.0</td>
      <td>101709.0</td>
      <td>35115</td>
      <td>1004.0</td>
    </tr>
    <tr>
      <th>1341</th>
      <td>7</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>...</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>102067.0</td>
      <td>35405</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 45 columns</p>
</div>




```python
# Third merge to add OPED to the colleges
third = pd.merge(second, first[["ZIP_CODE", "FICE_CODE", "ccode"]].set_index(["ZIP_CODE", "FICE_CODE"]),
                left_on=["ZIP", "opeid6"], right_index=["ZIP_CODE", "FICE_CODE"], how="left")
print (third.shape)
third.head()
```

    (2946, 46)
    




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>ccode_x</th>
      <th>ACTCMMID</th>
      <th>CIP01</th>
      <th>CIP03</th>
      <th>CIP04</th>
      <th>CIP05</th>
      <th>CIP09</th>
      <th>CIP10</th>
      <th>CIP11</th>
      <th>CIP12</th>
      <th>...</th>
      <th>HIGHDEG</th>
      <th>INSTNM</th>
      <th>PREDDEG</th>
      <th>TUITIONFEE_IN</th>
      <th>TUITIONFEE_OUT</th>
      <th>UGDS</th>
      <th>UNITID</th>
      <th>ZIP</th>
      <th>opeid6</th>
      <th>ccode_y</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1341</th>
      <td>1</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>...</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>100760.0</td>
      <td>35010</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>0</th>
      <td>2</td>
      <td>17.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>...</td>
      <td>4.0</td>
      <td>Alabama A &amp; M University</td>
      <td>3.0</td>
      <td>7182.0</td>
      <td>12774.0</td>
      <td>4051.0</td>
      <td>100654.0</td>
      <td>35762</td>
      <td>1002.0</td>
      <td>2.0</td>
    </tr>
    <tr>
      <th>1341</th>
      <td>3</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>...</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>101189.0</td>
      <td>36109</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>14</th>
      <td>4</td>
      <td>23.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>...</td>
      <td>4.0</td>
      <td>University of Montevallo</td>
      <td>3.0</td>
      <td>10000.0</td>
      <td>19690.0</td>
      <td>2610.0</td>
      <td>101709.0</td>
      <td>35115</td>
      <td>1004.0</td>
      <td>4.0</td>
    </tr>
    <tr>
      <th>1341</th>
      <td>7</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>...</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>102067.0</td>
      <td>35405</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 46 columns</p>
</div>




```python
# Clean up the columns
third["ccode"] = third.apply(lambda x: x["ccode_x"] or x["ccode_y"], axis=1)
del third["ccode_x"]
del third["ccode_y"]
```


```python
print ("Number of unique ccodes in original research prototype: {}".format(recColleges.shape[0]))
print ("Number of valid ccodes matching Research prototype & crosswalk: {}".format(first.shape[0]))
print ("Number of unique matched codes in outbound dataset: {}".format(len(set(third["ccode"]))))
```

    Number of unique ccodes in original research prototype: 3270
    Number of valid ccodes matching Research prototype & crosswalk: 2943
    Number of unique matched codes in outbound dataset: 2943
    


```python
# Finalize 

# Drop the row which don't have any names, there's some junk left over from the left join
out = third.dropna(subset=["INSTNM"])
# Make one column for the college code
out = out.merge(recColleges[["x", "y", "ccode"]].set_index("ccode"), left_on="ccode", right_index="ccode")
```


```python
# formatting
outCols = {
    "CONTROL": "schoolType",
    "INSTNM": "schoolName",
    "PREDDEG": "schoolPredDeg",
    "HIGHDEG": "schoolHighDeg",
    "TUITIONFEE_IN": "costInSt",
    "TUITIONFEE_OUT": "costOutSt",
    "UNITID": "iped",
    "opedid6": "opeid",
    "ZIP": "zip",
    'UGDS': 'size'
    
}
out.rename(columns=outCols, inplace=True)
```


```python
list(out.columns)
```




    ['ACTCMMID',
     'CIP01',
     'CIP03',
     'CIP04',
     'CIP05',
     'CIP09',
     'CIP10',
     'CIP11',
     'CIP12',
     'CIP13',
     'CIP14',
     'CIP15',
     'CIP16',
     'CIP19',
     'CIP22',
     'CIP23',
     'CIP24',
     'CIP26',
     'CIP27',
     'CIP30',
     'CIP31',
     'CIP38',
     'CIP39',
     'CIP40',
     'CIP42',
     'CIP43',
     'CIP44',
     'CIP45',
     'CIP47',
     'CIP49',
     'CIP50',
     'CIP51',
     'CIP52',
     'CIP54',
     'schoolType',
     'schoolHighDeg',
     'schoolName',
     'schoolPredDeg',
     'costInSt',
     'costOutSt',
     'size',
     'iped',
     'zip',
     'opeid6',
     'ccode',
     'x',
     'y']




```python
# Write it out to csv
out.to_csv("../data/out/colleges.csv", encoding='utf-8', index=False)
```


```python
# write out as json for testing purposes
out.set_index("ccode", drop=False).to_json("../data/out/colleges.json", orient="index", double_precision=0)
```
