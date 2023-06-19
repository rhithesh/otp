import { RecaptchaVerifier, getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { useState } from 'react';
import { app } from './firebase/firebase';

function App() {

  const auth=getAuth(app)
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState(919606976769);

  const [name,setname]=useState("")
  const[email,setemail]=useState("")
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);

  const [retry,setretry]=useState(false)

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        setretry(false)
        console.log("OTP sended successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      
      });

      setTimeout(  ()=>{
        setLoading(false);
        setretry(true)

      },300000)
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
        console.log("done");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setretry(true)
      });
  }

  
  

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <div style={{ display: 'flex', flexDirection: 'column', border: '3px solid yellow', margin: '4em', padding: '4em', borderRadius: '13px' }}>

          <form action="submit"style={{ display: 'flex', flexDirection: 'column'}}>
          <h1>Registration form</h1>
          <p>Name</p>
          <input type="text" onChange={(e)=>{setname(e.target.value)}} required style={{ height: '2em' }} />
          <p>Email</p>
          <input type="email" required style={{ height: '2em' }} />
          <p>Mobile</p>
          <input type="tel" required onChange={(e) => { setPh(e.target.value) }} style={{ height: '2em' }} />
          <button type="submit" onClick={(e)=>{onSignup(); e.preventDefault()}} style={{ marginTop: '13px', width: '75px', padding: '14px' }}>
            Submit
          </button>
          </form>
          {showOTP ? (
  <>
    <input type="number" onChange={(e) => { setOtp(e.target.value); console.log(otp); }} />
    <button onClick={onOTPVerify}>Verify OTP</button>
  </>
) : (
  loading ? (
    <h4>loading...</h4>
  ) : (
    <></>
  )
)}


          <div id="recaptcha-container"></div>
          <div>{ph}</div>
        </div>
      </div>
    </>
  );
}

export default App;
