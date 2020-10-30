import activity from './activity';
import feed from './feed';
import notification from './notification';
import post from './post';
import squad from './squad';
import user from './user';
import pairedItem from './paired-item';
import explore from './explore';
import home from './home';
import onboarding from './onboarding';
import { hexToRgb } from '~/utils/hex-to-rgb';

const DEFAULT_COLOR = '#000';
const widgetLocation = location.search || !document.referrer ? new URL(location.href)
	: new URL(document.referrer);

if (!Object.fromEntries) {
	Object.fromEntries = arr => Object.assign({}, ...Array.from(arr, ([k, v]) => ({ [k]: v })));
}

const {
	merchantId: id,
	siteUrl,
	siteTitle,
	squadSLogin = true,
	brandColor = DEFAULT_COLOR,
	backgroundColor,
	backgroundActiveColor,
	inactiveColor,
	activeColor,
	isMono = false,
	native = false,
	hideFct = '',
	experimental = false,
} = Object.fromEntries(widgetLocation.searchParams.entries());

if (brandColor !== DEFAULT_COLOR) {
	document.documentElement.style.setProperty('--brand-color', brandColor);
}

if (backgroundColor) {
	document.documentElement.style.setProperty('--bg-color', backgroundColor);
}

if (backgroundActiveColor) {
	document.documentElement.style.setProperty('--bg-active-color', backgroundActiveColor);
}

if (inactiveColor) {
	document.documentElement.style.setProperty('--inactive-color', inactiveColor);
}

if (activeColor) {
	document.documentElement.style.setProperty('--active-color', activeColor);
}
const rgb = hexToRgb(brandColor);
document.documentElement.style.setProperty(
	'--brand-rgb-color',
	`${rgb.r}, ${rgb.g}, ${rgb.b}`,
);

export const state = () => ({
	locales: ['en', 'fr'],
	locale: 'en',
	socket: {
		isConnected: false,
		isAuth: false,
		isPendingAuth: true,
		reconnectError: false,
		$ws: {
			sendObj: () => {},
		},
		_ws: null,
	},
	merchant: {
		id,
		siteUrl,
		siteTitle,
		squadSLogin,
		brandColor,
		backgroundColor,
		inactiveColor,
		activeColor,
		isMono,
		native,
		hideFeatures: hideFct.toLowerCase().split(';'),
		experimental,
	},
	monoMerchants: [],
});

export const mutations = {
	SET_LANG (state, locale) {
		if (state.locales.includes(locale)) {
			state.locale = locale;
		}
	},
	SOCKET_ONOPEN (state, event) {
		state.socket.isConnected = true;
		state.socket._ws = event.currentTarget;
	},
	jSocket (state, $ws) {
		state.socket.$ws = $ws;
	},
	SOCKET_ONCLOSE (state, event) {
		state.socket.isConnected = false;
	},
	SOCKET_ONERROR (state, event) {
	},
	SOCKET_ONMESSAGE (state, message) {
	},
	SOCKET_RECONNECT (state, event) {
	},
	SOCKET_RECONNECT_ERROR (state, event) {
	},
	SET_MERCHANT_PARAMS (state, msg) {
		const {
			merchantId,
			brandColor = state.merchant.brandColor,
			siteUrl,
			siteTitle,
			squadSLogin,
			native = false,
			hideFct,
			experimental,
		} = msg;
		state.merchant.id = merchantId;
		state.merchant.siteUrl = siteUrl;
		state.merchant.siteTitle = siteTitle;
		state.merchant.squadSLogin = squadSLogin;
		state.merchant.brandColor = brandColor;
		state.merchant.native = native === 'true' || native === true;
		state.merchant.experimental = !!experimental;

		if (hideFct && hideFct.length) {
			state.merchant.hideFeatures = hideFct.toLowerCase().split(';');
		}

		if (brandColor !== DEFAULT_COLOR) {
			document.documentElement.style.setProperty('--brand-color', brandColor);
		}
		const rgb = hexToRgb(brandColor);
		document.documentElement.style.setProperty(
			'--brand-rgb-color',
			`${rgb.r}, ${rgb.g}, ${rgb.b}`,
		);
	},
	SET_SOCKET_AUTH (state, flag) {
		state.socket.isAuth = flag;
	},
	SET_PENDING (state, flag) {
		state.socket.isPendingAuth = flag;
	},
};

export const modules = {
	activity,
	feed,
	notification,
	post,
	squad,
	user,
	pairedItem,
	explore,
	home,
	onboarding,
};

export default {
	state,
	mutations,
	modules,
	strict: false,
};
