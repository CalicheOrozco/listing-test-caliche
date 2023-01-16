import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import ReactCountdownClock from "react-countdown-clock";
import { HiSpeakerWave } from "react-icons/hi2";

function App() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const [audios, setAudios] = useState([]);
  const [audio, setAudio] = useState(null);
  const [submited, setSubmited] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isCorrect, setIsCorrect] = useState();
  const [replay, setReplay] = useState(3);

  // fetch to get the information from information.json
  const getAudios = async () => {
    const response = await fetch("information.json");
    const data = await response.json();
    setAudios(data);
  };

  // function to get a random phrase
  const getRandomAudio = () => {
    const randomNumero = Math.floor(Math.random() * audios.length);
    const randomAudio = audios[randomNumero];
    setAudio(randomAudio);

    // remove the phrase that was taken
    const newAudios = audios;
    newAudios.splice(randomNumero, 1);
    setAudios(newAudios);
    restart();
  };

  // function to restart the form
  const restart = () => {
    setIsCorrect(null);
    setSubmited(false);
    setReplay(3);
    reset();
  };

  const next = () => {
    restart();
    getRandomAudio();
  };

  // useEffect to execute only once
  useEffect(() => {
    getAudios();
  }, []);

  // useEffect to execute when setAudios changes
  useEffect(() => {
    if (audios.length > 0) {
      getRandomAudio();
    }
  }, [audios]);

  const onSubmit = (data) => {
    // set the data and submited to true
    setSubmited(true);

    // compare the answers
    if (data["answereText"] === audio.answer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  // function to start the audio
  const startAudio = () => {
    if (replay > 0) {
      setReplay(replay - 1);
      const audioFile = new Audio(`Audios/${audio.file}`);
      audioFile.play();
    }
  };

  let afterAnswers = [];

  return (
    <div className="App bg-black w-full min-h-screen flex items-center justify-center">
      {isStarted ? (
        audio ? (
          <div className="px-10 lg:w-1/2">
            {/* Countdown */}
            <div className="w-full flex justify-end mt-3">
              <ReactCountdownClock
                weight={10}
                seconds={!submited ? 60 : 0}
                color="#fff"
                size={80}
                paused={submited}
                onComplete={handleSubmit(onSubmit)}
              />
            </div>
            {/* Form with white space */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <h1 className=" text-4xl font-bold  text-white text-center py-5">
                Type the statement that you hear
              </h1>
              <div className="flex justify-around p-1 flex-col md:flex-row items-center gap-3 md:gap-0">
                <HiSpeakerWave
                  className={

                    replay > 0
                      ? "text-white text-9xl rounded-full bg-orange-600 p-5 cursor-pointer hover:bg-orange-800"
                      : "text-white text-9xl rounded-full p-5 cursor-not-allowed bg-orange-800"
                  }
                  onClick={() => {
                    startAudio();
                  }}
                />
                {/* text area */}
                <textarea
                  className="border-2 border-gray-700 text-black focus:border-orange-600 outline-none text-xl w-80 p-1 rounded-md"
                  placeholder="Your response"
                  spellCheck="false"
                  {...register("answereText", {
                    required: true,
                    maxLength: 1000,
                  })}
                />
              </div>
              <p className="text-white text-lg text-right">
                Number of replay left: {replay}
              </p>
              {/* handle errors */}
              {errors.answereText  && <p className=" text-red-500 text-lg text-center">{"Check your answer something is going wrong"}</p>}

              {!submited ? (
                <div className="w-full flex justify-end ">
                  <input
                    type="submit"
                    value="Submit"
                    className="mt-6 bg-green-500  text-white p-2 w-24 cursor-pointer rounded-xl"
                  />
                </div>
              ) : null}
            </form>
            {/* button repeat and next */}
            <>
              {submited ? (
                <>
                  <p className="text-xl text-center">
                    {isCorrect ? <p className="text-green-600 text-xl text-center">
                    Correct: The correct answer is: {audio.answer}
                  </p> : <p className="text-red-600 text-xl text-center">
                    Incorrect: The correct answer is: {audio.answer}
                  </p>}
                  </p>
                  

                  <div className="w-full flex justify-between">
                    <input
                      type="submit"
                      value="Repeat"
                      onClick={() => {
                        restart();
                      }}
                      className="mt-6 bg-blue-500  text-white p-2 w-24 cursor-pointer rounded-xl"
                    />
                    <input
                      type="submit"
                      value="Next"
                      onClick={() => {
                        next();
                      }}
                      className="mt-6 bg-green-500  text-white p-2 w-24 cursor-pointer rounded-xl"
                    />
                  </div>
                </>
              ) : null}
              {isCorrect === true ? (
                <div className="w-full flex justify-center">
                  {/* Colocar una imagen gif */}
                  <img
                    src="https://i.giphy.com/media/ZdUnQS4AXEl1AERdil/giphy.webp"
                    alt="gif"
                    className=" w-96 h-80 mt-3"
                  />
                </div>
              ) : isCorrect === false ? (
                <div className="w-full flex justify-center">
                  {/* Colocar una imagen gif */}
                  <img
                    src="https://i.giphy.com/media/W5qyPxP1CVLFVsmlsl/giphy.webp"
                    alt="gif"
                    className="w-96 h-80 my-3"
                  />
                </div>
              ) : null}
            </>
          </div>
        ) : (
          <h1 className="text-xl text-white">the audios are over 😢😢</h1>
        )
      ) : (
        // main page with the start button
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl text-white font-bold mb-3 ">
            Welcome to the Listening test
          </h1>
          <p className="text-xl text-white">
            You will have 1 minutes to write what you hear
          </p>
          <input
            type="submit"
            value="Start"
            className="mt-6 bg-green-500  text-white p-2 w-24 cursor-pointer rounded-xl"
            onClick={() => {
              setIsStarted(true);
              startAudio();
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
