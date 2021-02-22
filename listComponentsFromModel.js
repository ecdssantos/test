const fs = require('fs');
fs.readFile(process.argv[2], (err, data) => {
	if (err) throw err;
	const workspace = JSON.parse(data);
	
	let urlCounter = new Array();
	let urlComponents = new Array();
	let urlUndefined = new Array();
	for (let i = 0; i < workspace.model.softwareSystems.length; i++) {
		const sys = workspace.model.softwareSystems[i];
		if (sys.tags === "Element,Software System" 
			&& sys.name === "People Graph")
		{
			for (let j = 0; j < sys.containers.length; j++) {
				for (let k = 0; sys.containers[j].components && k < sys.containers[j].components.length; k++) {
					console.log(`(${sys.containers[j].name}) ${sys.containers[j].components[k].name} -> ${sys.containers[j].components[k].url}`);
					if (sys.containers[j].components[k].url) {
						urlCounter[sys.containers[j].components[k].url] = (urlCounter[sys.containers[j].components[k].url] || 0) +1;
						if (!urlComponents[sys.containers[j].components[k].url]) {
							urlComponents[sys.containers[j].components[k].url] = new Array();
						}
						urlComponents[sys.containers[j].components[k].url].push(`${sys.containers[j].name}/${sys.containers[j].components[k].name}`);
					}
					else {
						urlUndefined.push(`${sys.containers[j].name}/${sys.containers[j].components[k].name}`);
					}
				}
			}
		}
	}
	console.log('');
	console.log('URLs with more than one component pointing to it');
	for (let url in urlCounter) {
		if (urlCounter[url] > 1) {
			console.log(`[${urlCounter[url]}] ${url}`);
			for (let componentIx in urlComponents[url]) {
				console.log(`	- ${urlComponents[url][componentIx]}`);
			}
		}
	}
	console.log('');
	console.log(`Components without URL [${urlUndefined.length}]`);
	for (let i = 0; i < urlUndefined.length; i++) {
		console.log(`	- ${urlUndefined[i]}`);
	}
});

//Just a comment.