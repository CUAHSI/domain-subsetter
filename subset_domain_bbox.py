#!/usr/bin/env python3

##############################################################################
# file name: subset_domain_bbox.py                                           #
# author: Tony Castronova, Arezoo Rafieei Nasab (arezoo@ucar.edu),           #
#     Aubrey Dugger (adugger@ucar.edu)                                       #
# organization: CUAHSI                                                       #
# description: functions for extracting WRFHyro domain input files by        #
#              bounding boxes. These functions are based off the             #
#              subset_domain.R script developed at NCAR.                     #
##############################################################################

import os
import time
import shutil
import warnings
import numpy as np
import xarray as xr
import translate
import subset

warnings.filterwarnings('ignore')

def subset_by_bbox(netcdf, bbox, outpath):
    """subsets a netcdf file using a user defined bounding box
    
    Args:
        netcdf: netcdf file path, version 4
        bbox: bounding box coordinates (minX, minY, maxX, maxY)
        outpath: path of the subset output file
    """

    minX, minY, maxX, maxY = bbox
    
    # open netcdf input path using xarray for lazy loading
    print('--> reading %s... ' % netcdf.split('/')[-1], end='', flush=True)
    ds = xr.open_dataset(netcdf)
    print('done')


##    # get lat, lon coordinates from dataset
##    lats, lons = translate.get_coords_from_dataset(ds)
#
#    # define the min and max lat/lon
#    lat_bnds = [ minY , maxY ]
#    lon_bnds = [ minX , maxX ]

    # subset the netcdf file based on the input bbox
    subset = subset_ds(ds, bbox)
  
#    subset = ds.where(
#                (ds.LATITUDE > minY) &
#                (ds.LATITUDE < maxY) &
#                (ds.LONGITUDE > minX) &
#                (ds.LONGITUDE < maxX))
#    
#    subset = subset.dropna('x', 'all')
#    subset = subset.dropna('y', 'all')


    print('--> saving to %s... ' % outpath, end='', flush=True)
    t = time.time()
    subset.to_netcdf('%s' % outpath)
    print('done (%3.2f seconds)' % (time.time() - t))

def subset_ds(ds, bbox):
    print('--> subsetting dataset... ', end='', flush=True)
    t = time.time()

    minX, minY, maxX, maxY = bbox
    subset = None 
    lat, lon = None, None
    var = ds.variables
    if 'LATITUDE' in var and 'LONGITUDE' in var:
        lat='LATITUDE'
        lon='LONGITUDE'
    elif 'XLONG_M' in var and 'XLAT_M' in var:
        lat='XLAT_M'
        lon='XLONG_M'
    elif 'lat' in var and 'lon' in var:
        lat='lat'
        lon='lon'

    if lat is not None and lon is not None:
        subset = ds.where(
                (ds[lat] > minY) &
                (ds[lat] < maxY) &
                (ds[lon] > minX) &
                (ds[lon] < maxX))
        subset = subset.dropna('x', 'all')
        subset = subset.dropna('y', 'all')
    else:
        print('ERROR: Could not find LAT and LON variables to subset')
    
    print('done (%3.2f seconds)' % (time.time() - t))
    return subset
    

if __name__ == "__main__":

    # specify bounding box in WGS84.
    # this is the coordinate system used by WRF (i.e. wrfinput.nc)
#    bbox = (-86.1740109, # LLon (xMin)
#            37.9353416,  # LLat (yMin)
#            -84.8775459, # ULon (xMax)
#            40.4628184)   # ULat (yMax)

    bbox = (-90.5734, # LLon (xMin)
            38.433,   # LLat (yMin)
            -89.911,  # ULon (xMax)
            38.828)   # ULat (yMax)

    # set buffer in number of cells
    cell_buffer = 4

    domain_base_dir = '/home/acastronova/www.nco.ncep.noaa.gov/pmb/codes/nwprod/nwm.v1.2.2/parm/domain'

    # create output dir
    print('\n--> making output directory...', end='', flush=True)
    outdir = 'subsetted_data'
    if os.path.exists(outdir):
        shutil.rmtree(outdir)
    os.mkdir(outdir)
    print('done')

#############################################
######## Subset 250m Domains ################
#############################################

    # get indices for subsetting 250m data
    print('--> Mapping coordinate bbox to indices on 250m DOMAIN')
    ds = xr.open_dataset(os.path.join(domain_base_dir, 'Fulldom_hires_netcdf_250m.nc'))
#    indices = subset.get_indices_by_bbox(ds, bbox, 'TOPOGRAPHY')
    hyd_imin, hyd_jmin, hyd_imax, hyd_jmax = subset.get_indices_by_wgs84_bbox(ds, bbox)

    # apply buffer to indices
    hyd_imin -= cell_buffer
    hyd_imax += cell_buffer
    hyd_jmin -= cell_buffer
    hyd_jmax += cell_buffer
    
    # make sure indicies are still in valid range
    # todo:

    fnames = ['Fulldom_hires_netcdf_250m.nc']

    # subset 250m grids
    for f in fnames:
        st = time.time()
        print('\n--> Processing %s' % f)
        filepath = os.path.join(domain_base_dir, f)
        ofile = os.path.join(outdir, '%s-subset.nc' % f.split('/')[-1][0:-3])
        sub = subset.subset_ds_by_index_bbox(filepath,
                                             hyd_imin,
                                             hyd_imax,
                                             hyd_jmin,
                                             hyd_jmax,
                                             ofile)
        

