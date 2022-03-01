type FormTextareaProps = {
  id: string;
  name: string;
  autoComplete?: string;
  placeholder: string;
  error?: string;
  text: string;
  required?: boolean;
  onChange: (text: string) => unknown;
};

export const FormTextArea = ({
  id,
  name,
  autoComplete,
  placeholder,
  error,
  text,
  required,
  onChange,
}: FormTextareaProps) => {
  const borderColour = error ? "red" : "gray";
  const focusBorderColour = error ? "red" : "blue";

  return (
    <div>
      <div className="flex text-sm mb-1 font-medium text-gray-700">
        {name}
        {required && <p className="text-red-500 pl-1">*</p>}
      </div>
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <textarea
        id={id}
        name={name}
        autoComplete={autoComplete}
        required={required}
        className={`appearance-none relative block w-full px-3 py-2 border border-${borderColour}-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-${focusBorderColour}-500 focus:border-${focusBorderColour}-500 focus:z-10 sm:text-sm transition`}
        placeholder={placeholder}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
      />
      {error && (
        <div className="block text-sm m-1 font-medium text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};
