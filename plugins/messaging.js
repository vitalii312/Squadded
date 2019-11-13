import { connect } from './init/ws';
import { FeedStore, FeedActions } from '~/store/feed';
import { UserStore, UserMutations } from '~/store/user';
import { SquadStore, SquadMutations } from '~/store/squad';

const actions = {
	singleItemPost: (store, msg) => store.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg),
	pollPost: (store, msg) => store.dispatch(`${FeedStore}/${FeedActions.saveItem}`, msg),
	injectMerchantId: (store, msg) => {
		const { merchantId } = msg;

		store.commit('SET_MERCHANT_ID', merchantId);
	},
	loggedIn: (store, msg) => {
		store.commit(`${UserStore}/${UserMutations.setToken}`, msg.userToken);
		connect(store);
	},
	injectSquadParams: (store, msg) => {
		const { squad } = msg;

		store.commit(`${SquadStore}/${SquadMutations.setSquadParams}`, squad);
	},
	widgetState: (store, msg) => {
		const { open } = msg;

		store.commit(`${SquadStore}/${SquadMutations.setWidgetState}`, open);
	},
};

export const dispatch = (store, msg) => {
	if (actions[msg.type]) {
		actions[msg.type](store, msg);
	} else {
		// TODO: gracefull report
		// console.warn('Unknown message type', msg);
	}
};

export default function (ctx) {
	function parseMessage (event) {
		let msg;
		try {
			msg = JSON.parse(event.data);
		} catch (error) {
			// TODO: gracefull report
			return;
		}

		const { store } = ctx;
		dispatch(store, msg);
	}

	window.addEventListener('message', parseMessage);
	window.parent.postMessage('SquadWidgetIsReady', '*');
};
