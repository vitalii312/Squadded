export const isHome = routeName => (routeName === 'index');

export const isOnboarding = routeName => (routeName === 'select-username' || routeName === 'invite-friends');

export const isPublic = routeName => isHome(routeName) || ['community', 'onboarding', 'user-id', 'error', 'post-id', 'signin'].includes(routeName);

export const shortNumber = (number, locale = 'en') => new Intl.NumberFormat(locale, { notation: 'compact', compactDisplay: 'short' }).format(number);

export const onStoreMutation = (store, type, value, key) => new Promise((resolve) => {
	const unsubscribe = store.subscribe((mutation) => {
		if (mutation.type === type) {
			if (value !== undefined && value !== (key ? mutation.payload[key] : mutation.payload)) {
				return;
			}
			unsubscribe();
			resolve(mutation.payload);
		}
	});
});

export const onAuth = (store) => {
	return store.state.socket.isAuth ? Promise.resolve(true) : onStoreMutation(store, 'SET_SOCKET_AUTH', true);
};

export async function prefetch({ mutation, store, type, value, key, ...props }) {
	await onAuth(store);
	store.state.socket.$ws.sendObj({ type, ...props });
	return mutation ? onStoreMutation(store, mutation, value, key) : Promise.resolve();
}

export function flushPromises() {
	return new Promise(resolve => setImmediate(resolve));
}

export const price = (currency, cents, locale) => cents ? `${currency}${(cents / 100).toLocaleString(locale)}` : '';

export default {
	prefetch,
	flushPromises,
};
