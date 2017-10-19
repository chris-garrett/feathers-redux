
/* eslint no-var: 0 */

const chai = require('chai');
const chaiImmutable = require('chai-immutable');
chai.use(chaiImmutable);
const assert = chai.assert;
const feathersFakes = require('feathers-tests-fake-app-users');
const reduxifyServices = require('../../src/immutablejs').default;
const fromJS = require('../../src/immutablejs').fromJS;

const usersDb = [];

describe('reduxify:reducer - array of paths (immutable.js)', () => {
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

  it('has a reducer', () => {
    assert.isFunction(services.users.reducer);
  });

  it('returns an initial state', () => {
    const state = services.users.reducer(undefined, '@@INIT'); // action type Redux uses during init
    assert.isObject(state);
    assert.deepEqual(state, fromJS({
      isError: null,
      isLoading: false,
      isSaving: false,
      isFinished: false,
      data: null,
      queryResult: null,
      store: null
    }));
  });

  ['find', 'get', 'create', 'update', 'patch', 'remove'].forEach(method => {
    describe(`returns expected state for ${method}`, () => {
      ['pending', 'fulfilled', 'rejected'].forEach(step => {
        it(`for ${step}`, () => {
          var validStates = getValidStates(false);
          if (method === 'find') { validStates = getValidStates(true, true); }
          if (method === 'get') { validStates = getValidStates(true); }

          const state = services.users.reducer(fromJS({}), reducerActionType(method, step));
          assert.deepEqual(state, validStates.get(step));
        });
      });
    });
  });

  ['get', 'create', 'update', 'patch', 'remove'].forEach(method => {
    describe(`does not change queryResult for ${method}`, () => {
      ['pending', 'fulfilled', 'rejected'].forEach(step => {
        it(`for ${step}`, () => {
          var validStates = getValidStates(false, false, true);
          if (method === 'find') { validStates = getValidStates(true, true, true); }
          if (method === 'get') { validStates = getValidStates(true, false, true); }

          const state = services.users.reducer(
            fromJS({ queryResult: [{ a: 'a' }] }), reducerActionType(method, step)
          );
          assert.deepEqual(state, validStates.get(step));
        });
      });
    });
  });

  ['find', 'get', 'create', 'update', 'patch', 'remove'].forEach(method => {
    describe(`does not change data for ${method}`, () => {
      ['pending'].forEach(step => {
        it(`for ${step}`, () => {
          var validStates = getValidStates(false, false, false, true);
          if (method === 'find') { validStates = getValidStates(true, true, false, true); }
          if (method === 'get') { validStates = getValidStates(true, false, false, true); }

          const state = services.users.reducer(
            fromJS({ data: { a: 'a' }, queryResult: null }), reducerActionType(method, step)
          );
          assert.deepEqual(state, validStates.get(step));
        });
      });
    });
  });

  describe('for reset', () => {
    it('resets state', () => {
      const state = services.users.reducer(fromJS({}), services.users.reset());

      assert.deepEqual(state, fromJS({
        isError: null,
        isLoading: false,
        isSaving: false,
        isFinished: false,
        data: null,
        queryResult: null,
        store: null
      }));
    });

    it('does not reset on isLoading', () => {
      const state = services.users.reducer(fromJS({ isLoading: true }), services.users.reset());
      assert.deepEqual(state, fromJS({ isLoading: true }));
    });

    it('does not reset on isSaving', () => {
      const state = services.users.reducer(fromJS({ isSaving: true }), services.users.reset());
      assert.deepEqual(state, fromJS({ isSaving: true }));
    });

    it('resets queryResult by default', () => {
      const state = services.users.reducer(
        fromJS({ queryResult: [{ a: 'a' }] }), services.users.reset()
      );
      assert.deepEqual(state, fromJS({
        isError: null,
        isLoading: false,
        isSaving: false,
        isFinished: false,
        data: null,
        queryResult: null,
        store: null
      }));
    });

    it('does not reset queryResult on truthy', () => {
      const state = services.users.reducer(
        fromJS({ queryResult: [{ a: 'a' }] }), services.users.reset(true)
      );
      assert.deepEqual(state, fromJS({
        isError: null,
        isLoading: false,
        isSaving: false,
        isFinished: false,
        data: null,
        queryResult: [{ a: 'a' }],
        store: null
      }));
    });
  });

  describe('for store', () => {
    it('resets state', () => {
      const state = services.users.reducer(fromJS({}), services.users.store('harry'));

      assert.deepEqual(state, fromJS({
        store: 'harry'
      }));
    });
  });
});

describe('reduxify:reducer - single path (immutable.js)', () => {
  var db;
  var app;
  var users;
  var services;

  beforeEach(() => {
    db = clone(usersDb);
    app = feathersFakes.app();
    users = feathersFakes.makeDbService(app, 'users', db);
    app.use('users', users);
    services = reduxifyServices(app, 'users');
  });

  it('has a reducer', () => {
    assert.isFunction(services.users.reducer);
  });

  it('returns an initial state', () => {
    const state = services.users.reducer(undefined, '@@INIT'); // action type Redux uses during init
    assert.isObject(state);
    assert.deepEqual(state, fromJS({
      isError: null,
      isLoading: false,
      isSaving: false,
      isFinished: false,
      data: null,
      queryResult: null,
      store: null
    }));
  });
});

describe('reduxify:reducer - path & convenience name (immutable.js)', () => {
  var db;
  var app;
  var users;
  var services;

  beforeEach(() => {
    db = clone(usersDb);
    app = feathersFakes.app();
    users = feathersFakes.makeDbService(app, 'users', db);
    app.use('/users:slug', users);
    services = reduxifyServices(app, { '/users:slug': 'users' });
  });

  it('has a reducer', () => {
    assert.isFunction(services.users.reducer);
  });

  it('returns an initial state', () => {
    const state = services.users.reducer(undefined, '@@INIT'); // action type Redux uses during init
    assert.isObject(state);
    assert.deepEqual(state, fromJS({
      isError: null,
      isLoading: false,
      isSaving: false,
      isFinished: false,
      data: null,
      queryResult: null,
      store: null
    }));
  });
});

// Helpers

function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}

function reducerActionType (method, step) {
  return {
    type: `SERVICES_USERS_${method.toUpperCase()}_${step.toUpperCase()}`,
    payload: 'xxx'
  };
}

function getValidStates (ifLoading, isFind, haveQueryResult) {
  const qr = haveQueryResult ? [{ a: 'a' }] : null;

  return fromJS({
    pending: {
      isError: null,
      isLoading: ifLoading,
      isSaving: !ifLoading,
      isFinished: false,
      data: null,
      queryResult: qr

    },
    fulfilled: {
      isError: null,
      isLoading: false,
      isSaving: false,
      isFinished: true,
      data: !isFind ? 'xxx' : null,
      queryResult: isFind ? 'xxx' : qr
    },
    rejected: {
      isError: 'xxx',
      isLoading: false,
      isSaving: false,
      isFinished: true,
      data: null,
      queryResult: qr
    }
  });
}
