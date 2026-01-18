import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../assets/ai.gif";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import userImg from "../assets/user.gif";
function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const [ham, setHam] = useState(false);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const startRecognition = () => {
    if (
      recognitionRef.current &&
      !isSpeakingRef.current &&
      !isRecognizingRef.current
    ) {
      try {
        recognitionRef.current.start();
        // console.log("Recognition requested to start");
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }
  };

  const speak = (text) => {
    // Stop recognition immediately when speaking starts
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        isRecognizingRef.current = false;
        setListening(false);
      } catch (e) {
        // ignore stop errors
      }
    }

    const utterence = new SpeechSynthesisUtterance(text);
    utterence.lang = "hi-IN";
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) {
      utterence.voice = hindiVoice;
    }

    isSpeakingRef.current = true;
    utterence.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      // Small delay before restarting recognition to avoid mic picking up last echo
      setTimeout(() => {
        startRecognition();
      }, 500);
    };
    synth.cancel();
    synth.speak(utterence);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google-search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
    if (type === "calculator-open") {
      window.open(`https://www.google.com/search?q=calculator`, "_blank");
    }
    if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, "_blank");
    }
    if (type === "facebook-open") {
      window.open(`https://www.facebook.com/`, "_blank");
    }
    if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=weather`, "_blank");
    }

    if (type === "youtube-search" || type === "youtube-play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error("Speech Recognition API not supported in this browser.");
      return; 
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true; 

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
      // console.log("Recognition started");
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      // console.log("Recognition ended");

      // Auto-restart if we are not speaking and component is mounted
      // But only if it wasn't a fatal error (handled in onerror)
      if (isMounted && !isSpeakingRef.current) {
        // minimal delay for normal restarts
        setTimeout(() => {
          startRecognition();
        }, 500); 
      }
    };

    recognition.onerror = (event) => {
      isRecognizingRef.current = false;
      setListening(false);

      if (event.error === "no-speech") {
        // Normal behavior, just silence. Restart quickly.
        return; 
        // onend will trigger and restart it.
      }

      console.warn("Recognition error:", event.error);
      
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        // Fatal errors. Stop trying.
        isMounted = false; // Effectively stop the loop
        alert("Microphone access denied or service unavailable.");
        return;
      }

      if (event.error === "network") {
        // Backoff for network errors
        // onend will trigger, but we want to delay the next start logic
        isSpeakingRef.current = true; // Temporary hack to block onend restart
        setTimeout(() => {
           isSpeakingRef.current = false; // Unblock
           if(isMounted) startRecognition();
        }, 5000); // 5 second cool down
        return;
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      // console.log("Heard:", transcript);

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        // Valid command heard
        setAiText("");
        setUserText(transcript);
        
        // Stop recognition processing while we think
        recognition.abort(); 
        isRecognizingRef.current = false;
        setListening(false);

        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

    // Initial Start
    const startTimeout = setTimeout(() => {
       startRecognition();
    }, 1000);

    const greeting = new SpeechSynthesisUtterance(
      `Hello ${userData.name}, what can I help you with?`
    );
    greeting.lang = "hi-IN";
    // window.speechSynthesis.speak(greeting); // Optional: might conflict if not careful, keeping for now

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, [userData]); // Add userData dependency if it's used inside effects setup (like checking name)

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#02023d] flex justify-center items-center flex-col gap-[15px] overflow-hidden">
      <CgMenuRight
        className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"
        onClick={() => setHam(true)}
      />
      <div
        className={`absolute lg:hidden top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start ${
          ham ? "translate-x-0" : "translate-x-full"
        } transition-transform`}
      >
        <RxCross1
          className=" text-white absolute top-[20px] right-[20px] w-[25px] h-[25px]"
          onClick={() => setHam(false)}
        />
        <button
          className="min-w-[150px] h-[60px]  text-black font-semibold   bg-white rounded-full cursor-pointer text-[19px] "
          onClick={handleLogOut}
        >
          Log Out
        </button>
        <button
          className="min-w-[150px] h-[60px]  text-black font-semibold  bg-white  rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] "
          onClick={() => navigate("/customize")}
        >
          Customize your Assistant
        </button>

        <div className="w-full h-[2px] bg-gray-400"></div>
        <h1 className="text-white font-semibold text-[19px]">History</h1>

        <div className="w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col truncate">
          {userData.history?.map((his) => (
            <div className="text-gray-200 text-[18px] w-full h-[30px]  ">
              {his}
            </div>
          ))}
        </div>
      </div>
      <button
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold absolute hidden lg:block top-[20px] right-[20px]  bg-white rounded-full cursor-pointer text-[19px] "
        onClick={handleLogOut}
      >
        Log Out
      </button>
      <button
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold  bg-white absolute top-[100px] right-[20px] rounded-full cursor-pointer text-[19px] px-[20px] py-[10px] hidden lg:block "
        onClick={() => navigate("/customize")}
      >
        Customize your Assistant
      </button>
      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        <img
          src={userData?.assistantImage}
          alt=""
          className="h-full object-cover"
        />
      </div>
      <h1 className="text-white text-[18px] font-semibold">
        I'm {userData?.assistantName}
      </h1>
      {!aiText && <img src={userImg} alt="" className="w-[200px]" />}
      {aiText && <img src={aiImg} alt="" className="w-[200px]" />}

      <h1 className="text-white text-[18px] font-semibold text-wrap">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
}

export default Home;
