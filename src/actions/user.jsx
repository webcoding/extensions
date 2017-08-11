import Reflux from 'reflux'

var UserActions = Reflux.createActions([
  'load',
  'toggleGroup',
  'updateGroup',
  'insertGroup',
  'removeGroup',
  'swapGroups',
  'saveGroups',
  'updateCollection',
  'updateLanguage',
  'updateConfig',
  'swapCollections',
  'logOut',
  'signIn',
  'signUp'
]);

module.exports = UserActions;
