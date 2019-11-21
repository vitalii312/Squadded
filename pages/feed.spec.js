import { Wrapper, shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Feed from './feed.vue';
import Store from '~/store';

Wrapper.prototype.ref = function (id) {
	return this.find({ ref: id });
};

describe('Message Input', () => {
	const EMPTY_FEED_TEXT = 'empty-feed-text';
	const MAIN = 'feed-layout';
	const TOP_BAR = 'top-bar';
	const PRELOADER = 'preloader';

	let localVue;
	let store;
	let wrapper;

	beforeEach(() => {
		localVue = createLocalVue();
		localVue.use(Vuex);

		store = new Vuex.Store(Store);

		wrapper = shallowMount(Feed, {
			store,
			localVue,
			mocks: {
				$t: msg => msg,
			},
		});
	});

	it('should not display content while pending auth', () => {
		const feed = wrapper.ref(MAIN);
		expect(feed.exists()).toBe(false);
	});

	it('should display content only after auth', () => {
		store.commit('SET_PENDING', false);
		let feed = wrapper.ref(MAIN);
		expect(feed.exists()).toBe(false);

		store.commit('SET_SOCKET_AUTH', true);
		store.state.feed.loading = false;
		store.state.feed.items = [{}];
		feed = wrapper.ref(MAIN);
		expect(feed.exists()).toBe(true);
		expect(wrapper.ref(TOP_BAR).exists()).toBe(true);
	});

	it('should render the correct message for empty Feed', () => {
		store.commit('SET_SOCKET_AUTH', true);
		store.state.feed.loading = false;
		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).text()).toBe('feed.isEmpty');
	});

	it('should display a preloader while loading', () => {
		store.commit('SET_SOCKET_AUTH', true);
		store.state.feed.loading = true;
		expect(wrapper.ref(PRELOADER).exists()).toBe(true);
		expect(wrapper.ref(EMPTY_FEED_TEXT).exists()).toBe(false);
	});
});
