const BEARER_TOKEN = 'Bearer a788e867c3cb3bda083168108a85e59142eb07b4d333e214c7bd89515577694b';

export default function(opts = {}){
	return new Promise((resolve, reject) => {
		const req = new XMLHttpRequest();
		
		req.open(opts.method || 'GET', opts.url, true);

		req.setRequestHeader('Authorization', BEARER_TOKEN);

		req.addEventListener('error', handleError)
		req.addEventListener('load', handleRequest)

		function handleError(err) {
			console.log(`Error performing '${opts.method}' on ${opts.url}`, err);
			reject(err);
		}
		function handleRequest(){
			if (req.readyState === XMLHttpRequest.DONE){
				if (req.status === 200 || req.status === 204){
					if (req.getResponseHeader('content-type') === 'application/json'){
						const json = JSON.parse(req.response);
						resolve(json);
					} else {
						resolve(req.response)
					}
				} else {
					console.log(`Error performing '${opts.method}' on ${opts.url}. Received ${req.status}`, req.responseText);
					reject(req.responseText)
				}
			}
		}

		req.send();
	})
}
