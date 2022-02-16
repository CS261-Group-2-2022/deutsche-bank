type FormInputProps = {
  id: string;
  name: string;
  type: string;
  autoComplete?: string;
  placeholder: string;
  error?: string;
  text: string;
  onChange: (text: string) => unknown;
};

export const FormInput = ({
  id,
  name,
  type,
  autoComplete,
  placeholder,
  error,
  text,
  onChange,
}: FormInputProps) => {
  const borderColour = error ? "red" : "gray";
  const focusBorderColour = error ? "red" : "blue";

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        className={`appearance-none relative block w-full px-3 py-2 border border-${borderColour}-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-${focusBorderColour}-500 focus:border-${focusBorderColour}-500 focus:z-10 sm:text-sm transition`}
        placeholder={placeholder}
        value={text}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <div className="block text-sm m-1 font-medium text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};
