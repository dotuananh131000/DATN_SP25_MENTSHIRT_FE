export default function RadioButtonGroup({ label, options, name }) {
  return (
    <div>
      <span>{label}</span>
      {options.map((option, key) => (
        <label key={key}>
          <input type="radio" name={name} value={option.value} />
        </label>
      ))}
    </div>
  );
}
