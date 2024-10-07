import { Box } from "@mui/material";
import motoImage from "./image/fondo.jpg";

const Home = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#ffeb3b", // Fondo amarillo
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Imagen de una moto */}
      <img
        src={motoImage} // Reemplaza con la URL de tu imagen
        alt="Moto"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />
    </Box>
  );
};

export default Home;
