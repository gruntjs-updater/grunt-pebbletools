

pebble.Pebble.setDataSourceFactory(new PebbleDataSourceImpl_Json());

var deployment;

function getDeployment(cb) {
	
	if (!deployment) {

				deployment = new pebble.shared.Deployment(JSON.stringify({{testAppControl}}));

				deployment.addCodeToEnv_server();
				deployment.addCodeToEnv_client();

				cb(deployment);

	} else {
		cb(deployment);
	}
}

