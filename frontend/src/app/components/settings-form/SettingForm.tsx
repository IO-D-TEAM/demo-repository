import { Button, Stack, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import React, { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { Question } from "../../models/Question";
import { Settings } from "../../models/Settings";
import { sendSettingsForm } from "../../services/lobby.data.service";
import Popup from "../popup/Popup";
import "./SettingForm.css";

interface SettingFormProps {}

const SettingForm: FC<SettingFormProps> = () => {
  const [buttonPopup, setButtonPopup] = useState(false);
  const [questions, setQuestions] = useState<Question[]>();
  const form = useForm<Settings>({});
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = (data: Settings) => {
    console.log(data);
    // chujowo ale działa, i wiesz co sie liczy? szacunek ludzi ulicy
    if (questions) {
      const response: Settings = {
        numberOfPlayers: data.numberOfPlayers,
        normalFields: data.normalFields,
        specialFields: data.specialFields,
        timeForAnswer: data.timeForAnswer,
        timeForGame: data.timeForGame,
        questions: questions,
      };
      sendSettingsForm(response);
      setButtonPopup(false);
    } else {
      console.log("Plik z pytaniami jest pusty!!!");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsedQuestions = JSON.parse(
            reader.result as string
          ) as Question[];
          setQuestions(parsedQuestions);
          console.log(parsedQuestions);
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <Button
        className="settingsButton"
        variant="contained"
        color="primary"
        onClick={() => setButtonPopup(true)}
      >
        Ustawienia
      </Button>
      <Popup className="settingPopup" trigger={buttonPopup} setTrigger={setButtonPopup}>
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
              helperText={errors.numberOfPlayers?.message || 'Podaj maksymalną liczbę graczy'}
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
              helperText={errors.normalFields?.message|| 'Podaj liczbę wszystkich pól'}
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
              helperText={errors.specialFields?.message || 'Podaj liczbę pól specjalnych'}
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
              helperText={errors.timeForAnswer?.message || 'Podaj czas na odpowiedź'}
            />
            <TextField
              label="Czas trwania gry"
              variant="outlined"
              type="number"
              InputProps={{
                endAdornment: <InputAdornment position="end">s</InputAdornment>,
              }}
              {...register("timeForGame", {
                required: "Czas trwania gry jest wymagany.",
                validate: (value) =>
                  value > 0 || "Czas trwania musi być większy od 0.",
              })}
              error={!!errors.timeForGame}
              helperText={errors.timeForGame?.message || 'Podaj czas trwania gry'}
            />
            <TextField
              type="file"
              label="Wybierz plik"
              InputLabelProps={{ shrink: true }}
              {...register("questions", {
                required: "Plik z pytaniami jest wymagany.",
              })}
              helperText={errors.questions?.message || ' '}
              inputProps={{ multiple: false, accept: ".json" }}
              onChange={handleFileChange}
            ></TextField>
            <Button type="submit" variant="contained" color="primary" className="submitButton">
              zapisz
            </Button>
          </Stack>
        </form>
      </Popup>
    </div>
  );
};

export default SettingForm;
