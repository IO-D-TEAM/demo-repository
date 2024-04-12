import React, { FC } from "react";
import "./JoinForm.css";
import { useForm } from "react-hook-form";
import { RegisterInfo } from "../../../interfaces/RegisterInfo";
import { TextField, Button, Stack, Select, MenuItem } from "@mui/material";
import WhiteBackgroundDiv from "../../../globalStyles/whiteBackgroundDiv/whiteBackgroundDiv";

const JoinForm = ({
  onSubmitParent,
}: {
  onSubmitParent: (gamecode: string, nickname: string) => void;
}) => {
  const form = useForm<RegisterInfo>();
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;

  const onSubmit = (data: RegisterInfo) => {
    console.log(data);
    onSubmitParent(data.gamecode, data.nickname);
  };

  return (
    <div className="inputFields">
      <h1>Dołącz do gry</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
            label="Nazwa gracza"
            variant="outlined"
            type="string"
            {...register("nickname", {
              required: "Nazwa gracza jest wymagana.",
            })}
            error={!!errors.nickname}
            helperText={errors.nickname?.message}
          ></TextField>
          <Button type="submit" variant="contained" color="primary">
            prześlij
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default JoinForm;
