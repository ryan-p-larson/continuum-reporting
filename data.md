
Continuum Reporting Data
===

**Ryan Larson**


This notebook will expand on the sources and topics covered in the Executive report. It will include code snippets and some scripting (to download and organize the data). If you are not familiar with Python or `.sh` files; good! The notebook was created to string together some cohesion to back end of the project.

When you see the following, don't panic! The read the comments where available to get an idea of the logic.


```python
# Libraries
import numpy as np
import pandas as pd
```

The Data Notebook will serve as a compliment to the report for anyone who wants to get deeper into the data.This notebook will go over the data sources, relevant variables, and value for ACT. The notebook is meant to increase reproducibility and decrease confusion over data. The datasets in question are...

**ACT**
- Interest Inventory
- Majors (& crosswalk)
- Colleges (& crosswalk)

**External**
- College Scorecard
- Occupational Network
- IPEDS Majors

A huge issue for Continuum Reporting was joining ACT student data with information that would be useful. To clarify, 'useful' is defined by the Buckingham Framework. Buckingham identifies five requirements for data to enable insight.

|Requirement|Addressed|
|---|---|
|Believeable|Use real information, from credible sources (gov).|
|Consumable|Visualization is the medium used. Viz scales well on micro level because it can convey more/different information than traditional text. |
|Personally Relevant|Programmatically generating visualizations. On a macro level ACT can program a custom visualization with a tailored message, and deploy it to millions of students. Code enables scale.|
|Novel|*Hardest to pin down*; prototype's purpose. Prudent defaults and 'baked in' functionality point out user's strengths and largest discrepancies.|
|Actionable|Design of the prototype created to move student towards a decision.|


## Majors

Starting with majors is appropriate because in a perfect world, students would choose ambitions based on best fit. To that end, the Continuum Reporting analysis started with majors and their interests. This area seems to be a strong suite for ACT, with rich data internally (interest correlations) and externally (in depth connections between majors and jobs, colleges).

The **Major Fit** dataset has, by major group, interest attributes and average ACT scores. This enables students to put their *interests first*, instead of the other way around.


```python
majorFit = pd.read_json('data/out/majorFit.json', orient="index")
majorFit.index.name = "CIP"
majorFit.reset_index(inplace=True)

majorFit[['label', 'actComposite', 'arts', 'busAdminSales', 'busOper', 'sciTech', 'socServ', 'technical']].head()
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>label</th>
      <th>actComposite</th>
      <th>arts</th>
      <th>busAdminSales</th>
      <th>busOper</th>
      <th>sciTech</th>
      <th>socServ</th>
      <th>technical</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Agriculture, Agriculture Operations, and Relat...</td>
      <td>22.3732</td>
      <td>48.0</td>
      <td>51.1</td>
      <td>50.8</td>
      <td>54.1</td>
      <td>50.0</td>
      <td>53.5</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Communications Technologies/Technicians and Su...</td>
      <td>20.5592</td>
      <td>56.7</td>
      <td>49.1</td>
      <td>50.3</td>
      <td>52.4</td>
      <td>49.5</td>
      <td>54.0</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Computer and Information Sciences and Support ...</td>
      <td>23.3316</td>
      <td>51.2</td>
      <td>48.6</td>
      <td>51.7</td>
      <td>53.7</td>
      <td>46.5</td>
      <td>53.1</td>
    </tr>
    <tr>
      <th>3</th>
      <td>Personal and Culinary Services</td>
      <td>17.9907</td>
      <td>50.5</td>
      <td>50.1</td>
      <td>51.7</td>
      <td>53.8</td>
      <td>48.8</td>
      <td>54.4</td>
    </tr>
    <tr>
      <th>4</th>
      <td>Education</td>
      <td>21.2962</td>
      <td>51.2</td>
      <td>50.8</td>
      <td>49.5</td>
      <td>50.2</td>
      <td>53.1</td>
      <td>49.7</td>
    </tr>
  </tbody>
</table>
</div>



## Colleges

One example of this is The ACT *ccode*, which is a unique key identifying colleges. Identifying every college is the first step towards linking students to their best fit. While the Office of Postsecondary Education (OPED) and The Intergrated Postsecondary Education Data System (IPEDS) each have ID's for colleges, ACT uses it's *ccode* because each of the OPED and IPEDS ID's have duplicates. Or, using either the OPED or IPEDS data is not enough to uniquely identify every college.


## Crosswalk

After IDing each college, we connect the internal *ccode* to external data via their OPED and IPEDS ID.


```python
# Load xWalk
crosswalkCols = ["COLLEGE_CODE", "FICE_CODE", "IPED_UNIT_ID", "ZIP_CODE"]
crosswalk = pd.read_csv("data/in/crosswalks/colleges-xwalk.csv", usecols=crosswalkCols, index_col=False)

# Delete the rows without any FICE or IPED codes, we can't map them anyway
crosswalk.dropna(subset=["FICE_CODE", "IPED_UNIT_ID"], how="all",inplace=True)
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



## Scorecard

