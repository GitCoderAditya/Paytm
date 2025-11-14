import PropTypes from "prop-types";

export const Balance = ({ value }) => {
  const formattedValue = typeof value === "number" 
    ? value.toLocaleString("en-IN", { maximumFractionDigits: 2 })
    : value;

  return (
    <div className="flex">
      <div className="font-bold text-lg">Your balance</div>
      <div className="font-semibold ml-4 text-lg">Rs {formattedValue}</div>
    </div>
  );
};

Balance.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};
