import { Card, CardContent, Typography } from "@mui/material";

const CardComponent = ({ title, children }) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        sx={{
          flex: 1,
          overflow: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
};

export default CardComponent;