[**College Scorecard**](https://collegescorecard.ed.gov/data/), by the [U.S. Department of Education](https://www.ed.gov/). A dataset about all Title IX funded schools in the United States. The set contains information about majors the school provides, school size, school type (private/public), financial aid information, web URL’s, and much more. For the Recommender tool, the data set was filtered just to the types of degrees available, much more remains to be done.


```python
%%bash

# Grab and prepare the College Scorecard data from Data.gov
./src/scorecard.sh
```


```python
colleges = pd.read_json('data/out/colleges.json', orient="index")
```

The Scorecard has *a lot* of information about colleges, almost too much. We'll be narrowing down the relevant columns to make the information load managable. But it's important to note that there are more variables that are relevant based on student's attributes (e.g. % first generation students at an college is included, but only if the student is first generational themselves).


```python
# Creat a list of school's variables without majors
interestVars = [x for x in list(colleges.columns) if x[:3] != "CIP"]
colleges[interestVars].tail()
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>ACTCMMID</th>
      <th>ccode</th>
      <th>costInSt</th>
      <th>costOutSt</th>
      <th>iped</th>
      <th>opeid6</th>
      <th>schoolHighDeg</th>
      <th>schoolName</th>
      <th>schoolPredDeg</th>
      <th>schoolType</th>
      <th>size</th>
      <th>x</th>
      <th>y</th>
      <th>zip</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>958</th>
      <td>22</td>
      <td>958</td>
      <td>18506</td>
      <td>18506</td>
      <td>143288</td>
      <td>1639</td>
      <td>3</td>
      <td>Blackburn College</td>
      <td>3</td>
      <td>2</td>
      <td>539</td>
      <td>-90</td>
      <td>39</td>
      <td>62626</td>
    </tr>
    <tr>
      <th>96</th>
      <td>24</td>
      <td>96</td>
      <td>10391</td>
      <td>27383</td>
      <td>104179</td>
      <td>1083</td>
      <td>4</td>
      <td>University of Arizona</td>
      <td>3</td>
      <td>1</td>
      <td>31399</td>
      <td>-111</td>
      <td>32</td>
      <td>85721</td>
    </tr>
    <tr>
      <th>960</th>
      <td>26</td>
      <td>960</td>
      <td>29664</td>
      <td>29664</td>
      <td>143358</td>
      <td>1641</td>
      <td>4</td>
      <td>Bradley University</td>
      <td>3</td>
      <td>2</td>
      <td>4823</td>
      <td>-90</td>
      <td>41</td>
      <td>61625</td>
    </tr>
    <tr>
      <th>992</th>
      <td>19</td>
      <td>992</td>
      <td>9032</td>
      <td>15424</td>
      <td>144005</td>
      <td>1694</td>
      <td>4</td>
      <td>Chicago State University</td>
      <td>3</td>
      <td>1</td>
      <td>4321</td>
      <td>-88</td>
      <td>42</td>
      <td>60628</td>
    </tr>
    <tr>
      <th>993</th>
      <td>19</td>
      <td>993</td>
      <td>8460</td>
      <td>15348</td>
      <td>147776</td>
      <td>1693</td>
      <td>4</td>
      <td>Northeastern Illinois University</td>
      <td>3</td>
      <td>1</td>
      <td>8827</td>
      <td>-88</td>
      <td>42</td>
      <td>60625</td>
    </tr>
  </tbody>
</table>
</div>



## Students

The ACT Score Report also collects an obscene amount of information on students! We filtered out a lot of variables, pretty much any that weren't easily connected to Scorecard informamtion. For instance `school type` was chosen because the relative few encodings, present in both datasets, and directly relevant to student interests.


```python
students = pd.read_csv('data/out/students.csv')
students.columns
```




    Index([u'stuStA', u'schoolType', u'rankLocation', u'acadDisc', u'majSureness',
           u'schoolSt5', u'stuStN', u'schoolSt3', u'actComposite', u'arts',
           u'busOper', u'majSel', u'schoolHighDeg', u'socServ', u'rankCoed',
           u'technical', u'schoolSize', u'jobTwo', u'gpa', u'rankOther',
           u'busAdminSales', u'schoolSt1', u'sciTech', u'jobOne', u'rankCost',
           u'schoolSt4', u'socAct', u'schoolCoed', u'schoolCost', u'jobSureness',
           u'schoolSt2', u'stuZip', u'schoolDistance', u'rankType', u'rankStudy',
           u'rankSize'],
          dtype='object')



The student variables group nicely for us. Interests...


```python
students[['arts', 'busAdminSales', 'busOper', 'sciTech', 'socServ', 'technical']].tail()
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>arts</th>
      <th>busAdminSales</th>
      <th>busOper</th>
      <th>sciTech</th>
      <th>socServ</th>
      <th>technical</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>3162</th>
      <td>77</td>
      <td>9</td>
      <td>51</td>
      <td>33</td>
      <td>23</td>
      <td>70</td>
    </tr>
    <tr>
      <th>3163</th>
      <td>40</td>
      <td>65</td>
      <td>65</td>
      <td>91</td>
      <td>89</td>
      <td>75</td>
    </tr>
    <tr>
      <th>3164</th>
      <td>2</td>
      <td>46</td>
      <td>97</td>
      <td>33</td>
      <td>7</td>
      <td>70</td>
    </tr>
    <tr>
      <th>3165</th>
      <td>11</td>
      <td>75</td>
      <td>41</td>
      <td>88</td>
      <td>53</td>
      <td>18</td>
    </tr>
    <tr>
      <th>3166</th>
      <td>67</td>
      <td>53</td>
      <td>60</td>
      <td>88</td>
      <td>94</td>
      <td>43</td>
    </tr>
  </tbody>
</table>
</div>



Preferences, attributes, etc...

## All Together

The useful part! Everything has been prep work before this. Using the `CIP codes` from the Major Fit set we can now have a centralized database with connections between
- majors -> interest fit
- majors -> colleges
- student preferences -> college attributes
