import axios from 'axios';

const Api = ({ req }) => {
	if (typeof window === 'undefined') {
		return axios.create({
			baseURL:
				'http://www.ticketing-nobuy-dev.xyz/',
			headers: req.headers,
		});
	} else {
		return axios.create({
			baseUrl: '/',
		});
	}
};

export default Api;
