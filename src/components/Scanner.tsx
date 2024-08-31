import React, { useState } from "react";
import { Result, useZxing } from "react-zxing";
import { Exception } from "@zxing/library";
import { Box, Divider, FormControl, InputLabel, Select, SelectChangeEvent, Typography } from "@mui/material";

interface ScannerProps {
  onDecodeResult: (result: Result) => void;
  onDecodeError: (error: Exception) => void;
  onError: (error: unknown) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onDecodeResult, onDecodeError, onError }) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<String | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      try {
        const availableDevices = await navigator.mediaDevices.enumerateDevices();
        const availableVideoDevices = availableDevices.filter(device => device.kind === 'videoinput');
        if (availableVideoDevices.length === 0) {
          console.error('No cameras found');
          setError('No cameras found');
        }
        else {
          setDevices(availableVideoDevices);
          // Check if a device ID is stored in local storage
          const storedDeviceId = localStorage.getItem('asdMusicScannerDeviceId');
          if (storedDeviceId && availableVideoDevices.some(device => device.deviceId === storedDeviceId)) {
            setDeviceId(storedDeviceId); // Use the stored device ID if it exists and is valid
          } else {
            setDeviceId(availableVideoDevices[0].deviceId); // Default to the first video device
          }
        }
      }
      catch (e) {
        console.error('Error getting devices', e);
      }
    }
    )();
  }, []);

  // Handle device selection change
  const handleDeviceChange = (event: SelectChangeEvent) => {
    setDeviceId(event.target.value);
  };

  const { ref } = useZxing({
    onDecodeResult(result) {
      onDecodeResult(result);
    },
    onDecodeError(error) {
      onDecodeError(error);
      setError(error.message);
    },
    onError(error) {
      onError(error);
      setError("Error accessing camera" + error);
    },
    paused: !deviceId,
    deviceId,
  });

  return (
    <Box>

      <video width="100%" ref={ref} />
      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}
      <Divider sx={{ m: 2 }} />
      <FormControl fullWidth>
        <InputLabel id="deviceSelectLabel">Select Camera</InputLabel>
        <Select
          labelId="deviceSelectLabel"
          id="deviceSelect"
          value={deviceId}
          onChange={handleDeviceChange}
          label="Select Camera"
        >
          {devices.map(device => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </option>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Scanner;