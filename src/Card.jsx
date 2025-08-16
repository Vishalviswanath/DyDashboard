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
        {/* {title && (
        <Typography
          variant="subtitle1"
          sx={{
            p: 1,
            borderBottom: "1px solid #ddd",
            backgroundColor: "#f7f7f7",
            fontWeight: 500,
          }}
        >
          {title}
        </Typography>
      )} */}
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
 
 
