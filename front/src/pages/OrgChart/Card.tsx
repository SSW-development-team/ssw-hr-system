import { Avatar, Grid, Paper, Stack, Typography } from '@mui/material';

export default function Card(
  rolename: string,
  user: { name: string; img?: string }
) {
  return (
    <Paper>
      <Grid container spacing={2}>
        <Grid xs={4}>
          <Avatar
            src={user.img ?? 'https://mui.com/static/images/avatar/1.jpg'}
          />
        </Grid>
        <Grid xs={8}>
          <Stack>
            <Typography>{user.name}</Typography>
            <Typography>{rolename}</Typography>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}
