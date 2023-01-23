import { useRef, useState, useEffect, useContext } from 'react';
import AuthProvider from '../../Auth/AuthProvider';
import axios from '../../Hooks/Services/Api/axios';

const LOGIN_URL = '/login';

const Login = () => {
    const { setAuth } = useContext(AuthProvider);
    const userRef = useRef();
    const errRef = useRef();
    
    const [email, setUser] = useState('scalikoglu@yandex.com');
    const [passwordHash, setPwd] = useState('17mtq6vkr+T7GJZlwEhfOUVwDWWq9D0CG6qG0bgEaAQAGb30uMFZyxH93h/UHdcDWiEaUbwTXAa8Umn1bjLzJA==');
    
    //const [email, setUser] = useState('');
    //const [passwordHash, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    //const [responseData, setResdata] = useState(Object);
    var responseData;
    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [email, passwordHash])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(JSON.stringify({email, passwordHash}))
            const response = await axios.post(LOGIN_URL,

                JSON.stringify({ email, passwordHash }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    //withCredentials: true
                }
            ).then (res => {
                //setResdata(res.data)
                responseData = res.data;
            });
            console.log(responseData);
            //console.log(JSON.stringify(response));
        
            console.log("token: "+responseData.data.accessToken.token);

            const accessToken = responseData.data.accessToken.token;
            const roles = responseData?.data?.operationClaims.id;
            
            setAuth({ email, passwordHash, roles, accessToken });
            setUser(email);
            setPwd(passwordHash);
            setSuccess(true);
            
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>You are logged in!</h1>
                    <br />
                    <p>
                        <a href="#">Go to Home</a>
                    </p>
                </section>
            ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Sign In</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={email}
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={passwordHash}
                            required
                        />
                        <button>Sign In</button>
                    </form>
                    <p>
                        Need an Account?<br />
                        <span className="line">
                            {/*put router link here*/}
                            <a href="#">Sign Up</a>
                        </span>
                    </p>
                </section>
            )}
        </>
    )
}

export default Login
