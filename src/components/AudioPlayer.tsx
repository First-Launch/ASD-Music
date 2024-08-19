// src/components/AudioPlayer.tsx

import React from "react";
import { Box } from "@mui/material";

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <audio controls>
        <source src={audioUrl} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </Box>
  );
};

export default AudioPlayer;
