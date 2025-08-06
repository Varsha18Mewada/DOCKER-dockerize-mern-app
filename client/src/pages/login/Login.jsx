import React from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { request } from '../../utils/request';
import InputField from '../../components/input/InputField';
import { loginSuccess } from '../../slices/authSlice';
import Button from '../../components/button/Button';
import { API, ApiMethods } from '../../utils/util';
import { emailRegex, passwordRegex } from '../../utils/appConstants';
import { Messages } from '../../utils/messages';
import 'react-toastify/dist/ReactToastify.css';
import '../../App.css';

/** handle login function */
export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = async () => {
    const { username, password } = getValues();
    try {
      const data = {
        username: username,
        password: password,
      };
      const response = await request({
        url: API.authAPI.login,
        method: ApiMethods.POST,
        body: { ...data },
      });
      if (response) {
        if (response.token) {
          dispatch(
            loginSuccess({
              token: response.token,
              id: response.userId,
              userName: response.userName,
            })
          );
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
          localStorage.setItem('userName', response.userName);

          navigate('/');
        } else {
          toast.error(response.error);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(Messages.errors.LOGIN_FAILED);
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="auth-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Login</h2>
          <div className="form-group">
            <InputField
              type="text"
              id="username"
              label="Username"
              {...register('username', {
                required: 'Username is required',
                pattern: {
                  value: emailRegex,
                  message: Messages.errors.INVALId_USERNAME,
                },
              })}
            />
            {errors.username && (
              <span className="error">{errors.username.message}</span>
            )}
          </div>
          <div className="form-group">
            <InputField
              type="password"
              id="password"
              label="Password"
              {...register('password', {
                required: 'Password is required',
                pattern: {
                  value: passwordRegex,
                  message: Messages.errors.INVALID_PASSWORD,
                },
              })}
            />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>
          <Button type="submit" className="btn-login" role="button">
            Login
          </Button>
        </form>
      </div>
    </>
  );
};
