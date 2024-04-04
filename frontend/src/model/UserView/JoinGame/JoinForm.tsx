import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { RegisterInfo } from "../../../interfaces/RegisterInfo";
import { TextField, Button, Stack, Select, MenuItem } from "@mui/material";
import { connectToTheGame } from "../../../services/ClientInfo/ClientInfo/ClientInfo";

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        <TextField
          label="Kod gry"
          variant="outlined"
          type="string"
          {...register("gamecode", {
            required: "Kod gry jest wymagany.",
          })}
          error={!!errors.gamecode}
          helperText={errors.gamecode?.message}
        ></TextField>
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
  );
};

export default JoinForm;
