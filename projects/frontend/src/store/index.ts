// stores/counter.js
import { defineStore } from 'pinia';

export const useStore = defineStore('index', {
  state: () => {
    return {
      rootUrl: '',
      markerRootUrl: ''
    };
  },
  getters: {
    hashRootUrl: (state) => `${state.rootUrl}#/`
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    setRootUrl(val: string) {
      this.rootUrl = val;
    },
    setMarkerRootUrl(val: string) {
      this.markerRootUrl = val;
    }
  }
});
