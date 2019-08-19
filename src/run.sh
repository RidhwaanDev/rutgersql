#!/bin/bash
# shell script to help me read the terminal output in scrollback
n=1
while (( $n <= 15 ))
do
	echo "\n"
	n=$(( n+1 ))	
done
clear
node app.js
