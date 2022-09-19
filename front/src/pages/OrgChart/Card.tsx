import { Avatar, Paper, Stack, Typography } from '@mui/material';

type Props = {
  rolename: string;
  user: { name: string; img?: string };
};
// const CARD_WIDTH = '300px';
export default function Card(props: Props) {
  const { user, rolename } = props;
  return (
    <Stack direction="row" justifyContent="center" alignItems="center">
      <Paper>
        <Stack direction="row" spacing={0.5}>
          <Avatar
            src="https://mui.com/static/images/avatar/1.jpg"
            sx={{ width: 50, height: 50 }}
          />
          <Stack textAlign="left">
            <Typography>{user.name}</Typography>
            <Typography>{rolename}</Typography>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
