import axios from 'axios';

const Api = ({ req }) => {
	if (typeof window === 'undefined') {
		return axios.create({
			baseURL:
				'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
			headers: req.headers,
		});
	} else {
		return axios.create({
			baseUrl: '/',
		});
	}
};

export default Api;
