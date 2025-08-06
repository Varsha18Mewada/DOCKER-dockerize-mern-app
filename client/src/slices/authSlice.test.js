import authReducer, { loginSuccess, logoutSuccess } from './authSlice';

describe('authSlice', () => {
  const initialState = {
    token: null,
    id: null,
    userName: '',
  };

  it('should return the initial state when given an undefined state', () => {
    expect(authReducer(undefined, {})).toEqual(initialState);
  });

  describe('loginSuccess', () => {
    it('should handle loginSuccess action and update state with user info', () => {
      const action = {
        type: loginSuccess.type,
        payload: {
          token: 'testToken',
          id: 'testUserId',
          userName: 'testUserName',
        },
      };

      const expectedState = {
        token: 'testToken',
        id: 'testUserId',
        userName: 'testUserName',
      };

      expect(authReducer(initialState, action)).toEqual(expectedState);
    });
  });

  describe('logoutSuccess', () => {
    it('should handle logoutSuccess action and reset state to initial values', () => {
      const loggedInState = {
        token: 'testToken',
        id: 'testUserId',
        userName: 'testUserName',
      };

      const expectedState = {
        token: null,
        id: null,
        userName: '',
      };

      expect(authReducer(loggedInState, { type: logoutSuccess.type })).toEqual(
        expectedState
      );
    });
  });
});
