import './Login.css'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import useStore from '../store/useStore'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const Login = ({ logIn, setLogIn }) => {
  const back_end_url = import.meta.env.VITE_BACKEND_URL;
  const { setToken,token} = useStore()
  const navigate = useNavigate()
  const get_response_data = async (operation, values) => {
    const response = await axios.post(`${back_end_url}/users/${operation}`, {
      username: values.userName,
      password: values.password
    })
    if (response.data.status === 'success') {
      toast.success(response.data.message)
      setLogIn(true)
      setToken(response.data.access_token);
      console.log(token);
      const chat_id = response.data.chat_id
      navigate(`/chat/${chat_id}`)

    }
    else {
      toast.error(response.data.message)
      navigate("/")
    }
  }

  const formik = useFormik({
    initialValues: {
      userName: '',
      password: '',
      confirmPassword: ''
    }, onSubmit: (values) => {
      if (logIn) {
       get_response_data("login", values)

      } 
      else {
        if (values.password !== values.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        get_response_data("register", values)

      }
    }
  })


  return (
    <div className="login-box">
      <form className='login-container' onSubmit={formik.handleSubmit}>
        <h1>{logIn ? 'Login' : 'Sign Up'}</h1>
        <input type="text" name="userName" onChange={formik.handleChange} value={formik.values.userName} placeholder="Username" />
        <input type="password" name="password" onChange={formik.handleChange} value={formik.values.password} placeholder="Password" />
        {!logIn ? <input type="password" name="confirmPassword" onChange={formik.handleChange} value={formik.values.confirmPassword} placeholder="Confirm Password" /> : <></>}
        <button type='submit'>{logIn ? 'Login' : 'Sign Up'}</button>
        {logIn ? <p>Don&apos;t have an account? <span onClick={() => setLogIn(false)}>Sign Up</span></p> : <p>Already have an account? <span onClick={() => setLogIn(true)}>Login</span></p>}
      </form>
    </div>
  )
}

export default Login;
