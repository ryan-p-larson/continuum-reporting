
College Recommender Formatting
===

From the Research department's concept \#3 and the act-college-readiness-zone Git repo.


```python
# Libraries
import pandas as pd
import networkx as nx
import numpy as np
import simplejson as json
```


```python
# Global data files

recCollegesFile = "../data/out/colleges.csv"
recLookupFile = "../data/in/research/recommendor-lookup.json"
recLookupTwoFile = "../data/in/research/recommendor-lookup-2.json"
recZipsFile = "../data/in/research/recommendor-zips.json"
```

### Merged Scorecard

Read in the college data from the formatting done before. We're going to be using the *ACT ccodes* as a set to filter the other Research Prototype files. First, pop it open and look at the columns.


```python
recColleges = pd.read_csv(recCollegesFile)
recColleges.head()
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
      <th>schoolPredDeg</th>
      <th>costInSt</th>
      <th>costOutSt</th>
      <th>size</th>
      <th>iped</th>
      <th>zip</th>
      <th>opeid6</th>
      <th>ccode</th>
      <th>x</th>
      <th>y</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>17.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>...</td>
      <td>3.0</td>
      <td>7182.0</td>
      <td>12774.0</td>
      <td>4051.0</td>
      <td>100654.0</td>
      <td>35762</td>
      <td>1002.0</td>
      <td>2</td>
      <td>-86.569000</td>
      <td>34.792912</td>
    </tr>
    <tr>
      <th>1</th>
      <td>23.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>...</td>
      <td>3.0</td>
      <td>10000.0</td>
      <td>19690.0</td>
      <td>2610.0</td>
      <td>101709.0</td>
      <td>35115</td>
      <td>1004.0</td>
      <td>4</td>
      <td>-86.848920</td>
      <td>33.135720</td>
    </tr>
    <tr>
      <th>2</th>
      <td>27.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>...</td>
      <td>3.0</td>
      <td>9852.0</td>
      <td>26364.0</td>
      <td>19761.0</td>
      <td>100858.0</td>
      <td>36849</td>
      <td>1009.0</td>
      <td>11</td>
      <td>-85.508496</td>
      <td>32.602139</td>
    </tr>
    <tr>
      <th>3</th>
      <td>26.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>...</td>
      <td>3.0</td>
      <td>30690.0</td>
      <td>30690.0</td>
      <td>1181.0</td>
      <td>100937.0</td>
      <td>35254</td>
      <td>1012.0</td>
      <td>12</td>
      <td>-86.853654</td>
      <td>33.513945</td>
    </tr>
    <tr>
      <th>4</th>
      <td>22.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>1.0</td>
      <td>...</td>
      <td>3.0</td>
      <td>7078.0</td>
      <td>12670.0</td>
      <td>5536.0</td>
      <td>101879.0</td>
      <td>35632</td>
      <td>1016.0</td>
      <td>14</td>
      <td>-87.606651</td>
      <td>34.841710</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 47 columns</p>
</div>




```python
# Create a set of ccodes so that we may test inclusion

ccodes = set(recColleges["ccode"])
```


```python
#list(recColleges.columns)
```


```python
# Read in the orginal files that we're transforming

recLike = pd.read_json(recLookupFile)
recRec = pd.read_json(recLookupTwoFile)
recZips = pd.read_json(recZipsFile)
```

### Like Colleges

1. Filter the dataframe on the ccode column to outright get rid college entries
2. Create a data structure to take the *col* and *enr_col* [1-10] and remove the ccodes, while shuffling the appropriate colleges upward enqueue
3. Format


```python
recLike.head(2)
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>actcat</th>
      <th>ccode</th>
      <th>col1</th>
      <th>col10</th>
      <th>col2</th>
      <th>col3</th>
      <th>col4</th>
      <th>col5</th>
      <th>col6</th>
      <th>col7</th>
      <th>...</th>
      <th>enr_col10</th>
      <th>enr_col2</th>
      <th>enr_col3</th>
      <th>enr_col4</th>
      <th>enr_col5</th>
      <th>enr_col6</th>
      <th>enr_col7</th>
      <th>enr_col8</th>
      <th>enr_col9</th>
      <th>stcat</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>01-15</td>
      <td>1</td>
      <td>40</td>
      <td>56</td>
      <td>20</td>
      <td>11</td>
      <td>48</td>
      <td>57</td>
      <td>6356</td>
      <td>52</td>
      <td>...</td>
      <td>0.0</td>
      <td>0.5731</td>
      <td>0.0000</td>
      <td>0.5731</td>
      <td>0.0000</td>
      <td>0.000</td>
      <td>0.0000</td>
      <td>0.8596</td>
      <td>0.0</td>
      <td>Alabama</td>
    </tr>
    <tr>
      <th>1</th>
      <td>01-15</td>
      <td>2</td>
      <td>8</td>
      <td>11</td>
      <td>50</td>
      <td>56</td>
      <td>28</td>
      <td>20</td>
      <td>52</td>
      <td>59</td>
      <td>...</td>
      <td>0.0</td>
      <td>0.1880</td>
      <td>0.0376</td>
      <td>3.8722</td>
      <td>0.9023</td>
      <td>0.188</td>
      <td>0.8647</td>
      <td>0.5639</td>
      <td>0.0</td>
      <td>Alabama</td>
    </tr>
  </tbody>
</table>
<p>2 rows × 24 columns</p>
</div>




```python
print ("Original Research file, # rows: {}".format(recLike.shape[0]))
recLikeClean = recLike[recLike.apply(lambda x: x['ccode'] in ccodes, axis=1)]
print ("Cleaned filled rows: {}".format(recLikeClean.shape[0]))
print ("# rows dropped in filtering: {}".format((recLike.shape[0] - recLikeClean.shape[0])))
```

    Original Research file, # rows: 36044
    Cleaned filled rows: 23214
    # rows dropped in filtering: 12830
    


```python
# Formatting?
# write out
```

### Recommended Colleges

Do the same for the recommended colleges. 


```python
recRec.iloc[110:113]
```




<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>actcat</th>
      <th>ccode</th>
      <th>college_name</th>
      <th>state</th>
      <th>stcat</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>110</th>
      <td>16-19</td>
      <td>45</td>
      <td>ENTERPRISE STATE COMMUNITY COLLEGE</td>
      <td>ALABAMA</td>
      <td>ALABAMA</td>
    </tr>
    <tr>
      <th>111</th>
      <td>16-19</td>
      <td>35</td>
      <td>FAULKNER STATE COMMUNITY COLLEGE</td>
      <td>ALABAMA</td>
      <td>ALABAMA</td>
    </tr>
    <tr>
      <th>112</th>
      <td>16-19</td>
      <td>3</td>
      <td>FAULKNER UNIVERSITY</td>
      <td>ALABAMA</td>
      <td>ALABAMA</td>
    </tr>
  </tbody>
</table>
</div>




```python
print ("Original Research file, # rows: {}".format(recRec.shape[0]))
recRecClean = recRec[recRec.apply(lambda x: x['ccode'] in ccodes, axis=1)]
print ("Cleaned filled rows: {}".format(recRecClean.shape[0]))
print ("# rows dropped in filtering: {}".format((recRec.shape[0] - recRecClean.shape[0])))
```

    Original Research file, # rows: 36044
    Cleaned filled rows: 23214
    # rows dropped in filtering: 12830
    


```python
recRecClean.to_csv("../data/out/rec-recommended.csv", index=False)
```
