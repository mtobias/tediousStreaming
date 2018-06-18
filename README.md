## Process large mssql table with node.js

This repository shows how to pipe data from mssql table.

There are 2 implementations:

* [tedious](https://github.com/tediousjs/tedious) [stream](./tedious/index.js)
* [node-mssql](https://github.com/tediousjs/node-mssql) [stream](./mssql/index.js)

_node-mssql_ use _tedious_ under the hood.

Script output:

```
The script uses approximately 23.65 MB and proceed 1900 rows
The script uses approximately 29.88 MB and proceed 1910 rows
The script uses approximately 29.88 MB and proceed 1920 rows
The script uses approximately 29.88 MB and proceed 1930 rows
The script uses approximately 29.89 MB and proceed 1940 rows
The script uses approximately 29.89 MB and proceed 1950 rows
The script uses approximately 29.89 MB and proceed 1960 rows
The script uses approximately 29.89 MB and proceed 1970 rows
The script uses approximately 29.89 MB and proceed 1980 rows
The script uses approximately 29.89 MB and proceed 1990 rows
The script uses approximately 29.9 MB and proceed 2000 rows
The script uses approximately 13.32 MB and proceed 2010 rows
The script uses approximately 13.32 MB and proceed 2020 rows
The script uses approximately 13.32 MB and proceed 2030 rows
The script uses approximately 13.32 MB and proceed 2040 rows
The script uses approximately 13.33 MB and proceed 2050 rows
The script uses approximately 13.33 MB and proceed 2060 rows
The script uses approximately 13.33 MB and proceed 2070 rows
The script uses approximately 13.33 MB and proceed 2080 rows
The script uses approximately 13.33 MB and proceed 2090 rows
```

When use _**node-mssql**_ implementations make sure [this commit](https://github.com/danbeck/node-mssql/commit/c6894ee97c452a2b69fe0610a953d210884eb6db#diff-740c6ca62b823be279cef39ece34cf7e) is in the source.