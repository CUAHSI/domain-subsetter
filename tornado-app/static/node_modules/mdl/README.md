Moodle Assister
===============

Moodle Assister (mdl) is a convenience tool to aid moodle development. It
allows use of different versions of JavaScript tools used in the different
versions of Moodle.


What's it for?
--------------

Since Moodle 2.5, we've started to run out JavaScript code through a
variety of tools to give such joys as correctly linted, and minified
JavaScript, with reusable meta-data.

Given that these tools are used to build code which is then included in
our repositories, we need to ensure that we can have repeatable builds
across different branches. So if the build method changes between tool
version A and version B and this leads to differences in the built code, we
need to ensure that we continue building the same code for all versions of
Moodle which were previously built using tool version A.


How does that work?
-------------------

When a new version of Moodle is branched, a new version of the mdl-sub tool
should also be branched capturing the dependencies for that version of
Moodle. The name is also updated to reflect the version of Moodle it
corresponds to.
