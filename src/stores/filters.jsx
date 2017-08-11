import Reflux from 'reflux'
import Api from 'api'
import hash from 'object-hash'
var ls = {};

import FiltersActions from '../actions/filters';

var _ = {
  sortBy: require('lodash/sortBy')
}

var _filters = [], _query = {};

module.exports = Reflux.createStore({
  init: function() {
    this.listenTo(FiltersActions.setQuery, this.onSetQuery);
    this.listenTo(FiltersActions.load, this.onLoad);
  },

  onSetQuery(query) {
    _query = query;
  },

  onLoad: function() {
    var cid = parseInt(_query.cid);
    var withSearch = Object.keys(_query.search||{}).length>0;
    var cacheName = hash(_query);

    _filters[cid] = _filters[cid]||{
      lastCacheName: "",
      items: [],
      loading: false,
      loaded: false
    };

    if (_filters[cid].loading)
      return;

    if ((_filters[cid].loaded)&&(_filters[cid].lastCacheName==cacheName)) {
      this.trigger(_filters);
      return;
    }

    _filters[cid].loading = true;
    _filters[cid].items = [];
    this.trigger(_filters);

    /*
    try{ls.getItem(cacheName)
      .then((val)=>{
        if ((val) && (_filters[cid].loading)) {
          _filters[cid].items = val;
          _filters[cid].loading = false;

          this.trigger(_state);
        }
      }).catch(function(e){});}catch(e){}*/

    var searchString = "";
    if (withSearch)
      searchString = encodeURIComponent(JSON.stringify(_query.search));

    Api.get("filters/"+(cid||0)+"?search="+searchString,(json)=>{
      _filters[cid].items = {
        tags: json.tags||[],
        types: json.types||[],
        sites: json.sites||[],
        important: json.important||{},
        best: json.best||{}
      };

      _filters[cid].items.tags = _.sortBy(_filters[cid].items.tags, function(item){
        return item._id;
      });

      _filters[cid].loading = false;
      _filters[cid].loaded = true;

      //try{ls.setItem(cacheName, _filters[cid].items).then(function(){}).catch(function(e){})}catch(e){};

      this.trigger(_filters);
    });
  }
});