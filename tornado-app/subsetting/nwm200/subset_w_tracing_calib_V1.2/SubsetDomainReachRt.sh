#!/bin/bash

# To run: 
# SubsetDomainReachRt.sh /glade/scratch/adugger/NWM_V12/CALIBTEST_DOMAINS2/ forcOn submitOn

calibDir=$1
forcFlag=${2:-'forcOff'}
submitFlag=${3:-'submitOff'}

paramfile="${calibDir}/infoDT.csv"
forcpathfile="${calibDir}/forcpath.txt"

# Do initial setup (calculates indices, populates main CSV list)
Rscript config_SubsetDomainReachRt.R $calibDir

# Read in master forcing path if needed
if [ $forcFlag == "forcOn" ]; then
  while read line; do
    inForcPath=$line
  done < $forcpathfile
fi

# Read in job metadata csv file, looping by gauge ID
pcount=0
while read line; do
   if [ ${pcount} -eq 0 ]; then
      # Header read to get var names
      echo "Reading header..."
      IFS=',' read -r -a varnames <<< "${line}"
      varcnt=${#varnames[@]}
   else
      # Variable value reads by line
      echo "Reading line" ${pcount} with ${varcnt} params
      echo ${line}
      IFS=',' read -r -a varvals <<< "${line}"
      # Loop through all row (gauge) values and assign variable values by name
      for n in $(seq 0 $((varcnt-1))); do
         varnm=${varnames[$n]}
         varnm=`echo $varnm | sed -e 's/\"//g'`
         varval=${varvals[$n]}
         # Define variables
         eval "${varnm}=${varval}"
      done
      echo link=$link site_no=$site_no geo_w=$geo_w geo_e=$geo_e geo_s=$geo_s geo_n=$geo_n
      # Write job scripts
      jobID=${link}-$USER-`date +%Y%m%d_%H%M%S`
      echo "Writing bsub file for $link with job ID $jobID"
      echo "#!/bin/bash
#BSUB -P NRAL0017
#BSUB -n 1
#BSUB -J job_${jobID}
#BSUB -o job_${jobID}.out
#BSUB -e job_${jobID}.err
#BSUB -W 12:00
#BSUB -q premium
module load R/3.2.2
Rscript runsub_SubsetDomainReachRt.R $link $calibDir" > bsub_${jobID}.sh
       # Add optional forcing subset line
       if [ $forcFlag == "forcOn" ]; then
          echo "./SubsetForcing.sh $inForcPath ${dirname}/FORCING $geo_w $geo_e $geo_s $geo_n
exit
" >> bsub_${jobID}.sh
       else
          echo "exit
" >> bsub_${jobID}.sh
       fi
       # Submit jobs if requested
       if [ $submitFlag == "submitOn" ]; then
          bsub < bsub_${jobID}.sh
       fi
    fi
    pcount=$((pcount+1))
done < $paramfile


