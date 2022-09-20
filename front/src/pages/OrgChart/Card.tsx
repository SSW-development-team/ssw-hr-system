import { Avatar, Paper, Stack, Typography } from '@mui/material';

type Props = {
  rolename: string;
  user: { name: string; img?: string };
  horizontal?: boolean;
};
// const CARD_WIDTH = '300px';
export default function Card(props: Props) {
  const { user, rolename, horizontal } = props;
  return (
    <Stack justifyContent="center" alignItems="center">
      <Paper>
        <Stack direction={horizontal ? 'row' : 'column'} spacing={0.5}>
          <Avatar src={user.img} sx={{ width: 50, height: 50 }} />
          <Stack
            textAlign="left"
            direction={horizontal ? 'column' : 'row-reverse'}
          >
            <Typography
              sx={horizontal ? undefined : { writingMode: 'vertical-rl' }}
            >
              {user.name}
            </Typography>
            <Typography
              sx={horizontal ? undefined : { writingMode: 'vertical-rl' }}
            >
              {rolename}
            </Typography>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
