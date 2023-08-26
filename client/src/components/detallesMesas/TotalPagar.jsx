import PropTypes from "prop-types";
import styled from "styled-components";

const TotalPagarContainer = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1.5rem;

  & > div:nth-child(1) {
    margin-bottom: 10px;
    font-weight: bold;
    font-size: 1.7rem;
  }

  & > div:nth-child(2) {
    font-size: 2.5rem;
    color: green;
  }

  & > div:nth-child(3) {
    margin-top: 10px;
    font-size: 1.7rem;
  }
`;

export default function TotalPagar({ total, formatNumber, montoPagado }) {
  const diferencia =
    montoPagado !== "" ? parseFloat(montoPagado.replace(/\./g, "")) - total : 0;

  return (
    <TotalPagarContainer>
      <div>Total a Pagar</div>
      <div>{formatNumber(total)}</div>
      <div>Cambio: {diferencia > 0 ? formatNumber(diferencia) : 0}</div>
    </TotalPagarContainer>
  );
}

TotalPagar.propTypes = {
  total: PropTypes.number.isRequired,
  formatNumber: PropTypes.func.isRequired,
  montoPagado: PropTypes.string.isRequired,
};
