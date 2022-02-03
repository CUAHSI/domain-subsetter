# Read the Routlink from the cut out to get the comIDs which we intend to keep from the "CHRTOUT" files

keepIds <- rwrfhydro::ncdump("/glade/scratch/arezoo/Francesca/Russian/RouteLink.nc", "link", quiet = TRUE)

# read an output file 

outFile <- "/glade/p/nwc/arezoo/NWM_realtime_pulls/v1.1/nwm.20170630/analysis_assim/nwm.t00z.analysis_assim.channel_rt.tm00.conus.nc"
subOutFile <- "~/test.nc"

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

ReadChrtoutFile <- function(chrtoutFile) {
  rtLinks <- rwrfhydro::GetNcdfFile(chrtoutFile, variables=c("time"), exclude=TRUE, quiet=TRUE)
  rtLinks
}

# Read the full Chrtout file
fullChrtout <- as.data.frame(ReadChrtoutFile(outFile))

# Subset the full Chrtout 
subChrtout <- subset(fullChrtout, fullChrtout$feature_id %in% keepIds)

# Copy the full Chrtout file
file.copy(outFile, subOutFile)

# update the file to have only the ComIds in the "KeepIds"
UpdateChrtoutFile(subOutFile, subChrtout, subDim=TRUE)


