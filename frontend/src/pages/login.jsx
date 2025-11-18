import React from "react";
import { UserStore } from "../store/Userstroe";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const{login,user}=UserStore();
  const logindata=(e)=>{
    e.preventDefault();
  const formdata={
    
  email: e.target.email.value,
  password: e.target.password.value
  }
  console.log("user",user)
   login(formdata);

  }
  const navigate=useNavigate()
  return (
    <div className="min-h-screen bg-[#ECECEC] flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row rounded-md overflow-hidden max-w-6xl w-full gap-6 items-center md:items-end">
        {/* Left Panel - Form */}
        <div className="bg-white w-full md:w-1/2 p-8 space-y-6 shadow-lg rounded-md min-h-[500px] min-w-[300px] md:min-w-[400px]">
          <h1 className="text-center text-3xl font-bold">
            <span className="bg-black text-white px-3 py-1 rounded shadow-md">NOTE</span>
            <span className="text-[#FFA500] ml-2">HUB</span>
          </h1>
          <h2 className="text-xl font-semibold text-gray-700">LOGIN</h2>
          <form className="space-y-4" onSubmit={logindata}>
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="@enter your mail"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
              />
            </div>
           
            <div>
              <label className="block text-sm font-semibold mb-1" htmlFor="password">Password</label>
              
              <input
                type="password"
                id="password"
                  name="password"
                placeholder="@enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
              />
              
            </div>
            <button
              type="submit"
              className="w-full bg-[#332B2B] text-white py-2 rounded hover:bg-[#1f1a1a] transition"
              
            >Login
            </button>
           <p className="text-center text-sm text-gray-600 mt-2">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-[#FFA500] font-medium cursor-pointer underline hover:text-[#cc8400]"
              >
                Sign up here
              </span>
            </p>
          </form>
        </div>

        {/* Right Panel - Welcome Message */}
      {/* Right Panel - Welcome Message */}
{/* Right Panel - Welcome Message */}
<div className="relative bg-[#302D2D] text-white px-10 pt-10 pb-6 shadow-[4px_4px_12px_#302D2D] rounded-md w-1/2 min-h-[580px] min-w-[340px] flex flex-col overflow-hidden">

  {/* NOTE_HUB Logo at the Top */}
  <div>
    <h1 className="text-center text-4xl font-bold mb-6">
      <span className="text-white">NOTE</span>
      <span className="text-[#FFA500]">_HUB</span>
    </h1>
  </div>

  {/* Centered Content in Remaining Space */}
  <div className="flex-1 flex flex-col justify-center">
    <h2 className="text-2xl font-semibold mb-3">
      Welcome to Note <span className="text-[#FFA500]">Hub!</span>
    </h2>
    <p className="text-sm leading-relaxed text-gray-300">
      Your academic journey just got easier. Note Hub is a student-friendly platform where you can
      organize your schedules, store and manage your notes, and collaborate with classmates through
      discussions and shared resources. Whether you're preparing for exams or working on group projects,
      Note Hub keeps everything in one place so you can focus on what matters most — learning and growing.
    </p>
  </div>
</div>


      </div>
     
    </div>
  );
};

export default Login;
