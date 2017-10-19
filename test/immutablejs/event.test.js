
/* eslint no-var: 0 */

const chai = require('chai');
const chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
const assert = chai.assert;
const feathersFakes = require('feathers-tests-fake-app-users');
const reduxifyServices = require('../../src/immutablejs').default;

const usersDb = [];

describe('reduxify:event action creator (immutable.js)', () => {
  var db;
  var app;
  var users;
  var services;

  beforeEach(() => {
    db = clone(usersDb);
    app = feathersFakes.app();
    users = feathersFakes.makeDbService(app, 'users', db);
    app.use('users', users);
    services = reduxifyServices(app, ['users']);
  });

  it('has action creator for real time event', () => {
    assert.isFunction(services.users.on);
  });

  it('action creator returns a thunk', () => {
    const action = services.users.on('created', 'dataFake', () => {});
    assert.isFunction(action);
  });

  it('thunk calls handler as expected', (done) => {
    const action = services.users.on('created', 'dataFake', (event, data, dispatch, getState) => {
      assert.equal(event, 'created');
      assert.equal(data, 'dataFake');
      assert.equal(dispatch, 'dispatchFake');
      assert.equal(getState, 'getStateFake');
      done();
    });
    action('dispatchFake', 'getStateFake'); // what thunk middleware does
  });
});

// Helpers

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}
