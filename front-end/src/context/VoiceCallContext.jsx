import { createContext, useContext } from "react";
import { useSelector } from "react-redux";
import useVoiceCallManager from "../hooks/useVoiceCallManager";
import VoiceCallOverlay from "../components/calls/VoiceCallOverlay";

const VoiceCallContext = createContext(null);

export function VoiceCallProvider({ children }) {
  const { user } = useSelector((state) => state.userProfile);
  const voiceCallValue = useVoiceCallManager(user);

  return (
    <VoiceCallContext.Provider value={voiceCallValue}>
      {children}
      <VoiceCallOverlay {...voiceCallValue} />
      <audio ref={voiceCallValue.remoteAudioRef} className="hidden" autoPlay />
    </VoiceCallContext.Provider>
  );
}

export function useVoiceCall() {
  const contextValue = useContext(VoiceCallContext);

  if (!contextValue) {
    throw new Error("useVoiceCall must be used within VoiceCallProvider");
  }

  return contextValue;
}
