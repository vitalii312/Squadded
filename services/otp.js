const { API_ENDPOINT } = process.env;
const AUTH_ENDPOINT = `${API_ENDPOINT}/auth`;

export const requestOtp = (email) => {
	if (!email) {
		return;
	}
	fetch(`${AUTH_ENDPOINT}/email/otp`, {
		method: 'POST',
		body: JSON.stringify({
			email,
		}),
	});
};

export const loginWithPIN = (pin, email, merchantId) => {
	return fetch(`${AUTH_ENDPOINT}/email/signup`, {
		method: 'POST',
		body: JSON.stringify({
			pin,
			email,
			merchantId,
		}),
	})
		.then(res => res.json())
		.catch(() => ({ error: true }));
};
