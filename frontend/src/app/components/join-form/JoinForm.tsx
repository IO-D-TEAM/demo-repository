import { Button, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { Player } from "../../models/Player";
import "./JoinForm.css";

interface JoinFormProps {
  onSubmitParent: (data: Player) => void;
}

const JoinForm: React.FC<JoinFormProps> = ({ onSubmitParent }) => {
  const { register, handleSubmit, formState } = useForm<Player>();
  const { errors } = formState;

  const onSubmit = (data: Player) => {
    console.log(data); // data zawiera dane z formularza
    onSubmitParent(data);
  };

  return (
    <div className="inputFields">
      <h1>Dołącz do gry</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <TextField
          focused 
            label="Nazwa gracza"
            variant="outlined"
            color="secondary"
            size="medium"
            type="string"
            {...register("nickname", {
              required: "Nazwa gracza jest wymagana.",
              validate: (value) =>
                value.length < 45 ||
                "Twoja nazwa musi miec mniej niż 45 znaków.",
            })}
            error={!!errors.nickname}
            helperText={errors.nickname?.message}
          ></TextField>
          <Button type="submit" variant="contained" color="primary" className="joinButton">
            Dołącz
          </Button>
        </Stack>
      </form>
    </div>
  );
};

export default JoinForm;
