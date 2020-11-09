# Read the Routlink from the cut out to get the comIDs which we intend to keep from the "CHRTOUT" files

keepIds <- rwrfhydro::ncdump("/glade/scratch/arezoo/for/for_Mehdi/LAKE/LAKEPARM.nc", "lake_id", quiet = TRUE)

# read an output file 

outFile <- "/glade/scratch/arezoo/for/for_Mehdi/LAKE/200701010100.LAKEOUT_DOMAIN1.comp"
subOutFile <- "/glade/scratch/arezoo/for/for_Mehdi/LAKE/test.nc"

############## These are functions to be called #####################
UpdateChrtoutFile <- function(chrtoutFile, subChrtout, subDim=TRUE) {
  if (subDim) {
    cmdtxt <- paste0("ncks -O -d feature_id,1,", nrow(subChrtout), " ", chrtoutFile, " ", chrtoutFile)
    print(cmdtxt)
    system(cmdtxt)
  }
  
  ncid <- ncdf4::nc_open(chrtoutFile, write=TRUE)
  for (i in names(ncid$var)) {
    print(i)
    scaleFact <- ncid$var[[i]]$scaleFact
    if (is.null(scaleFact)) scaleFact <- 1
    if (i %in% names(subChrtout)) ncdf4::ncvar_put(ncid, i, subChrtout[,i] / scaleFact)
  }
  ncdf4::nc_close(ncid)
  return()
  
}


UpdateLakeoutFile <- function(lakeFile, lakeDf, subDim=TRUE) {
  if (subDim) {
    cmdtxt <- paste0("ncks -O -d feature_id,1,", nrow(lakeDf), " ", lakeFile, " ", lakeFile)

    print(cmdtxt)
    system(cmdtxt)
  }

  ncid <- nc_open(lakeFile, write=TRUE, suppress_dimvals=FALSE)
  for (i in c("feature_id", names(ncid$var))) {
    print(i)
    scaleFact <- ncid$var[[i]]$scaleFact
    if (is.null(scaleFact)) scaleFact <- 1
    if (i %in% names(lakeDf)) ncdf4::ncvar_put(ncid, i, lakeDf[,i] / scaleFact)

  }
  nc_close(ncid)
  return()

}

ReadLakeoutFile <- function(lakeoutFile) {
  lakes <- rwrfhydro::GetNcdfFile(lakeoutFile, variables=c("time", "reference_time"), exclude=TRUE, quiet=TRUE)
  lakes
}

# Read the full Lakeout file
fullLakeout <- as.data.frame(ReadLakeoutFile(outFile))

# Subset the full Chrtout 
subLakeout <- subset(fullLakeout, fullLakeout$feature_id %in% keepIds)

# Copy the full Chrtout file
file.copy(outFile, subOutFile, overwrite=T)

# update the file to have only the ComIds in the "KeepIds"
UpdateLakeoutFile(subOutFile, subLakeout, subDim=TRUE)


