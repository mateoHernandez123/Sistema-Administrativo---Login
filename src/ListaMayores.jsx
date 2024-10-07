import TablaMayor from "./TablaMayor";

const ListaMayores = () => {
  const datosMayorCaja = [
    {
      fecha: "01/05/2024",
      operacion: "Inicial",
      debe: 0,
      haber: 0,
      saldo: 2000,
    },
    {
      fecha: "27/08/2024",
      operacion: "Venta de mercadería",
      debe: 2150,
      haber: 0,
      saldo: 4150,
    },
    {
      fecha: "05/08/2024",
      operacion: "Publicidad en redes sociales",
      debe: 0,
      haber: 300,
      saldo: 3850,
    },
    {
      fecha: "07/08/2024",
      operacion: "Adelanto de cliente",
      debe: 2000,
      haber: 0,
      saldo: 5850,
    },
  ];

  const datosMayorClientes = [
    {
      fecha: "02/05/2024",
      operacion: "Cobro a cliente",
      debe: 0,
      haber: 1000,
      saldo: 1000,
    },
    {
      fecha: "15/08/2024",
      operacion: "Factura emitida",
      debe: 1500,
      haber: 0,
      saldo: 2500,
    },
  ];

  return (
    <div>
      <TablaMayor tipoMayor="Caja" datosMayor={datosMayorCaja} />
      <TablaMayor tipoMayor="Clientes" datosMayor={datosMayorClientes} />
    </div>
  );
};

export default ListaMayores;
