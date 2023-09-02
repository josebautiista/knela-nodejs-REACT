import PropTypes from "prop-types";
import styled from "styled-components";

const TotalPagarContainer = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 1.5rem;
  @media (max-width: 768px) {
  }
`;

const TotalContainer = styled.div`
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 1.7rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0px;
  }
`;

const TotalLabel = styled.div`
  font-size: 2.5rem;
  color: green;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const TotalValue = styled.div`
  margin-top: 10px;
  font-size: 1.7rem;
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-top: 0px;
  }
`;

export default function TotalPagar({ total, formatNumber, montoPagado }) {
  const parsedMontoPagado =
    montoPagado !== "" ? parseFloat(montoPagado.replace(/\./g, "")) : 0;
  const diferencia = parsedMontoPagado - total;
  return (
    <TotalPagarContainer>
      <TotalContainer>Total a Pagar</TotalContainer>
      <TotalLabel>{formatNumber(total)}</TotalLabel>
      <TotalValue>
        Cambio: {diferencia > 0 ? formatNumber(diferencia) : 0}
      </TotalValue>
    </TotalPagarContainer>
  );
}

TotalPagar.propTypes = {
  total: PropTypes.number.isRequired,
  formatNumber: PropTypes.func.isRequired,
  montoPagado: PropTypes.string.isRequired,
};
