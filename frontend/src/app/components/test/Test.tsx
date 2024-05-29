export const GetMsgFromSpring = async (): Promise<string> => {
  let msg: string;

  return await fetch(`/hello`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("papa");
      }
      console.log("pobrany string");
      return response.text();
    })
    .then((data: string) => {
      msg = data;
      return msg;
    });
};
