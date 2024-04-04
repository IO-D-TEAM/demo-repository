import React, { FC, useState } from "react";
import Popup from "../Popup/Popup";
import SettingsIcon from "@mui/icons-material/Settings";
import { Settings } from "../../interfaces/Settings";
import { TextField, Button, Stack, Select, MenuItem } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { useForm } from "react-hook-form";
import { sendSettingsForm } from "../../services/LobbyData/LobbyDataService";

interface SettingFormProps {}

const SettingForm: FC<SettingFormProps> = () => {
  const [buttonPopup, setButtonPopup] = useState(false);
  const form = useForm<Settings>({
    // defaultValues: {
    //   numberOfPlayers: 1,
    //   normalFields: 1,
    //   specialFields: 1,
    //   timeForAnswer: 1,
    //   timeForGame: 1,
    //   questionsSet: "",
    //   boardPattern: 1,
    // },
  });
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = (data: Settings) => {
    console.log(data);
    sendSettingsForm(data);
  };

  const sets = [
    {
      value: "set1",
      label: "set1",
    },
    {
      value: "set2",
      label: "set2",
    },
    {
      value: "set3",
      label: "set3",
    },
    {
      value: "set4",
      label: "set4",
    },
  ];

  return (
    <div>
      <button onClick={() => setButtonPopup(true)}>
        <SettingsIcon></SettingsIcon>
      </button>
      <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
        <h1>Ustawienia</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
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
              select
              defaultValue={""}
              label="Zestaw pytań"
              {...register("questionsSet", {
                required: "Zestaw pytań jest wymagany.",
              })}
              error={!!errors.questionsSet}
              helperText={errors.questionsSet?.message}
            >
              {sets.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Wzór planszy"
              variant="outlined"
              type="number"
              {...register("boardPattern", {
                required: "Wzór planszy jest wymagany.",
              })}
              error={!!errors.boardPattern}
              helperText={errors.boardPattern?.message}
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
