import { ActionContext, ActionTree, MutationTree } from 'vuex';
import { Route } from 'vue-router';
import Vue from 'vue';
import { getContent } from '@/utils';

export interface State {
  jobs: Job[];
  pages: Page[];
  posts: Post[];
  route?: Route;
}

// Initial State
export const appState = {
  pages: [],
  posts: [],
  jobs: [],
};

export const mutations: MutationTree<State> = {
  SET_PAGES: (state, payload: object): void => {
    Vue.set(state, 'pages', payload);
  },
  SET_POSTS: (state, payload: object): void => {
    Vue.set(state, 'posts', payload);
  },
  SET_JOBS: (state, payload: object): void => {
    Vue.set(state, 'jobs', payload);
  },
};

interface Actions<S, R> extends ActionTree<S, R> {
  GET_PAGES_LIST(context: ActionContext<S, R>): Promise<void | Error>;
  GET_JOBS_LIST(context: ActionContext<S, R>): Promise<void | Error>;
  GET_POSTS_LIST(context: ActionContext<S, R>): Promise<void | Error>;
  nuxtServerInit(context: ActionContext<S, R>): void;
}

export const actions: Actions<State, State> = {
  async GET_JOBS_LIST({ commit }): Promise<void | Error> {
    // Use webpack to search the jobs directory matching .json files
    const context = await require.context('@/content/jobs/', false, /\.json$/);
    const posts = await getContent({ context, prefix: 'jobs' });
    commit('SET_JOBS', posts);
  },

  async GET_POSTS_LIST({ commit }): Promise<void | Error> {
    // Use webpack to search the blog directory matching .json files
    const context = await require.context('@/content/blog/', false, /\.json$/);
    const posts = await getContent({ context, prefix: 'blog' });
    commit('SET_POSTS', posts);
  },

  async GET_PAGES_LIST({ commit }): Promise<void | Error> {
    // Use webpack to search the blog directory matching .json files
    const context = await require.context('@/content/pages/', false, /\.json$/);
    const pages = await getContent({
      context,
      prefix: 'pages',
    });
    commit('SET_PAGES', pages);
  },

  async nuxtServerInit({ dispatch }): Promise<void> {
    await Promise.all([
      dispatch('GET_PAGES_LIST'),
      dispatch('GET_POSTS_LIST'),
      dispatch('GET_JOBS_LIST'),
    ]);
  },
};

export const state = (): State => ({
  ...appState,
});

export const strict = false;