#############################################
######### Subset 1km Domains ################
#############################################


    # get indices for subsetting 1kmm data
    print('\n--> Mapping coordinate bbox to indices on 1km DOMAIN')
    ds = xr.open_dataset(os.path.join(domain_base_dir, 'geo_em.d01_1km.nc'))

    geo_imin, geo_jmin, geo_imax, geo_jmax = subset.get_indices_by_wgs84_bbox(ds, bbox)

    # apply buffer to indices
    cell_buffer = 1
    geo_imin -= cell_buffer
    geo_imax += cell_buffer
    geo_jmin -= cell_buffer
    geo_jmax += cell_buffer
    
    fnames = [
#              'geo_em.d01_1km.nc',
#              'wrfinput_d01_1km.nc',
#              'WRF_Hydro_NWM_geospatial_data_template_land_GIS.nc',
#              'HYDRO_TBL_2D.nc'
             ]

    # subset 1km grids
    for f in fnames:
        st = time.time()
        print('\n--> Processing %s' % f)
        filepath = os.path.join(domain_base_dir, f)
        ofile = os.path.join(outdir, '%s-subset.nc' % f.split('/')[-1][0:-3])
        sub = subset.subset_ds_by_index_bbox(filepath,
                                             geo_imin,
                                             geo_imax,
                                             geo_jmin,
                                             geo_jmax,
                                             ofile)



#############################################
############# Subset Params  ################
#############################################


    # identify catchments to keep based on 250m indices calculated above
    print('--> subsetting spatial weights...', end ='')
    f =  'spatialweights_250m_all_basins.nc'
    ds = xr.open_dataset(os.path.join(domain_base_dir, 'spatialweights_250m_all_basins.nc'))

    # get the indices corresponding with the i_index, j_index within the 250m bbox
    ivals = ds.i_index.values
    jvals = ds.j_index.values
    i_idxs = np.where( (ivals >= hyd_imin) & (ivals <= hyd_imax) )
    j_idxs = np.where( (jvals >= hyd_jmin) & (jvals <= hyd_jmax) )

    # combine these indexes since the dataset is globally indexed by 'data'
    # and remove duplicate indices if they exist
    data_idxs = np.unique(np.concatenate([i_idxs[0], j_idxs[0]]))

    # subset the original spatial weights file using these indices
    cat_sub = ds.isel(data=data_idxs)


## original method (wasn't giving correct output)
#    ixs = ds.i_index.isel(data=slice(hyd_imin, hyd_imax)).values.tolist()
#    jxs = ds.j_index.isel(data=slice(hyd_jmin, hyd_jmax)).values.tolist()
#    idxs = ixs + jxs
#    cat_sub = ds.sel(data=idxs)

    # determine which basins are fully within the cutout domain
    import pdb; pdb.set_trace()
    fullBasins = cat_sub.groupby('IDmask').sum()
    cat_sub = fullBasins.where(fullBasins.weight > 0.999)
    keepIdsPoly = cat_sub.IDmask.values
    print('done')

    ofile = os.path.join(outdir, '%s-subset.nc' % f.split('/')[-1][0:-3])
    print('--> saving to %s' % (ofile.split('/')[-1]), end='')
    cat_sub.to_netcdf(ofile)
    print('done')

    


# ----> 

    # identify reaches to keep
    print('--> identifying reaches within FullDom...', end='', flush=True)
    f = 'RouteLink_NHDPLUS.nc'
    ds = xr.open_dataset(os.path.join(domain_base_dir, f))
    
    # subset by input bounding box (WGS 1984). The format of the bbox array follows:
    #  bbox = LLon (xMin), LLat (yMin), ULon (xMax), ULat (yMax)
    dtemp = ds.where((ds.lon >= bbox[0]) &
                     (ds.lon <= bbox[2]) &
                     (ds.lat >= bbox[1]) &
                     (ds.lat <= bbox[3]),
                     drop=True)
    keepIdsLink = np.unique(dtemp.link.values)
    del dtemp

    # combine the polygon and link ids into a single array
    keepIds = np.unique(np.concatenate([keepIdsPoly, keepIdsLink]))

    # subset the reaches based on unique reach and catchment ids
    reach_sub = ds.where(ds.link.isin(keepIds), drop=True)
    print('done')

    ofile = os.path.join(outdir, '%s-subset.nc' % f.split('/')[-1][0:-3])
    print('--> saving to %s' % (ofile.split('/')[-1]), end='')
    reach_sub.to_netcdf(ofile)
    print('done')




    



#    for f in fnames:
#        st = time.time()
#        print('\n-->Processing %s' % f)
#        ds = xr.open_dataset(os.path.join(domain_base_dir, f))
#        ofile = '%s-subset.nc' % f.split('/')[-1][0:-3]
#        sub = subset.subset_ds_by_index_bbox(ds, imin, imax, jmin, jmax)
#        
##        import pdb; pdb.set_trace()        
##        print('----> Shape: (%d, %d)' % (len(sub.x), len(sub.y)))
#
#        t = time.time()
#        print('--> saving to %s... ' % f, end='', flush=True)
#        outpath = os.path.join(outdir, f)
#        sub.to_netcdf('%s' % outpath)
#        print('done (%3.2f seconds)' % (time.time() - t))
#
#        print('elapsed time %2.3f seconds\n' % (time.time() - st))

