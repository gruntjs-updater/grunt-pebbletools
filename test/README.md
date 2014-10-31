## note to self

Tests read the fixture pebble bundle files as the "truth".  These files need to
be set there (after bundle, chicken/egg thing) if you want to change the tests.
Typically, after changes, you would put the app structure in the tmp/ directory
and bundle.  The output file would be your fixture to test against.
