import { Card, CardContent, Typography } from "@mui/material";

const CardComponent = ({ title, children }) => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: 0,
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
          display: "flex",          
          alignItems: "stretch",    
          justifyContent: "stretch",
          padding: 0,
          overflow: "hidden",       
        }}
      >
        <div style={{ width: "100%", height: "100%" }}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default CardComponent;
