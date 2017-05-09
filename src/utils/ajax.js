const BEARER_TOKEN = 'Bearer ad262d8cc988f2455dd58079d93ca3514fb55844452940780019a5c22c3ff620';

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
