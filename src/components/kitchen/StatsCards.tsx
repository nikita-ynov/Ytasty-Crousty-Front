import { Box, Card, CardContent, Typography } from '@mui/material';

interface StatsProps {
  preparingCount: number;
  readyCount: number;
  revenue: number;
}

export const StatsCards = ({ preparingCount, readyCount }: StatsProps) => {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 3, mb: 4 }}>
      <Card sx={{ borderRadius: 4, boxShadow: 'none', bgcolor: '#fff' }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            En préparation
          </Typography>
          <Typography variant="h4" sx={{ my: 1, fontWeight: 700 }}>
            {preparingCount}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Temps moyen : 12 min
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 4, boxShadow: 'none', bgcolor: '#fff' }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Prêtes
          </Typography>
          <Typography variant="h4" sx={{ my: 1, fontWeight: 700 }}>
            {readyCount}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            En attente de coursier
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};