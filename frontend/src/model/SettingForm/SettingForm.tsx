import React, { FC, useState } from "react";
import Popup from "../Popup/Popup";
import SettingsIcon from "@mui/icons-material/Settings";
import { Settings } from "../../interfaces/Settings";
import { TextField, Button, Stack, Select, MenuItem } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { useForm } from "react-hook-form";
import { sendSettingsForm } from "../../services/LobbyData/LobbyDataService";
import "./SettingForm.css";

interface SettingFormProps {}

const SettingForm: FC<SettingFormProps> = () => {
  const [buttonPopup, setButtonPopup] = useState(false);
  const form = useForm<Settings>({});
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = (data: Settings) => {
    console.log(data);
    sendSettingsForm(data);
  };

  return (
    <div>
      <button onClick={() => setButtonPopup(true)}>
        <SettingsIcon></SettingsIcon>
      </button>
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <h1>Ustawienia</h1>
        <form id="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <TextField
              label="Ilość Graczy"
              variant="outlined"
              type="number"
              {...register("numberOfPlayers", {
                required: "Ilość graczy jest wymagana.",
                validate: (value) =>
                  value > 0 || "Ilość graczy musi być większa od 0.",
              })}
              error={!!errors.numberOfPlayers}
              helperText={errors.numberOfPlayers?.message}
            ></TextField>
            <TextField
              label="Ilość pól"
              variant="outlined"
              type="number"
              {...register("normalFields", {
                required: "Ilość pól jest wymagana.",
                validate: (value) =>
                  value > 0 || "Ilość pól musi być większa od 0.",
              })}
              error={!!errors.normalFields}
              helperText={errors.normalFields?.message}
            ></TextField>
            <TextField
              label="Ilość pól specjalnych"
              variant="outlined"
              type="number"
              {...register("specialFields", {
                required: "Ilość pól specjalnych jest wymagana.",
                validate: (value) =>
                  value > 0 || "Ilość pól specjalnych musi być większa od 0.",
              })}
              error={!!errors.specialFields}
              helperText={errors.specialFields?.message}
            ></TextField>
            <TextField
              label="Czas na odpowiedź"
              variant="outlined"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">s</InputAdornment>,
              }}
              {...register("timeForAnswer", {
                required: "Czas na odpowiedź jest wymagany.",
                validate: (value) =>
                  value > 0 || "Czas na odpowiedź musi być większy od 0.",
              })}
              error={!!errors.timeForAnswer}
              helperText={errors.timeForAnswer?.message}
            />
            <TextField
              label="Czas trwania gry"
              variant="outlined"
              type="number"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">min</InputAdornment>
                ),
              }}
              {...register("timeForGame", {
                required: "Czas trwania gry jest wymagany.",
                validate: (value) =>
                  value > 0 || "Czas trwania musi być większy od 0.",
              })}
              error={!!errors.timeForGame}
              helperText={errors.timeForGame?.message}
            />
            <TextField
              type="file"
              label="Wybierz plik"
              InputLabelProps={{ shrink: true }} // Potrzebne, aby etykieta TextField nie zachowywała się dziwnie w przypadku input typu file
              // onChange={handleFileChange}
              error={!!errors.questionsFile}
              helperText={errors.questionsFile?.message}
              inputProps={{ multiple: false, accept: ".json" }}
            ></TextField>
            <Button type="submit" variant="contained" color="primary">
              zapisz
            </Button>
          </Stack>
        </form>
      </Popup>
    </div>
  );
};

export default SettingForm;
